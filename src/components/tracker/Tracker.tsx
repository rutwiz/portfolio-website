import trackerData from "@/data/tracker.json";
import { participantDisplayColor } from "./participant-color";

interface Participant {
  id: string;
  name: string;
  count: number;
  color?: string;
}

const participants = (trackerData as { participants: Participant[] })
  .participants;

const target = 1000;

export default function Tracker() {
  const total = participants.reduce((sum, p) => sum + p.count, 0);
  const pct = Math.min(100, Math.round((total / target) * 100));
  const remainder = Math.max(0, target - total);

  const sorted = [...participants].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
          Challenge concluded
        </span>
        <p className="font-mono text-sm text-muted">
          Total: <strong className="text-fg">{total}</strong> / {target}{" "}
          push-ups
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-2 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
        <p className="font-mono text-xs text-faint">{pct}% of goal</p>
      </div>

      <div className="flex h-12 overflow-hidden rounded-lg bg-elevated">
        {sorted.map((p) => (
          <div
            key={p.id}
            title={`${p.name}: ${p.count}`}
            style={{
              flexGrow: p.count,
              backgroundColor: participantDisplayColor(p),
            }}
          />
        ))}
        {remainder > 0 && (
          <div
            title={`Remaining: ${remainder}`}
            style={{
              flexGrow: remainder,
              backgroundColor: "var(--border)",
            }}
          />
        )}
      </div>

      <div>
        <h3 className="eyebrow mb-3">Leaderboard</h3>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {sorted.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 py-2.5"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: participantDisplayColor(p) }}
                aria-hidden="true"
              />
              <span className="flex-1 text-fg">{p.name}</span>
              <span className="text-right font-mono text-muted">{p.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
