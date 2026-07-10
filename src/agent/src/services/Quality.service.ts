import { AdbService } from "./adb.service";
import { MeminfoResult } from "../parsers/Meminfo.parser";
import { GfxinfoResult } from "../parsers/Gfxinfo.parser";

export interface QualityBreakdown {
    fpsScore: number;
    heapScore: number;
}

export interface QualityResult {
    score: number; // 0 a 10
    label: string;
    breakdown: QualityBreakdown;
    metrics: {
        jankyPercent?: number;
        p90Ms?: number;
        p99Ms?: number;
        totalPssKB?: number;
    };
    raw: {
        meminfo: MeminfoResult;
        gfxinfo: GfxinfoResult;
    };
}

// ---- limites configuraveis ----
const FRAME_BUDGET_MS = 16.67; // orcamento de frame para 60fps
const HEAP_GOOD_KB = 150_000; // 150MB -> considerado saudavel (nota 10)
const HEAP_BAD_KB = 400_000; // 400MB -> considerado critico (nota 0)

const WEIGHT_FPS = 0.6;
const WEIGHT_HEAP = 0.4;
// --------------------------------

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function scoreFps(gfx: GfxinfoResult): number {
    const jankyPercent = gfx.jankyFrames?.percent ?? 0;
    const p90 = gfx.percentiles?.p90 ?? FRAME_BUDGET_MS;
    const p99 = gfx.percentiles?.p99 ?? FRAME_BUDGET_MS;

    // 0% de janky frames = nota 10, 20%+ = nota 0
    const jankScore = clamp(10 - (jankyPercent / 20) * 10, 0, 10);

    // Quanto o p90/p99 estouram o orcamento de frame (16.67ms p/ 60fps)
    const p90Score = clamp(10 - Math.max(0, p90 - FRAME_BUDGET_MS) / 2, 0, 10);
    const p99Score = clamp(10 - Math.max(0, p99 - FRAME_BUDGET_MS) / 3, 0, 10);

    // Janky frames pesa mais (e o que o usuario mais percebe), depois p90, depois p99
    return jankScore * 0.5 + p90Score * 0.3 + p99Score * 0.2;
}

function scoreHeap(mem: MeminfoResult): number {
    const totalPss = mem.totalPssKB ?? 0;
    if (totalPss <= HEAP_GOOD_KB) return 10;
    if (totalPss >= HEAP_BAD_KB) return 0;
    const ratio = (totalPss - HEAP_GOOD_KB) / (HEAP_BAD_KB - HEAP_GOOD_KB);
    return clamp(10 - ratio * 10, 0, 10);
}

function labelFor(score: number): string {
    if (score >= 9) return "Excelente";
    if (score >= 7) return "Boa";
    if (score >= 5) return "Regular";
    if (score >= 3) return "Ruim";
    return "Critica";
}

export class QualityService {
    private adb = new AdbService();

    async getQuality(): Promise<QualityResult> {
        const [meminfo, gfxinfo] = await Promise.all([
            this.adb.meminfo(),
            this.adb.gfxinfo(),
        ]);

        const fpsScore = scoreFps(gfxinfo);
        const heapScore = scoreHeap(meminfo);
        const score = Number((fpsScore * WEIGHT_FPS + heapScore * WEIGHT_HEAP).toFixed(1));

        return {
            score,
            label: labelFor(score),
            breakdown: {
                fpsScore: Number(fpsScore.toFixed(1)),
                heapScore: Number(heapScore.toFixed(1)),
            },
            metrics: {
                jankyPercent: gfxinfo.jankyFrames?.percent,
                p90Ms: gfxinfo.percentiles?.p90,
                p99Ms: gfxinfo.percentiles?.p99,
                totalPssKB: meminfo.totalPssKB,
            },
            raw: { meminfo, gfxinfo },
        };
    }
}