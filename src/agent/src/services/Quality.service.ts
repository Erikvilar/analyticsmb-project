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
        fps?: number; // FPS medio exato, calculado a partir do tempo de frame
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
// NOTA: os valores abaixo (exceto FRAME_BUDGET_MS) sao heuristicas de produto,
// nao correspondem a nenhum threshold oficial documentado pelo Android/Play.
// FRAME_BUDGET_MS = 1000/60, esse sim e um valor real (orcamento de frame para 60fps).
const FRAME_BUDGET_MS = 16.67;

// Play Console define "sessao lenta" como >25% de frames lentos (frame >50ms / <20fps).
// Usamos 20% aqui como corte mais conservador/sensivel; ajuste se quiser alinhar ao Play.
const JANKY_BAD_PERCENT = 20;

const HEAP_GOOD_PERCENT = 5;  // % da RAM do device considerado saudavel (fallback quando nao ha RAM do device: KB fixo abaixo)
const HEAP_BAD_PERCENT = 15;  // % da RAM do device considerado critico
const HEAP_GOOD_KB = 150_000; // fallback sem dado de RAM do device
const HEAP_BAD_KB = 400_000;  // fallback sem dado de RAM do device

const WEIGHT_FPS = 0.6;
const WEIGHT_HEAP = 0.4;
// --------------------------------

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Calcula o FPS exato a partir do tempo medio de frame.
 * ATENCAO: assume que GfxinfoResult expoe um tempo medio de frame em ms
 * (ex: percentiles.p50 ou um campo avgFrameTimeMs). Ajuste o campo usado
 * abaixo conforme a interface real do seu Gfxinfo.parser.ts.
 */
function calculateFps(gfx: GfxinfoResult): number | undefined {
    const avgFrameTimeMs = gfx.percentiles?.p50 ?? gfx.percentiles?.p90;
    if (!avgFrameTimeMs || avgFrameTimeMs <= 0) return undefined;

    return Number((1000 / avgFrameTimeMs).toFixed(1));
}

function scoreFps(gfx: GfxinfoResult): number {
    const jankyPercent = gfx.jankyFrames?.percent ?? 0;
    const p90 = gfx.percentiles?.p90 ?? FRAME_BUDGET_MS;
    const p99 = gfx.percentiles?.p99 ?? FRAME_BUDGET_MS;

    const jankScore = clamp(10 - (jankyPercent / JANKY_BAD_PERCENT) * 10, 0, 10);
    const p90Score = clamp(10 - Math.max(0, p90 - FRAME_BUDGET_MS) / 2, 0, 10);
    const p99Score = clamp(10 - Math.max(0, p99 - FRAME_BUDGET_MS) / 3, 0, 10);

    return jankScore * 0.5 + p90Score * 0.3 + p99Score * 0.2;
}

function scoreHeap(mem: MeminfoResult): number {
    const totalPss = mem.totalPssKB ?? 0;
    const deviceRam = mem.systemTotalRamKB;

    if (!deviceRam) {
        if (totalPss <= HEAP_GOOD_KB) return 10;
        if (totalPss >= HEAP_BAD_KB) return 0;
        const ratio = (totalPss - HEAP_GOOD_KB) / (HEAP_BAD_KB - HEAP_GOOD_KB);
        return clamp(10 - ratio * 10, 0, 10);
    }

    const pssPercent = (totalPss / deviceRam) * 100;

    if (pssPercent <= HEAP_GOOD_PERCENT) return 10;
    if (pssPercent >= HEAP_BAD_PERCENT) return 0;
    const ratio = (pssPercent - HEAP_GOOD_PERCENT) / (HEAP_BAD_PERCENT - HEAP_GOOD_PERCENT);
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
                fps: calculateFps(gfxinfo),
                jankyPercent: gfxinfo.jankyFrames?.percent,
                p90Ms: gfxinfo.percentiles?.p90,
                p99Ms: gfxinfo.percentiles?.p99,
                totalPssKB: meminfo.totalPssKB,
            },
            raw: { meminfo, gfxinfo },
        };
    }
}