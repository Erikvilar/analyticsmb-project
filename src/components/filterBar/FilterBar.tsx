import { useState } from "react";
import { FilterDropdown, type FilterOption } from "./../filterDropdown/FilterDropdown.tsx";
import "./FilterBar.css";

// ---------- Mock data ----------
const PACKAGE_OPTIONS: FilterOption[] = [
    { label: "com.analytics.mb", value: "com.analytics.mb" },
    { label: "com.analytics.mb.debug", value: "com.analytics.mb.debug" },
    { label: "com.analytics.mb.staging", value: "com.analytics.mb.staging" },
];

const PROCESS_OPTIONS: FilterOption[] = [
    { label: "Main", value: "main" },
    { label: "com.analytics.mb:push", value: "push" },
    { label: "com.analytics.mb:sync", value: "sync" },
];

const THREAD_OPTIONS: FilterOption[] = [
    { label: "All Threads", value: "all" },
    { label: "main", value: "main-thread" },
    { label: "OkHttp Dispatcher", value: "okhttp-dispatcher" },
    { label: "GC Thread", value: "gc-thread" },
];

const INTERVAL_OPTIONS: FilterOption[] = [
    { label: "Real-time", value: "realtime" },
    { label: "Last 5 minutes", value: "5m" },
    { label: "Last 15 minutes", value: "15m" },
    { label: "Last 1 hour", value: "1h" },
];

export function FilterBar() {
    const [pkg, setPkg] = useState(PACKAGE_OPTIONS[0].value);
    const [proc, setProc] = useState(PROCESS_OPTIONS[0].value);
    const [thread, setThread] = useState(THREAD_OPTIONS[0].value);
    const [interval, setInterval] = useState(INTERVAL_OPTIONS[0].value);

    return (
        <div className="filter-bar" role="toolbar" aria-label="Filtros de memória">
            <FilterDropdown
                label="Package"
                value={pkg}
                options={PACKAGE_OPTIONS}
                onChange={setPkg}
            />
            <FilterDropdown
                label="Process"
                value={proc}
                options={PROCESS_OPTIONS}
                onChange={setProc}
            />
            <FilterDropdown
                label="Thread"
                value={thread}
                options={THREAD_OPTIONS}
                onChange={setThread}
            />
            <FilterDropdown
                label="Interval"
                value={interval}
                options={INTERVAL_OPTIONS}
                onChange={setInterval}
            />
        </div>
    );
}

export default FilterBar;