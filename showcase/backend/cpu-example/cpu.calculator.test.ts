import assert from "node:assert/strict";
import test from "node:test";
import { calculateAppCpu, calculateDeviceCpu } from "./cpu.calculator.ts";

test("calculates device utilization from cumulative counter deltas", () => {
  const result = calculateDeviceCpu(
    { timestamp: 1, idleTicks: 1_000, totalTicks: 2_000 },
    { timestamp: 2, idleTicks: 8_200, totalTicks: 10_000 },
  );
  assert.equal(result, 10);
});

test("normalizes application ticks against aggregate device ticks", () => {
  const deviceBefore = { timestamp: 1, idleTicks: 1_000, totalTicks: 2_000 };
  const deviceAfter = { timestamp: 2, idleTicks: 8_200, totalTicks: 10_000 };
  const result = calculateAppCpu(
    deviceBefore,
    deviceAfter,
    { timestamp: 1, pid: 1234, processTicks: 500 },
    { timestamp: 2, pid: 1234, processTicks: 780 },
  );
  assert.equal(result, 3.5000000000000004);
});

test("invalidates the first sample after a PID change", () => {
  const result = calculateAppCpu(
    { timestamp: 1, idleTicks: 1_000, totalTicks: 2_000 },
    { timestamp: 2, idleTicks: 1_500, totalTicks: 3_000 },
    { timestamp: 1, pid: 1234, processTicks: 500 },
    { timestamp: 2, pid: 5678, processTicks: 20 },
  );
  assert.equal(result, null);
});

