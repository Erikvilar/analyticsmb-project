export interface ShowcaseWidgetDefinition {
  id: string;
  title: string;
  description: string;
  requiredSignals: readonly string[];
}

export const PERFORMANCE_WIDGETS: readonly ShowcaseWidgetDefinition[] = [
  {
    id: "cpu-timeline",
    title: "CPU over time",
    description: "Compares device and application CPU on a synchronized timeline.",
    requiredSignals: ["deviceCpuPercent", "appCpuPercent"],
  },
  {
    id: "memory-pressure",
    title: "Memory pressure",
    description: "Provides context for process memory and available system RAM.",
    requiredSignals: ["pssMb", "availableRamMb"],
  },
] as const;

