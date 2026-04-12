/**
 * Tracker persistence for serverless (no shared writable repo FS on Vercel).
 *
 * - **Redis (recommended on Vercel):** link Redis in the Vercel project, then
 *   `vercel env pull .env.development.local` so `REDIS_URL` is available locally.
 *   Optional `TRACKER_REDIS_KEY` (default `tracker:state`) for the JSON blob key.
 *   Each `participants[]` entry may include optional `color` (CSS color string); omit
 *   or clear to fall back to the hash palette from `participant-color.ts`.
 * - **File:** default on local `next dev` when `REDIS_URL` is unset — `data/tracker.json`.
 * - **Memory:** on Vercel without `REDIS_URL`; resets on cold starts. Force with `TRACKER_STORE=memory`.
 * - **Force file:** `TRACKER_STORE=file` (e.g. local dev without hitting Redis).
 */
import fs from "fs";
import path from "path";
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

/** `color` is optional in persisted JSON; set in Redis to override hash-based color. */
export type TrackerParticipant = {
  id: string;
  name: string;
  count: number;
  color?: string;
};

export type TrackerHistoryEntry = {
  id: string;
  ts: string;
  type: "add" | "update" | "remove";
  participantId: string;
  participantName: string;
  previousCount: number | null;
  newCount: number | null;
};

export type TrackerStoreData = {
  participants: TrackerParticipant[];
  history: TrackerHistoryEntry[];
};

const DATA_PATH = path.join(process.cwd(), "data", "tracker.json");
const REDIS_KEY = process.env.TRACKER_REDIS_KEY ?? "tracker:state";

type StoreMode = "redis" | "file" | "memory";

function resolveMode(): StoreMode {
  if (process.env.TRACKER_STORE === "memory") return "memory";
  if (process.env.TRACKER_STORE === "file") return "file";
  if (process.env.REDIS_URL) return "redis";
  if (process.env.VERCEL) return "memory";
  return "file";
}

const mode = resolveMode();

/** Reuse one TCP connection per warm serverless instance (see Vercel + node-redis docs). */
let redisClient: RedisClient | undefined;
let redisConnecting: Promise<RedisClient> | undefined;

async function getRedis(): Promise<RedisClient> {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("[tracker] REDIS_URL is required when using Redis store");
  }

  if (redisClient?.isOpen) return redisClient;
  if (redisConnecting) return redisConnecting;

  const c = createClient({ url });
  c.on("error", (err) => {
    console.error("[tracker] Redis client error", err);
  });

  redisConnecting = c
    .connect()
    .then(() => {
      redisClient = c;
      redisConnecting = undefined;
      return c;
    })
    .catch((err) => {
      redisConnecting = undefined;
      throw err;
    });

  return redisConnecting;
}

let memoryStore: TrackerStoreData = { participants: [], history: [] };
let warnedMemory = false;

function normalizeParticipant(raw: unknown): TrackerParticipant | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" ? r.id : null;
  const name = typeof r.name === "string" ? r.name : null;
  if (!id || !name) return null;
  const count = Number(r.count);
  const safeCount =
    Number.isFinite(count) && count >= 0 && Number.isInteger(count)
      ? count
      : 0;
  let color: string | undefined;
  if (typeof r.color === "string") {
    const t = r.color.trim();
    if (t.length > 0) color = t.slice(0, 80);
  }
  const out: TrackerParticipant = { id, name, count: safeCount };
  if (color) out.color = color;
  return out;
}

function normalize(data: unknown): TrackerStoreData {
  if (!data || typeof data !== "object") {
    return { participants: [], history: [] };
  }
  const o = data as Partial<TrackerStoreData>;
  const participants = Array.isArray(o.participants)
    ? (o.participants as unknown[])
        .map(normalizeParticipant)
        .filter((p): p is TrackerParticipant => p !== null)
    : [];
  const history = Array.isArray(o.history)
    ? (o.history as TrackerHistoryEntry[])
    : [];
  return { participants, history };
}

function readFileStore(): TrackerStoreData {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return normalize(JSON.parse(raw));
  } catch {
    return { participants: [], history: [] };
  }
}

function writeFileStore(data: TrackerStoreData) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

/** Current persistence backend (for logs / debugging). */
export function trackerStoreMode(): StoreMode {
  return mode;
}

export async function loadTrackerStore(): Promise<TrackerStoreData> {
  if (mode === "redis") {
    const r = await getRedis();
    const raw = await r.get(REDIS_KEY);
    if (raw == null) return { participants: [], history: [] };
    if (typeof raw === "string") {
      try {
        return normalize(JSON.parse(raw));
      } catch {
        return { participants: [], history: [] };
      }
    }
    return normalize(raw);
  }
  if (mode === "file") {
    return readFileStore();
  }
  if (!warnedMemory && process.env.VERCEL) {
    warnedMemory = true;
    console.warn(
      "[tracker] In-memory store (resets on cold starts). Link Redis and set REDIS_URL for persistence.",
    );
  }
  return memoryStore;
}

export async function saveTrackerStore(data: TrackerStoreData): Promise<void> {
  if (mode === "redis") {
    const r = await getRedis();
    await r.set(REDIS_KEY, JSON.stringify(data));
    return;
  }
  if (mode === "file") {
    writeFileStore(data);
    return;
  }
  memoryStore = data;
}
