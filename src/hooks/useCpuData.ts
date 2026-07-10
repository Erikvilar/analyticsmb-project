import { useCallback, useEffect, useState } from "react";
import apiService from "../service/api.service";

const REFRESH_INTERVAL_MS = 10000;

export interface CpuRow {
    pid: number;
    label: string;

    totalPercent: number;

    userPercent?: number;
    kernelPercent?: number;

    faultsMinor?: number;
    faultsMajor?: number;
}

export interface CpuInfoResult {
    rows: CpuRow[];
    totalPercent: number;
}

const initialState: CpuInfoResult = {
    rows: [],
    totalPercent: 0
};

const useCpuData = () => {

    const [state, setState] = useState<CpuInfoResult>(initialState);

    const [isLoading, setIsLoading] = useState(false);

    const [isError, setIsError] = useState(false);

    const fetchCpuInfo = useCallback(async (options?: { showLoading?: boolean }) => {

        if (options?.showLoading) {
            setIsLoading(true);
        }

        try {

            const { success, data } = await apiService.getCpuInfo();

            if (success) {
                setState(data);
                setIsError(false);
            } else {
                setIsError(true);
            }

        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {

            if (options?.showLoading) {
                setIsLoading(false);
            }

        }

    }, []);

    const refresh = useCallback(() => {
        fetchCpuInfo({ showLoading: true });
    }, [fetchCpuInfo]);

    useEffect(() => {
        fetchCpuInfo({ showLoading: true });
    }, [fetchCpuInfo]);

    useEffect(() => {

        const id = setInterval(() => {
            fetchCpuInfo();
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(id);

    }, [fetchCpuInfo]);

    const process = state.rows[0];

    return {

        cpuPercent: state.totalPercent,

        processCpuPercent: process?.totalPercent,

        userCpuPercent: process?.userPercent,

        kernelCpuPercent: process?.kernelPercent,

        faultsMinor: process?.faultsMinor,

        faultsMajor: process?.faultsMajor,

        pid: process?.pid,

        processName: process?.label,

        rows: state.rows,

        data: state,

        refresh,

        isLoading,

        isError

    };

};

export default useCpuData;