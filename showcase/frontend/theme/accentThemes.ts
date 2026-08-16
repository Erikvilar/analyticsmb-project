export interface AccentTheme {
  id: string;
  label: string;
  accent: `#${string}`;
}

export const ACCENT_THEMES: readonly AccentTheme[] = [
  { id: "cyber-orange", label: "Cyber Orange", accent: "#ff8a00" },
  { id: "neo-green", label: "Neo Green", accent: "#38d996" },
  { id: "future-blue", label: "Future Blue", accent: "#4aa3ff" },
  { id: "future-purple", label: "Future Purple", accent: "#a879ff" },
] as const;

