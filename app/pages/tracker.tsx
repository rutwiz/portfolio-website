import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Layout from "../components/Layout";
import { EndOfDayFlipCountdown } from "@/components/tracker/EndOfDayFlipCountdown";
import { GoalStackedBar } from "@/components/tracker/GoalStackedBar";
import { Button } from "@/components/ui/button";
import { participantColor } from "@/lib/participant-color";
import { cn } from "@/lib/utils";

type Participant = { id: string; name: string; count: number };

type HistoryEntry = {
  id: string;
  ts: string;
  type: "add" | "update" | "remove";
  participantId: string;
  participantName: string;
  previousCount: number | null;
  newCount: number | null;
};

type TrackerState = {
  participants: Participant[];
  total: number;
  target: number;
  history: HistoryEntry[];
};

const inputClass =
  "rounded-lg border border-border bg-canvas/60 px-3 py-2 text-fg placeholder:text-muted focus:border-accent-mist/60 focus:outline-none focus:ring-2 focus:ring-accent-mist/30";

const tabTriggerClass =
  "relative flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-muted outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent-mist data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-sm";

/** Smooth fill for the goal % strip: red → yellow → light green → green by rep total. */
const GOAL_HEAT_STOPS: { t: number; c: [number, number, number] }[] = [
  { t: 0, c: [224, 122, 110] },
  { t: 200, c: [217, 185, 75] },
  { t: 400, c: [155, 198, 145] },
  { t: 800, c: [165, 205, 155] },
  { t: 1000, c: [126, 207, 138] },
];

function goalHeatColor(rawTotal: number): string {
  const total = Math.max(0, Math.min(1000, rawTotal));
  for (let i = 0; i < GOAL_HEAT_STOPS.length - 1; i++) {
    const a = GOAL_HEAT_STOPS[i];
    const b = GOAL_HEAT_STOPS[i + 1];
    if (total <= b.t) {
      const span = b.t - a.t;
      const u = span <= 0 ? 0 : (total - a.t) / span;
      const r = Math.round(a.c[0] + (b.c[0] - a.c[0]) * u);
      const g = Math.round(a.c[1] + (b.c[1] - a.c[1]) * u);
      const bl = Math.round(a.c[2] + (b.c[2] - a.c[2]) * u);
      return `rgb(${r} ${g} ${bl})`;
    }
  }
  const last = GOAL_HEAT_STOPS[GOAL_HEAT_STOPS.length - 1];
  return `rgb(${last.c[0]} ${last.c[1]} ${last.c[2]})`;
}

