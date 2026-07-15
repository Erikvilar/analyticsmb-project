import { useCallback, useEffect, useRef, useState } from "react";
import  apiService  from "../service/api.service.ts";

const REFRESH_INTERVAL_MS = 10000;

const KB_TO_MB = 1024;
const KB_TO_GB = 1024 * 1024;

const kbToMB = (kb?: number, decimals = 1): number | undefined =>
    kb !== undefined ? Number((kb / KB_TO_MB).toFixed(decimals)) : undefined;

const kbToGB = (kb?: number, decimals = 2): number | undefined =>
    kb !== undefined ? Number((kb / KB_TO_GB).toFixed(decimals)) : undefined;

// ---- Tipos, espelhando o retorno de getQualityInfo() ----
export interface QualityBreakdown {
    fpsScore: number;
    heapScore: number;
}

export interface QualityMetrics {
    fps?: number;
    jankyPercent?: number;
    p90Ms?: number;
    p99Ms?: number;
    totalPssKB?: number;
}

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
    graphicsKB?: number;
}

export interface MeminfoResult {
    breakdown: MeminfoBreakdownRow[];
    appSummary: MeminfoAppSummary;
    totalPssKB?: number;
    totalRssKB?: number;
    totalSwapPssKB?: number;
    systemTotalRamKB?: number;
    systemAvailRamKB?: number;
}

export interface GfxinfoPercentiles {
    p50?: number;
    p90?: number;
    p95?: number;
    p99?: number;
}

export interface GfxinfoResult {
    totalFramesRendered?: number;
    jankyFrames?: {
        count: number;
        percent: number;
    };
    percentiles?: GfxinfoPercentiles;
}

export interface QualityResult {
    score: number;
    label: string;
    breakdown: QualityBreakdown;
    metrics: QualityMetrics;
    raw: {
        meminfo: MeminfoResult;
        gfxinfo: GfxinfoResult;
    };
}

const initialState: QualityResult = {
    score: null,
    label: "",
    breakdown: { fpsScore: 0, heapScore: 0 },
    metrics: {},
    raw: {
        meminfo: { breakdown: [], appSummary: {} },
        gfxinfo: {},
    },
};

const useQualityData = () => {
    const [state, setState] = useState<QualityResult>(initialState);
    const isMounted = useRef<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const fetchQualityInfo = useCallback(async (options?: { showLoading?: boolean }) => {
        // Zera o score a cada nova chamada, para não exibir o valor
        // da leitura anterior enquanto a nova ainda não chegou
        setState((prev) => ({
            ...prev,

        }));

        if (options?.showLoading) {
            setIsLoading(true);
        }

        try {
            const { status, success, data } = await apiService.getQualityInfo();

            if (success) {
                isMounted.current = true;
                setState(data);
                setIsError(false);
            }else{
                setIsError(true)

            }
        } catch (err) {
            console.error("error", err);
        } finally {
            if (options?.showLoading) {
                setIsLoading(false);
            }
        }
    }, []);

    const refresh = useCallback(() => fetchQualityInfo({ showLoading: true }), [fetchQualityInfo]);

    useEffect(() => {
        fetchQualityInfo({ showLoading: true });
    }, [fetchQualityInfo]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchQualityInfo({ showLoading: false });
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [fetchQualityInfo]);

    const meminfo = state.raw?.meminfo;
    const gfxinfo = state.raw?.gfxinfo;
    const nativeHeap = meminfo?.breakdown?.[0];

    // --- Heap nativo (MB), para exibicao ---
    const heapSizeMB = kbToMB(nativeHeap?.heapSize);
    const heapAllocMB = kbToMB(nativeHeap?.heapAlloc);
    const heapFreeMB = kbToMB(nativeHeap?.heapFree);
    const heapUsagePercent = nativeHeap?.heapAlloc && nativeHeap?.heapSize
        ? Math.floor((nativeHeap.heapAlloc / nativeHeap.heapSize) * 100)
        : 0;

    // --- RAM do device (GB) ---
    const totalRamDeviceGB = kbToGB(meminfo?.systemTotalRamKB);
    const availRamDeviceGB = kbToGB(meminfo?.systemAvailRamKB);
    const usedRamDeviceGB =
        meminfo?.systemTotalRamKB !== undefined && meminfo?.systemAvailRamKB !== undefined
            ? kbToGB(meminfo.systemTotalRamKB - meminfo.systemAvailRamKB)
            : undefined;

    // --- Uso do app (MB) ---
    const appPssMB = kbToMB(meminfo?.totalPssKB);
    const appRssMB = kbToMB(meminfo?.totalRssKB);
    const javaHeapMB = kbToMB(meminfo?.appSummary?.javaHeapKB);
    const nativeHeapMB = kbToMB(meminfo?.appSummary?.nativeHeapKB);
    const graphicsMB = kbToMB(meminfo?.appSummary?.graphicsKB);

    return {
        // score geral
        score: state.score,
        label: state.label,
        breakdown: state.breakdown,

        // metricas prontas do backend
        fps: state.metrics?.fps,
        jankyPercent: state.metrics?.jankyPercent,
        p90Ms: state.metrics?.p90Ms,
        p99Ms: state.metrics?.p99Ms,
        totalFramesRendered: gfxinfo?.totalFramesRendered,
        jankyFramesCount: gfxinfo?.jankyFrames?.count,
        p50Ms: gfxinfo?.percentiles?.p50,
        p95Ms: gfxinfo?.percentiles?.p95,

        // heap nativo (MB)
        heapSizeMB,
        heapAllocMB,
        heapFreeMB,
        heapUsagePercent,

        // RAM do device (GB)
        totalRamDeviceGB,
        availRamDeviceGB,
        usedRamDeviceGB,

        // uso do app (MB)
        appPssMB,
        appRssMB,
        javaHeapMB,
        nativeHeapMB,
        graphicsMB,

        // dados brutos, caso precise de algo nao exposto acima
        data: state,
        refresh,
        isLoading,
        isError
    };
};

export default useQualityData;