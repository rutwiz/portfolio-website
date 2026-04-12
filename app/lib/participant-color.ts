/** Stable saturated colors for charts / UI (dark-bg friendly). */
const PALETTE = [
  "#7fb69b",
  "#a3b8e0",
  "#c9a86c",
  "#e07a6e",
  "#9b7ed6",
  "#5eb8c4",
  "#d484c8",
  "#8bc494",
  "#e8a598",
  "#7b9fd4",
];

export function participantColor(participantId: string): string {
  let h = 0;
  for (let i = 0; i < participantId.length; i++) {
    h = (h * 31 + participantId.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
}
