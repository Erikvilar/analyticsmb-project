import {useEffect, useState} from "react";
import { FilterDropdown, type FilterOption } from "./../filterDropdown/FilterDropdown.tsx";
import "./FilterBar.css";
import useFilterBar from "../../hooks/useFilterBar.ts";

// ---------- Mock data ----------
const PACKAGE_OPTIONS: FilterOption[] = [
    { label: "com.analytics.mb", value: "com.analytics.mb" },
    { label: "com.analytics.mb.debug", value: "com.analytics.mb.debug" },
    { label: "com.analytics.mb.staging", value: "com.analytics.mb.staging" },
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


    const [thread, setThread] = useState(THREAD_OPTIONS[0].value);
    const [interval, setInterval] = useState(INTERVAL_OPTIONS[0].value);
    const {processes} = useFilterBar();

    const processesMap: FilterOption[] = processes.map(p => ({
        label: p,
        value: p
    }));
    const [proc, setProc] = useState();
    useEffect(() => {
        const process = JSON.stringify(localStorage.getItem('process'));
       setProc(process)
    },[])
    const handleProcess = (e:any) => {
        localStorage.setItem("process", JSON.stringify(e));
        setProc(e);
    }

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
                options={processesMap}
                onChange={handleProcess}
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