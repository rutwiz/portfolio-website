import type { NextApiRequest, NextApiResponse } from "next";
import type { TrackerHistoryEntry, TrackerStoreData } from "@/lib/tracker-store";
import { loadTrackerStore, saveTrackerStore } from "@/lib/tracker-store";
import { participantColor } from "@/lib/participant-color";

export type { TrackerParticipant, TrackerHistoryEntry } from "@/lib/tracker-store";

const TARGET = 1000;
const MAX_HISTORY = 250;

function appendHistory(
  store: TrackerStoreData,
  entry: Omit<TrackerHistoryEntry, "id" | "ts"> & { id?: string; ts?: string },
) {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "GET") {
    const store = await loadTrackerStore();
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
    const body = req.body as { name?: string; color?: string };
    const name = String(body?.name ?? "").trim();
    if (!name) {
      res.status(400).json({ error: "Name required" });
      return;
    }
    if (name.length > 80) {
      res.status(400).json({ error: "Name too long" });
      return;
    }
    const store = await loadTrackerStore();
    const id = crypto.randomUUID();
    let color: string | undefined;
    if (typeof body.color === "string") {
      const t = body.color.trim();
      if (t) color = t.slice(0, 80);
    }
    const participant = {
      id,
      name,
      count: 0,
      color: color ?? participantColor(id),
    };
    store.participants.push(participant);
    appendHistory(store, {
      type: "add",
      participantId: id,
      participantName: name,
      previousCount: null,
      newCount: 0,
    });
    await saveTrackerStore(store);
    res.status(201).json({ participant });
    return;
  }

  if (req.method === "PATCH") {
    const body = req.body as {
      id?: string;
      count?: unknown;
      color?: unknown;
      name?: unknown;
    };
    const { id } = body;
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "id required" });
      return;
    }
    const hasCount = "count" in body;
    const hasColor = "color" in body;
    const hasName = "name" in body;
    if (!hasCount && !hasColor && !hasName) {
      res
        .status(400)
        .json({ error: "Provide count, name, and/or color to update" });
      return;
    }

    const store = await loadTrackerStore();
    const p = store.participants.find((x) => x.id === id);
    if (!p) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const countBefore = p.count;

    if (hasName) {
      const nm = String(body.name ?? "").trim();
      if (!nm) {
        res.status(400).json({ error: "name must be non-empty" });
        return;
      }
      if (nm.length > 80) {
        res.status(400).json({ error: "Name too long" });
        return;
      }
      p.name = nm;
    }

    if (hasColor) {
      if (body.color === null) {
        delete p.color;
      } else if (typeof body.color === "string") {
        const t = body.color.trim();
        if (t === "") delete p.color;
        else p.color = t.slice(0, 80);
      } else {
        res.status(400).json({ error: "color must be a string or null" });
        return;
      }
    }

    if (hasCount) {
      const n = Number(body.count);
      if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
        res.status(400).json({ error: "count must be a non-negative integer" });
        return;
      }
      if (!hasName && !hasColor && n === countBefore) {
        res.status(200).json({ participant: p });
        return;
      }
      const previousCount = p.count;
      if (previousCount !== n) {
        p.count = n;
        appendHistory(store, {
          type: "update",
          participantId: id,
          participantName: p.name,
          previousCount,
          newCount: n,
        });
      }
    }

    await saveTrackerStore(store);
    res.status(200).json({ participant: p });
    return;
  }

  if (req.method === "DELETE") {
    const id = String((req.body as { id?: string })?.id ?? "").trim();
    if (!id) {
      res.status(400).json({ error: "id required" });
      return;
    }
    const store = await loadTrackerStore();
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
    await saveTrackerStore(store);
    res.status(204).end();
    return;
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  res.status(405).json({ error: "Method not allowed" });
}
