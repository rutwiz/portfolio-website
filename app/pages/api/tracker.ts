import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export type TrackerParticipant = { id: string; name: string; count: number };

export type TrackerHistoryEntry = {
  id: string;
  ts: string;
  type: "add" | "update" | "remove";
  participantId: string;
  participantName: string;
  previousCount: number | null;
  newCount: number | null;
};

type Store = {
  participants: TrackerParticipant[];
  history: TrackerHistoryEntry[];
};

const DATA_PATH = path.join(process.cwd(), "data", "tracker.json");
const TARGET = 1000;
const MAX_HISTORY = 250;

function readStore(): Store {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    const participants = Array.isArray(parsed.participants)
      ? (parsed.participants as TrackerParticipant[])
      : [];
    const history = Array.isArray(parsed.history)
      ? (parsed.history as TrackerHistoryEntry[])
      : [];
    return { participants, history };
  } catch {
    return { participants: [], history: [] };
  }
}

function writeStore(data: Store) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function appendHistory(store: Store, entry: Omit<TrackerHistoryEntry, "id" | "ts"> & { id?: string; ts?: string }) {
  const row: TrackerHistoryEntry = {
    id: entry.id ?? crypto.randomUUID(),
    ts: entry.ts ?? new Date().toISOString(),
    type: entry.type,
    participantId: entry.participantId,
    participantName: entry.participantName,
    previousCount: entry.previousCount,
    newCount: entry.newCount,
  };
  store.history.unshift(row);
  if (store.history.length > MAX_HISTORY) {
    store.history.length = MAX_HISTORY;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "GET") {
    const store = readStore();
    const total = store.participants.reduce((s, p) => s + p.count, 0);
    res.status(200).json({
      participants: store.participants,
      total,
      target: TARGET,
      history: store.history,
    });
    return;
  }

  if (req.method === "POST") {
    const name = String((req.body as { name?: string })?.name ?? "").trim();
    if (!name) {
      res.status(400).json({ error: "Name required" });
      return;
    }
    const store = readStore();
    const id = crypto.randomUUID();
    store.participants.push({ id, name, count: 0 });
    appendHistory(store, {
      type: "add",
      participantId: id,
      participantName: name,
      previousCount: null,
      newCount: 0,
    });
    writeStore(store);
    res.status(201).json({ participant: { id, name, count: 0 } });
    return;
  }

  if (req.method === "PATCH") {
    const { id, count } = req.body as { id?: string; count?: unknown };
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "id required" });
      return;
    }
    const n = Number(count);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      res.status(400).json({ error: "count must be a non-negative integer" });
      return;
    }
    const store = readStore();
    const p = store.participants.find((x) => x.id === id);
    if (!p) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const previousCount = p.count;
    if (previousCount === n) {
      res.status(200).json({ participant: p });
      return;
    }
    p.count = n;
    appendHistory(store, {
      type: "update",
      participantId: id,
      participantName: p.name,
      previousCount,
      newCount: n,
    });
    writeStore(store);
    res.status(200).json({ participant: p });
    return;
  }

  if (req.method === "DELETE") {
    const id = String((req.body as { id?: string })?.id ?? "").trim();
    if (!id) {
      res.status(400).json({ error: "id required" });
      return;
    }
    const store = readStore();
    const removed = store.participants.find((x) => x.id === id);
    if (!removed) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    store.participants = store.participants.filter((x) => x.id !== id);
    appendHistory(store, {
      type: "remove",
      participantId: id,
      participantName: removed.name,
      previousCount: removed.count,
      newCount: null,
    });
    writeStore(store);
    res.status(204).end();
    return;
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  res.status(405).json({ error: "Method not allowed" });
}
