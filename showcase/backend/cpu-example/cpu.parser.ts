import type { DeviceCpuSnapshot } from "./cpu.types.js";

/** Simplified parser for the aggregate `cpu` line from Linux `/proc/stat`. */
export function parseDeviceCpuLine(line: string, timestamp: number): DeviceCpuSnapshot | null {
  const fields = line.trim().split(/\s+/);
  if (fields[0] !== "cpu") return null;

  const counters = fields.slice(1, 9).map(Number);
  if (counters.length < 8 || counters.some((value) => !Number.isFinite(value) || value < 0)) {
    return null;
  }

  const [user, nice, system, idle, iowait, irq, softirq, steal] = counters;
  return {
    timestamp,
    idleTicks: idle + iowait,
    totalTicks: user + nice + system + idle + iowait + irq + softirq + steal,
  };
}

