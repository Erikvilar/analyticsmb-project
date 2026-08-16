import type { CSSProperties } from "react";

export interface CpuPoint {
  timestamp: number;
  deviceCpuPercent: number;
  appCpuPercent: number | null;
}

interface CpuTimelineCardProps {
  samples: readonly CpuPoint[];
  accentColor: string;
}

const chartStyle = (accentColor: string): CSSProperties => ({
  border: `1px solid color-mix(in srgb, ${accentColor} 45%, #333)`,
  borderRadius: 12,
  padding: 16,
  background: "#0b0d10",
  color: "#f4f7fa",
});

/**
 * Reduced presentation component. The production chart library integration,
 * data service and diagnostics remain private.
 */
export function CpuTimelineCard({ samples, accentColor }: CpuTimelineCardProps) {
  const latest = samples.at(-1);

  if (!latest) {
    return <section style={chartStyle(accentColor)} aria-label="CPU timeline">No samples available.</section>;
  }

  return (
    <section style={chartStyle(accentColor)} aria-labelledby="cpu-title">
      <header>
        <h2 id="cpu-title">CPU over time</h2>
        <p>Device {latest.deviceCpuPercent.toFixed(1)}%</p>
        <p>Application {latest.appCpuPercent === null ? "Unavailable" : `${latest.appCpuPercent.toFixed(1)}%`}</p>
      </header>
      <div role="img" aria-label={`CPU timeline containing ${samples.length} synchronized samples`}>
        {/* A production chart renders both series with axes, legend and accessible tooltips. */}
        {samples.length} synchronized samples
      </div>
    </section>
  );
}

