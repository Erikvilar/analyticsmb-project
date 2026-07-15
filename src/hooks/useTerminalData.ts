import { useRef, useState, useCallback } from "react";
import apiService from "../service/api.service";

export interface TerminalLine {
    type: "success" | "error" | "info" | "table";
    text: string;
}


export type PromptResult =
    | { type: "help"; data: any }
    | { type: "table"; data: any }
    | { type: "keyValue"; data: any }
    | { type: "tabular"; data: any }
    | { type: "text"; data: any }
    | { type: "realmColumns"; data: RealmColumnsData }
    | { type: "realm"; data: RealmPromptData }
    | { type: "error"; message: string };

export interface RealmPromptData {
    pacote: string;
    tabela?: string;
    query?: string;
    count: number;
    rows: Record<string, any>[];
}
export interface RealmColumnsData {
    pacote: string;
    tabela: string;
    totalColunas: number;
    colunas: {
        nome: string;
        tipo: string;
        referenciaPara?: string;
        opcional: boolean;
        indexado: boolean;
        chavePrimaria: boolean;
    }[];
}
const MAX_LINES = 500; // limite pra não crescer infinito em sessões longas

export function useTerminalData() {
    // dados reais vivem na ref — mutação direta, sem recriar array a cada linha
    const linesRef = useRef<TerminalLine[]>([]);

    // "tick" é o único state — só serve pra sinalizar "precisa re-renderizar"
    const [, setTick] = useState(0);
    const forceRender = useCallback(() => setTick(t => t + 1), []);

    const [isLoading, setIsLoading] = useState(false);

    const appendLines = useCallback((newLines: TerminalLine[]) => {
        linesRef.current.push(...newLines);

        // corta o excesso do início, evita o array crescer sem limite
        const excess = linesRef.current.length - MAX_LINES;
        if (excess > 0) {
            linesRef.current.splice(0, excess);
        }

        forceRender();
    }, [forceRender]);

    const streamOutput = useCallback((text: string, type: TerminalLine["type"] = "info") => {
        appendLines([{ type, text }]);
    }, [appendLines]);

    const streamOutputBatch = useCallback((batch: TerminalLine[]) => {
        appendLines(batch);
    }, [appendLines]);

    const clearLines = useCallback(() => {
        linesRef.current = [];
        forceRender();
    }, [forceRender]);

    const handleInput = useCallback(async (prompt: string) => {
        if (!prompt.trim() || isLoading) return;

        if (prompt === "clear" || prompt === "cls") {
            clearLines();
            return;
        }

        appendLines([{ type: "info", text: `Analytics > ${prompt}` }]);
        setIsLoading(true);

        try {
            const { status, success, data } = await apiService.postInputPrompt(prompt);

            if (success) {
                appendLines(formatPromptResult(data as PromptResult));
            } else {
                streamOutput(`Erro na requisição (status ${status})`, "error");
            }
        } catch (err) {
            streamOutput("Falha ao conectar com o servidor", "error");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, appendLines, streamOutput, clearLines]);

    return {
        lines: linesRef.current, // sempre a referência atual, sem cópia extra
        handleInput,
        streamOutput,
        isLoading,
    };
}

// ---------- formata o PromptResult em linhas de terminal ----------
function formatPromptResult(result: PromptResult): TerminalLine[] {
    if (!result || typeof result !== "object") {
        return [{ type: "success", text: String(result) }];
    }

    switch (result.type) {
        case "help":
            return formatHelp(result.data);
        case "table":
            return formatTable(result.data);
        case "keyValue":
            return formatKeyValue(result.data);
        case "error":
            return [{ type: "error", text: `✗ ${result.message}` }];
        case "realm":
            return formatRealm(result.data);
        case "realmColumns":
            return formatRealmColumns(result.data);

        case "tabular":
            return formatTabular(result.data);
        case "text":
        default:
            return formatText(result.data);
    }
}
function visualWidth(str: string): number {
    let width = 0;
    for (const char of str) {
        width += char.codePointAt(0)! > 0xFFFF ? 2 : 1;
    }
    return width;
}

function padEndVisual(str: string, targetWidth: number): string {
    const currentWidth = visualWidth(str);
    const diff = targetWidth - currentWidth;
    return diff > 0 ? str + " ".repeat(diff) : str;
}

function formatHelp(data: any): TerminalLine[] {
    if (!data?.lines?.length) {
        return [{ type: "info", text: "(nenhum comando disponível)" }];
    }

    const commands = data.lines
        .flatMap((line: string) => line.split(","))
        .map(command => command.trim())
        .filter(Boolean);

    return commands.map(command => ({
        type: "success",
        text: `> ${command}`
    }));
}

function formatTable(data: any): TerminalLine[] {
    if (!data || data.empty || !data.items?.length) {
        return [{ type: "info", text: "(pasta vazia)" }];
    }

    const lines: TerminalLine[] = [];

    if (data.currentPath) {
        lines.push({ type: "info", text: `📂 ${data.currentPath}` });
    }

    for (const item of data.items) {
        const icon = item.type === "folder" ? "📁" : "📄";
        const size = item.type === "file" ? `  (${formatBytes(item.size)})` : "";
        lines.push({ type: "success", text: `${icon} ${item.name}${size}` });
    }

    lines.push({ type: "info", text: `Total: ${data.total} item(s)` });

    return lines;
}

function formatKeyValue(data: any): TerminalLine[] {

    if (data?.repeatedKey) {
        const lines: TerminalLine[] = [
            { type: "info", text: `${data.repeatedKey} (${data.total})` },
        ];
        data.values.forEach((v: string) =>
            lines.push({ type: "success", text: `  ${v}` })
        );
        return lines;
    }


    if (!data?.blocks?.length) {
        return [{ type: "info", text: "(sem dados)" }];
    }

    const lines: TerminalLine[] = [];
    for (const block of data.blocks) {
        if (block.title) {
            lines.push({ type: "info", text: block.title });
        }
        for (const [key, value] of Object.entries(block.props)) {
            lines.push({ type: "success", text: `  ${key}: ${value}` });
        }
    }

    return lines;
}

function formatTabular(data: any): TerminalLine[] {
    if (!data?.rows?.length) {
        return [{ type: "info", text: "(sem dados)" }];
    }

    return data.rows.map((row: string[]) => ({
        type: "success" as const,
        text: row.join("   "),
    }));
}



function formatText(data: any): TerminalLine[] {
    const lines: string[] = data?.lines ?? [];
    console.log(data);
    if(data.realmSuccess){
        return [{ type: "success", text: data.realmSuccess }];
    }
    if (!lines.length) {
        return [{ type: "info", text: "(sem saída)" }];
    }

    return lines.map(line => ({ type: "success" as const, text: line }));
}

function formatBytes(bytes: number): string {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatRealmColumns(data: RealmColumnsData): TerminalLine[] {
    const lines: TerminalLine[] = [];

    lines.push({ type: "info", text: `📦 ${data.pacote} → tabela: ${data.tabela}` });

    if (!data.colunas?.length) {
        lines.push({ type: "info", text: "(nenhuma coluna encontrada)" });
        return lines;
    }

    const headers = ["coluna", "tipo", "PK", "obrigatório", "indexado"];
    const rows = data.colunas.map((c) => [
        c.nome,
        c.referenciaPara ? `${c.tipo}<${c.referenciaPara}>` : c.tipo,
        c.chavePrimaria ? "🔑" : "-",
        c.opcional ? "não" : "sim",
        c.indexado ? "sim" : "não",
    ]);

    const widths = headers.map((h, i) =>
        Math.max(visualWidth(h), ...rows.map((r) => visualWidth(r[i])))
    );

    lines.push({
        type: "table",
        text: headers.map((h, i) => padEndVisual(h, widths[i])).join(" │ "),
    });
    lines.push({ type: "table", text: widths.map((w) => "─".repeat(w)).join("─┼─") });

    for (const row of rows) {
        lines.push({
            type: "table",
            text: row.map((val, i) => padEndVisual(val, widths[i])).join(" │ "),
        });
    }

    lines.push({ type: "info", text: `Total: ${data.totalColunas} coluna(s)` });

    return lines;
}


function formatRealm(data: RealmPromptData): TerminalLine[] {
    const lines: TerminalLine[] = [];

    const header = data.tabela
        ? `📦 ${data.pacote} → tabela: ${data.tabela}`
        : `📦 ${data.pacote}`;
    lines.push({ type: "info", text: header });

    if (data.query) {
        lines.push({ type: "info", text: `🔍 query: ${data.query}` });
    }

    if (!data.rows || data.rows.length === 0) {
        lines.push({ type: "info", text: "(nenhum registro encontrado)" });
        return lines;
    }

    const columns = Array.from(
        new Set(data.rows.flatMap((row) => Object.keys(row)))
    );

    const MAX_COL_WIDTH = 30;
    const widths = columns.map((col) => {
        const headerLen = visualWidth(col);
        const maxValueLen = Math.max(
            ...data.rows.map((row) => visualWidth(formatCellValue(row[col])))
        );
        return Math.min(Math.max(headerLen, maxValueLen), MAX_COL_WIDTH);
    });

    const headerRow = columns
        .map((col, i) => padEndVisual(truncateVisual(col, widths[i]), widths[i]))
        .join(" │ ");
    lines.push({ type: "table", text: headerRow });

    lines.push({
        type: "table",
        text: widths.map((w) => "─".repeat(w)).join("─┼─"),
    });

    for (const row of data.rows) {
        const rowText = columns
            .map((col, i) => {
                const raw = formatCellValue(row[col]);
                const truncated = truncateVisual(raw, widths[i]);
                return padEndVisual(truncated, widths[i]);
            })
            .join(" │ ");
        lines.push({ type: "table", text: rowText });
    }

    lines.push({ type: "info", text: `Total: ${data.count} registro(s)` });

    return lines;
}

function formatCellValue(value: any): string {
    if (value === null || value === undefined) return "-";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}


function truncateVisual(str: string, maxWidth: number): string {
    if (visualWidth(str) <= maxWidth) return str;

    let result = "";
    let width = 0;
    const ellipsis = "...";
    const targetWidth = maxWidth - visualWidth(ellipsis);

    for (const char of str) {
        const charWidth = char.codePointAt(0)! > 0xFFFF ? 2 : 1;
        if (width + charWidth > targetWidth) break;
        result += char;
        width += charWidth;
    }

    return result + ellipsis;
}


export default useTerminalData;