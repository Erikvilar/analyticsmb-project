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
    // NOVO: dados reais do sistema, necessários para pressão real
    systemTotalRamKB?: number;
    systemAvailRamKB?: number;
}
const num = (v: string | undefined): number | undefined => {
    if (v === undefined) return undefined;
    const n = Number(v.replace(/,/g, "").trim());
    return Number.isNaN(n) ? undefined : n;
};

/**
 * Faz o parse da saida de `adb shell dumpsys meminfo <package>`.
 * Formato esperado (varia um pouco por versao do Android):
 *
 * ** MEMINFO in pid 1234 [com.package] **
 *                    Pss  Private  Private  SwapPss      Rss     Heap     Heap     Heap
 *                  Total    Dirty    Clean    Dirty    Total     Size    Alloc     Free
 *                 ------   ------   ------   ------   ------   ------   ------   ------
 *   Native Heap    12345    12000      100        0    13000    20000    15000     5000
 *   Dalvik Heap      5000     4800      100        0     5200     8000     6000     2000
 *          TOTAL    50000    48000     1000      500    55000    28000    21000     7000
 *
 *  App Summary
 *                        Pss(KB)                        Rss(KB)
 *            Java Heap:     5000                           5200
 *          Native Heap:    12000                          13000
 *                 Code:     2000                           2500
 *                Stack:      500                            600
 *             Graphics:     3000                           3200
 *        Private Other:     1000
 *               System:     2000
 *              Unknown:                                    1000
 *
 *            TOTAL PSS:    50000            TOTAL RSS:    55000       TOTAL SWAP PSS:      500
 */
export function parseMeminfo(raw: string): MeminfoResult {
    const result: MeminfoResult = { breakdown: [], appSummary: {} };

    const header = raw.match(/\*\*\s*MEMINFO in pid (\d+)\s*\[([^\]]+)\]\s*\*\*/);
    if (header) {
        result.pid = num(header[1]);
        result.packageName = header[2];
    }

    const lines = raw.split(/\r?\n/);

    // Linhas da tabela de breakdown: categoria seguida de 5 a 8 colunas numericas
    const rowRegex = /^\s{2}([A-Za-z.][\w. ]*?)\s{2,}((?:[\d,]+\s*)+)$/;

    for (const line of lines) {
        const m = line.match(rowRegex);
        if (!m) continue;

        const category = m[1].trim();
        const nums = m[2].trim().split(/\s+/).map(num);

        if (category.toUpperCase() === "TOTAL") continue; // capturado separadamente abaixo

        const row: MeminfoBreakdownRow = { category };
        // As colunas variam: linhas de heap tem 8, outras tem 5. Mapeamos pela posicao disponivel.
        [
            "pssTotal",
            "privateDirty",
            "privateClean",
            "swapPssDirty",
            "rssTotal",
            "heapSize",
            "heapAlloc",
            "heapFree",
        ].forEach((key, i) => {
            if (nums[i] !== undefined) (row as any)[key] = nums[i];
        });

        result.breakdown.push(row);
    }

    // App Summary
    const appSummaryMatch = (label: string) => {
        const re = new RegExp(`${label}:\\s*([\\d,]+)`, "i");
        return num(raw.match(re)?.[1]);
    };
    result.appSummary.javaHeapKB = appSummaryMatch("Java Heap");
    result.appSummary.nativeHeapKB = appSummaryMatch("Native Heap");
    result.appSummary.codeKB = appSummaryMatch("Code");
    result.appSummary.stackKB = appSummaryMatch("Stack");
    result.appSummary.graphicsKB = appSummaryMatch("Graphics");
    result.appSummary.privateOtherKB = appSummaryMatch("Private Other");
    result.appSummary.systemKB = appSummaryMatch("System");
    result.appSummary.unknownKB = appSummaryMatch("Unknown");

    // TOTAL PSS / TOTAL RSS / TOTAL SWAP PSS
    const totalsLine = raw.match(
        /TOTAL PSS:\s*([\d,]+)(?:\s+TOTAL RSS:\s*([\d,]+))?(?:\s+TOTAL SWAP PSS:\s*([\d,]+))?/i
    );
    if (totalsLine) {
        result.totalPssKB = num(totalsLine[1]);
        result.totalRssKB = num(totalsLine[2]);
        result.totalSwapPssKB = num(totalsLine[3]);
    } else {
        // fallback (versoes antigas do Android): linha "TOTAL   50000 ..." na tabela de breakdown
        const legacyTotal = raw.match(/^\s*TOTAL\s+([\d,]+)/m);
        if (legacyTotal) result.totalPssKB = num(legacyTotal[1]);
    }

    return result;
}
export function parseProcMeminfo(raw: string): { totalRamKB?: number; availRamKB?: number } {
    const totalMatch = raw.match(/^MemTotal:\s*(\d+)\s*kB/m);
    const availMatch = raw.match(/^MemAvailable:\s*(\d+)\s*kB/m);

    return {
        totalRamKB: totalMatch ? Number(totalMatch[1]) : undefined,
        availRamKB: availMatch ? Number(availMatch[1]) : undefined,
    };
}