import type { DeviceCpuSnapshot, ProcessCpuSnapshot } from "./cpu.types.js";

const percent = (part: number, total: number): number => (part / total) * 100;

export function calculateDeviceCpu(
  previous: DeviceCpuSnapshot,
  current: DeviceCpuSnapshot,
): number | null {
  const deltaTotal = current.totalTicks - previous.totalTicks;
  const deltaIdle = current.idleTicks - previous.idleTicks;
  if (deltaTotal <= 0 || deltaIdle < 0 || deltaIdle > deltaTotal) return null;
  return percent(deltaTotal - deltaIdle, deltaTotal);
}

export function calculateAppCpu(
  previousDevice: DeviceCpuSnapshot,
  currentDevice: DeviceCpuSnapshot,
  previousProcess: ProcessCpuSnapshot | null,
  currentProcess: ProcessCpuSnapshot | null,
): number | null {
  if (!previousProcess || !currentProcess || previousProcess.pid !== currentProcess.pid) return null;

  const deltaTotal = currentDevice.totalTicks - previousDevice.totalTicks;
  const deltaProcess = currentProcess.processTicks - previousProcess.processTicks;
  if (deltaTotal <= 0 || deltaProcess < 0) return null;
  return percent(deltaProcess, deltaTotal);
}

