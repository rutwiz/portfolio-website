"use client";

import { useMemo } from "react";
import { participantColor } from "@/lib/participant-color";
import { cn } from "@/lib/utils";

type Participant = { id: string; name: string; count: number };

type Props = {
  participants: Participant[];
  total: number;
  target: number;
};

type StackSeg = {
  key: string;
  label: string;
  value: number;
  color: string;
  kind: "participant" | "remainder";
};

const REMAINDER_FILL = "rgba(146, 136, 163, 0.22)";

function formatReps(v: number): string {
  const rounded = Math.round(v * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function buildStack(
  /** API order: first index = earliest join, leftmost in the bar. */
  participants: Participant[],
  total: number,
  target: number,
): { segments: StackSeg[]; remainder: number } {
  const segments: StackSeg[] = [];
  const ordered = participants.slice();

  if (total <= 0) {
    return { segments, remainder: target };
  }

  if (total > target) {
    const scale = target / total;
    for (const p of ordered) {
      if (p.count <= 0) continue;
      const v = p.count * scale;
      segments.push({
        key: `p_${p.id}`,
        label: p.name,
        value: v,
        color: participantColor(p.id),
        kind: "participant",
      });
    }
    const sum = segments.reduce((s, x) => s + x.value, 0);
    if (segments.length && Math.abs(sum - target) > 1e-6) {
      segments[segments.length - 1].value += target - sum;
    }
    return { segments, remainder: 0 };
  }

  for (const p of ordered) {
    if (p.count <= 0) continue;
    segments.push({
      key: `p_${p.id}`,
      label: p.name,
      value: p.count,
      color: participantColor(p.id),
      kind: "participant",
    });
  }
  return { segments, remainder: Math.max(0, target - total) };
}

export function GoalStackedBar({ participants, total, target }: Props) {
  const { segments, remainder } = useMemo(
    () => buildStack(participants, total, target),
    [participants, total, target],
  );

  const showRemainder = remainder > 1e-6;

  const slices: StackSeg[] = useMemo(() => {
    const out = [...segments];
    if (showRemainder) {
      out.push({
        key: "remainder",
        label: "To goal",
        value: remainder,
        color: REMAINDER_FILL,
        kind: "remainder",
      });
    }
    return out;
  }, [segments, showRemainder, remainder]);

  const ariaLabel = useMemo(() => {
    const parts = slices.map(
      (s) => `${s.label} ${formatReps(s.value)} toward ${target}`,
    );
    return parts.length ? parts.join(", ") : `Goal ${target}, no progress yet`;
  }, [slices, target]);

  return (
    <div
      className="flex h-14 w-full min-w-0 overflow-hidden rounded-lg bg-elevated/50"
      role="img"
      aria-label={ariaLabel}
    >
      {slices.map((seg) => (
        <div
          key={seg.key}
          tabIndex={0}
          className="group relative h-full min-w-0 cursor-default outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-mist/35"
          style={{
            flex: `${Math.max(seg.value, 0)} 1 0%`,
            backgroundColor: seg.color,
          }}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-1 pt-1",
              "opacity-0 transition-opacity duration-150 motion-reduce:transition-none",
              "group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <div className="max-w-full min-w-0 rounded-md border border-border/80 bg-surface/95 px-2 py-1 text-center shadow-md backdrop-blur-sm">
              <span
                className={cn(
                  "block truncate text-sm font-medium leading-tight",
                  seg.kind === "remainder" && "text-muted",
                )}
                style={
                  seg.kind === "participant"
                    ? { color: seg.color }
                    : undefined
                }
              >
                {seg.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-tight text-muted">
                {seg.kind === "remainder" ? (
                  <>
                    <span className="font-medium text-fg">{formatReps(seg.value)}</span>{" "}
                    reps left · goal {target}
                  </>
                ) : (
                  <>
                    <span className="font-medium text-fg">{formatReps(seg.value)}</span>{" "}
                    reps
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
