export type MetricState<T> =
  | { status: "loading" }
  | { status: "empty"; message: string }
  | { status: "error"; message: string }
  | { status: "unavailable"; reason: string }
  | { status: "ready"; value: T };

export function describeMetric<T>(state: MetricState<T>, format: (value: T) => string): string {
  switch (state.status) {
    case "ready":
      return format(state.value);
    case "loading":
      return "Loading";
    case "empty":
    case "error":
      return state.message;
    case "unavailable":
      return state.reason;
  }
}

