/**
 * Simplified showcase implementation.
 * Production collectors, diagnostics and persistence are intentionally private.
 */
export interface DeviceCpuSnapshot {
  timestamp: number;
  idleTicks: number;
  totalTicks: number;
}

export interface ProcessCpuSnapshot {
  timestamp: number;
  pid: number;
  processTicks: number;
}

export interface CpuSample {
  timestamp: number;
  deviceCpuPercent: number;
  appCpuPercent: number | null;
  processAlive: boolean;
  valid: boolean;
}

