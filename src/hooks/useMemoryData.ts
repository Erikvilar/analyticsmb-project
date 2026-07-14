import {useCallback, useEffect,  useRef, useState} from "react";
import apiService from "../service/api.service.ts";


export interface MeminfoBreakdownRow {
    category: string;
    pssTotal?: number;
    privateDirty?: number;
    privateClean?: number;
    swapPssDirty?: number;
    rssTotal?: number;
    heapSize?: number;
    heapAlloc?: number;
    heapFree?: number;
}

export interface MeminfoAppSummary {
    javaHeapKB?: number;
    nativeHeapKB?: number;
    codeKB?: number;
    stackKB?: number;
    graphicsKB?: number;
    privateOtherKB?: number;
    systemKB?: number;
    unknownKB?: number;
}

export interface MeminfoResult {
    pid?: number;
    packageName?: string;
    totalPssKB?: number;
    totalRssKB?: number;
    totalSwapPssKB?: number;
    breakdown: MeminfoBreakdownRow[];
    appSummary: MeminfoAppSummary;
    systemTotalRamKB?: number;
    systemAvailRamKB?: number;
}
const MEMORY_PRESSURE_THRESHOLD = 92;
const REFRESH_INTERVAL_MS = 10000;


const KB_TO_MB = 1024;
const KB_TO_GB = 1024 * 1024;

/** Converte KB para MB, com casas decimais configuráveis. Retorna undefined se input for undefined. */
const kbToMB = (kb?: number, decimals = 1): number | undefined =>
    kb !== undefined ? Number((kb / KB_TO_MB).toFixed(decimals)) : undefined;

/** Converte KB para GB, com casas decimais configuráveis. Retorna undefined se input for undefined. */
const kbToGB = (kb?: number, decimals = 2): number | undefined =>
    kb !== undefined ? Number((kb / KB_TO_GB).toFixed(decimals)) : undefined;

const initialState: MeminfoResult = {
    breakdown: [],
    appSummary: {
        javaHeapKB: 0,
        nativeHeapKB: 0,
        graphicsKB: 0,
    },
    totalPssKB: 0,
    totalRssKB: 0,
    totalSwapPssKB: 0,
};

const useMemoryData = () => {
    const [state, setState] = useState<MeminfoResult>(initialState);
    const isMounted = useRef<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchMemoryInfo = useCallback(async (options?: { showLoading?: boolean }) => {
        setState((prev) => ({ ...prev, totalPssKB: 0 }));

        if (options?.showLoading) {
            setIsLoading(true);
        }

        try {
            const { status, success, data } = await apiService.getMemoryInfo();
            console.log("response status: ", status);
            if (success) {
                isMounted.current = true;
                setState({ ...data });
            }
        } catch (err) {
            console.error("error", err);
        } finally {
            if (options?.showLoading) {
                setIsLoading(false);
            }
        }
    }, []);

    const refresh = useCallback(() => fetchMemoryInfo({ showLoading: true }), [fetchMemoryInfo]);

    useEffect(() => {
        fetchMemoryInfo({ showLoading: true });
    }, [fetchMemoryInfo]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMemoryInfo({ showLoading: false });
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [fetchMemoryInfo]);

    // --- Pressão de memória (real, baseada no sistema) ---
    const usedRamKB =
        state.systemTotalRamKB !== undefined && state.systemAvailRamKB !== undefined
            ? state.systemTotalRamKB - state.systemAvailRamKB
            : undefined;

    const rawPressure =
        usedRamKB !== undefined && state.systemTotalRamKB
            ? (usedRamKB / state.systemTotalRamKB) * 100
            : 0;

    const memoryPressure = Math.floor(Math.min(rawPressure, 100)) || 0;
    const isMemoryPressureCritical = memoryPressure >= MEMORY_PRESSURE_THRESHOLD;

    // --- RAM do dispositivo, em GB (para exibição) ---
    const totalRamDeviceGB = kbToGB(state.systemTotalRamKB);
    const availRamDeviceGB = kbToGB(state.systemAvailRamKB);
    const usedRamDeviceGB = kbToGB(usedRamKB);

    // --- Heap nativo do app (breakdown[0]), em MB ---
    const nativeHeap = state.breakdown?.[0];
    const heapSizeMB = kbToMB(nativeHeap?.heapSize);
    const heapAllocMB = kbToMB(nativeHeap?.heapAlloc);
    const heapFreeMB = kbToMB(nativeHeap?.heapFree);
    const heapUsagePercent = nativeHeap?.heapAlloc && nativeHeap?.heapSize
        ? Math.floor((nativeHeap.heapAlloc / nativeHeap.heapSize) * 100)
        : 0;

    // --- Uso de memória do próprio app, em MB (útil para outro card) ---
    const appPssMB = kbToMB(state.totalPssKB);
    const appRssMB = kbToMB(state.totalRssKB);
    const javaHeapMB = kbToMB(state.appSummary?.javaHeapKB);
    const nativeHeapMB = kbToMB(state.appSummary?.nativeHeapKB);
    const graphicsMB = kbToMB(state.appSummary?.graphicsKB);

    return {
        data: { ...state },
        refresh,
        isLoading,

        // pressão do sistema
        memoryPressure,
        memoryPressureThreshold: MEMORY_PRESSURE_THRESHOLD,
        isMemoryPressureCritical,

        // RAM do dispositivo (GB)
        totalRamDeviceGB,
        availRamDeviceGB,
        usedRamDeviceGB,

        // heap nativo (MB)
        heapSizeMB,
        heapAllocMB,
        heapFreeMB,
        heapUsagePercent,

        // uso do app (MB)
        appPssMB,
        appRssMB,
        javaHeapMB,
        nativeHeapMB,
        graphicsMB,
    };
};

export default useMemoryData;