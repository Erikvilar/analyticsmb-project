export interface CpuInfoRow {
    /** Percentual total de CPU dessa linha (processo ou thread) */
    totalPercent: number;
    pid: number;
    /** Nome do processo (linha principal) ou da thread (linhas filhas) */
    label: string;
    userPercent: number;
    kernelPercent: number;
    faultsMinor?: number;
    faultsMajor?: number;
}

export interface CpuInfoResult {
    rows: CpuInfoRow[];
    /** Soma do totalPercent de todas as linhas retornadas (aproxima o custo total do pacote) */
    totalPercent: number;
}


export function parseCpuInfo(raw: string): CpuInfoResult {
    const rowRegex = /^\s*([\d.]+)%\s+(\d+)\/([^:]+):\s+([\d.]+)%\s+user\s+\+\s+([\d.]+)%\s+kernel(?:\s*\/\s*faults:\s*(\d+)\s*minor(?:\s+(\d+)\s*major)?)?/;

    const rows: CpuInfoRow[] = [];
    console.log(raw)
    for (const line of raw.split(/\r?\n/)) {
        const m = line.match(rowRegex);
        if (!m) continue;

        rows.push({
            totalPercent: Number(m[1]),
            pid: Number(m[2]),
            label: m[3].trim(),
            userPercent: Number(m[4]),
            kernelPercent: Number(m[5]),
            faultsMinor: m[6] !== undefined ? Number(m[6]) : undefined,
            faultsMajor: m[7] !== undefined ? Number(m[7]) : undefined,
        });
    }

    const totalPercent = Number(rows.reduce((sum, r) => sum + r.totalPercent, 0).toFixed(1));

    return { rows, totalPercent };
}