export default function TrackerPage() {
  const [data, setData] = useState<TrackerState | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [tab, setTab] = useState("board");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/tracker", { cache: "no-store" });
      if (!r.ok) {
        setError("Could not load tracker");
        return;
      }
      const json = (await r.json()) as TrackerState;
      setData({
        ...json,
        history: Array.isArray(json.history) ? json.history : [],
      });
      setError(null);
    } catch {
      setError("Could not load tracker");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addParticipant(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setPending("add");
    setError(null);
    try {
      const r = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError((j as { error?: string }).error ?? "Add failed");
        return;
      }
      setName("");
      toast.success("You’re on the board", {
        description: `${trimmed} joined the challenge.`,
      });
      await load();
    } finally {
      setPending(null);
    }
  }

  async function updateCount(id: string, count: number) {
    setPending(id);
    setError(null);
    try {
      const r = await fetch("/api/tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, count }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError((j as { error?: string }).error ?? "Update failed");
        await load();
        return;
      }
      await load();
    } finally {
      setPending(null);
    }
  }

  async function removeParticipant(id: string) {
    if (!confirm("Remove this participant?")) return;
    setPending(id);
    setError(null);
    try {
      const r = await fetch("/api/tracker", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok && r.status !== 204) {
        setError("Remove failed");
        return;
      }
      toast("Participant removed");
      await load();
    } finally {
      setPending(null);
    }
  }

  const total = data?.total ?? 0;
  const target = data?.target ?? 1000;
  const pct = Math.min(100, Math.round((total / target) * 100));
  const pctDisplay = Math.min(
    100,
    Math.round((total / target) * 1000) / 10,
  );
  const remaining = Math.max(0, target - total);
  const history = data?.history ?? [];

  return (
    <Layout>
      <Toaster richColors position="top-center" theme="dark" closeButton />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Community
        </p>
        <h1 className="mt-3 font-heading text-4xl tracking-tight text-fg sm:text-5xl">
          Push-up challenge
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
          We&apos;re pooling reps toward a shared goal of 1,000 push-ups. Add
          your name, log your count after a session, and watch the total climb.
          No accounts—just don&apos;t grief the board.
        </p>

        {error && (
          <p
            className="mt-6 rounded-lg border border-sunset-orange/40 bg-surface/80 px-4 py-3 text-sm text-sunset-orange"
            role="alert"
          >
            {error}
          </p>
        )}

        <section className="mt-10 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-heading text-2xl text-fg sm:text-3xl">
              Total:{" "}
              <span className="text-accent-sage">{total}</span>
              <span className="text-lg text-muted sm:text-xl"> / {target}</span>
            </span>
            <span className="text-sm text-muted">
              {remaining > 0 ? (
                <>
                  <span className="font-medium text-accent-mist">{remaining}</span>{" "}
                  to goal
                </>
              ) : (
                <span className="font-medium text-lush-green">Goal reached</span>
              )}
            </span>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Progress vs goal
            </p>
            <GoalStackedBar
              participants={data?.participants ?? []}
              total={total}
              target={target}
            />
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-3">
            <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-elevated">
              <motion.div
                className="h-full rounded-full"
                initial={false}
                animate={{
                  width: `${pct}%`,
                  backgroundColor: goalHeatColor(total),
                }}
                transition={{
                  width: { type: "spring", stiffness: 120, damping: 20 },
                  backgroundColor: { duration: 0.75, ease: "easeOut" },
                }}
              />
            </div>
            <span
              className="shrink-0 tabular-nums text-xs font-medium text-muted"
              aria-live="polite"
            >
              {pctDisplay}% of goal
            </span>
          </div>

          <div className="mt-8 border-t border-border/60 pt-8">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Time left today
            </p>
            <p className="mx-auto mt-1 max-w-md text-center text-sm text-muted">
              You only get one shot, do not miss your chance to blow
            </p>
            <div className="mt-5 flex justify-center">
              <EndOfDayFlipCountdown />
            </div>
          </div>
        </section>

        <motion.div
          layout
          className="mt-8 overflow-hidden rounded-2xl border border-accent-mist/25 bg-gradient-to-br from-surface/80 to-elevated/40 p-5 shadow-[0_0_40px_-12px_rgba(163,184,224,0.25)] sm:p-6"
        >
          <h2 className="font-heading text-lg text-fg">Join the board</h2>
          <p className="mt-1 text-sm text-muted">
            Your name shows up instantly—then tap your count whenever you
            finish a set.
          </p>
          <form
            onSubmit={addParticipant}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              className={cn(inputClass, "min-w-0 flex-1")}
              maxLength={80}
              aria-label="Display name"
            />
            <Button type="submit" disabled={pending === "add"} className="shrink-0 sm:px-8">
              {pending === "add" ? "Adding…" : "Add me"}
            </Button>
          </form>
        </motion.div>

        <Tabs.Root
          value={tab}
          onValueChange={setTab}
          className="mt-10"
        >
          <Tabs.List
            className="flex gap-1 rounded-xl border border-border bg-elevated/40 p-1"
            aria-label="Tracker sections"
          >
            <Tabs.Trigger className={tabTriggerClass} value="board">
              Leaderboard
            </Tabs.Trigger>
            <Tabs.Trigger className={tabTriggerClass} value="history">
              History
              {history.length > 0 ? (
                <span className="ml-1.5 rounded-full bg-accent-mist/20 px-2 py-0.5 text-[10px] text-accent-mist">
                  {history.length > 99 ? "99+" : history.length}
                </span>
              ) : null}
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="board" className="mt-6 outline-none">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-elevated/50">
                      <th className="p-4 font-heading text-fg">Participant</th>
                      <th className="w-44 p-4 font-heading text-fg">Push-ups</th>
                      <th className="w-24 p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {!data?.participants.length && (
                      <tr>
                        <td colSpan={3} className="p-10 text-center text-muted">
                          No one here yet. Add your name in the card above.
                        </td>
                      </tr>
                    )}
                    {data?.participants.map((p) => (
                      <motion.tr
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/15"
                              style={{ backgroundColor: participantColor(p.id) }}
                              aria-hidden
                            />
                            <span className="font-medium text-fg">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <CountEditor
                            initial={p.count}
                            disabled={pending === p.id}
                            onSave={(n) => void updateCount(p.id, n)}
                          />
                        </td>
                        <td className="p-4 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => void removeParticipant(p.id)}
                            disabled={!!pending}
                            className="text-xs text-sunset-orange underline-offset-4 transition-colors hover:text-accent-gold focus-visible:rounded focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-40"
                          >
                            Remove
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="history" className="mt-6 outline-none">
            <div className="max-h-[min(28rem,55vh)] overflow-y-auto rounded-2xl border border-border bg-surface/40">
              {!history.length ? (
                <p className="p-10 text-center text-sm text-muted">
                  Changes to the board will show up here with a timestamp—add
                  someone or edit a count to get started.
                </p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {history.map((h) => (
                    <li
                      key={h.id}
                      className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-fg">
                          <span className="font-medium">{h.participantName}</span>{" "}
                          <span className="text-muted">
                            {formatHistoryDetail(h)}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatHistoryBadge(h.type)}
                        </p>
                      </div>
                      <time
                        className="shrink-0 text-xs tabular-nums text-muted sm:text-right"
                        dateTime={h.ts}
                      >
                        {formatTs(h.ts)}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </Layout>
  );
}

function formatHistoryBadge(type: HistoryEntry["type"]) {
  if (type === "add") return "Joined";
  if (type === "update") return "Count updated";
  return "Removed";
}

function formatHistoryDetail(h: HistoryEntry) {
  if (h.type === "add") return "joined the challenge";
  if (h.type === "remove")
    return `removed (was at ${h.previousCount ?? 0} reps)`;
  const prev = h.previousCount ?? 0;
  const next = h.newCount ?? 0;
  return `updated ${prev} → ${next} reps`;
}

function formatTs(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function CountEditor({
  initial,
  onSave,
  disabled,
}: {
  initial: number;
  onSave: (n: number) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState(String(initial));

  useEffect(() => {
    setValue(String(initial));
  }, [initial]);

  function commit() {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n) || n < 0) {
      setValue(String(initial));
      return;
    }
    if (n !== initial) onSave(n);
  }

  function bump(delta: number) {
    const n = Math.max(0, (parseInt(value, 10) || 0) + delta);
    setValue(String(n));
    if (n !== initial) onSave(n);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease count"
        disabled={disabled}
        onClick={() => bump(-1)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-elevated/60 text-lg text-fg transition-colors hover:border-accent-mist/50 hover:bg-surface disabled:opacity-40"
      >
        −
      </button>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className={cn(inputClass, "min-w-0 flex-1 py-1.5 text-center tabular-nums")}
        aria-label="Push-up count"
      />
      <button
        type="button"
        aria-label="Increase count"
        disabled={disabled}
        onClick={() => bump(1)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-elevated/60 text-lg text-fg transition-colors hover:border-accent-mist/50 hover:bg-surface disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
