import { useRef, useState, useCallback } from "react";
import apiService from "../service/api.service";

export interface TerminalLine {
    type?: "info" | "success" | "error";
    text: string;
}

interface PromptResult {
    command: string;
    type: "table" | "keyValue" | "tabular" | "text" | "help";
    raw: string;
    data: any;
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
        case "tabular":
            return formatTabular(result.data);
        case "text":
        default:
            return formatText(result.data);
    }
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

export default useTerminalData;