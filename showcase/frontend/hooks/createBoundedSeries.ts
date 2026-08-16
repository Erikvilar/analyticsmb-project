export interface TimestampedValue {
  timestamp: number;
}

export function appendBoundedSample<T extends TimestampedValue>(
  current: readonly T[],
  sample: T,
  maximumSamples: number,
): readonly T[] {
  if (maximumSamples < 1) return [];
  return [...current, sample].slice(-maximumSamples);
}

