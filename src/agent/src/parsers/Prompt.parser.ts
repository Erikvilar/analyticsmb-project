import {ADB_COMMANDS} from "../commands/commands";

export type PromptResultType = "table" | "keyValue" | "tabular" | "text" | "help";

export interface PromptResult {
    command: string;
    type: PromptResultType;
    raw: string;
    data: any;
}

export function parserPrompt(command: string, raw: string): PromptResult {
    const lines = normalize(raw);

    try {



        const psTable = tryParsePsTable(lines);

        if (psTable) {
            return { command, type: "table", raw, data: psTable };
        }

        const keyValue = tryParseKeyValue(lines);

        if (keyValue) {
            return { command, type: "keyValue", raw, data: keyValue };
        }

        const tabular = tryParseTabular(lines);
        if (tabular) {
            return { command, type: "tabular", raw, data: tabular };
        }
        if(command === "help" || command.startsWith("help")) {
            return {command, type:"help",raw, data:{lines}}
        }

        return { command, type: "text", raw, data: { lines } };
    } catch {
        return { command, type: "text", raw, data: { lines } };
    }
}


function normalize(raw: string): string[] {
    return raw
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map(l => l.trimEnd())
        .filter(l => l.trim().length > 0);
}


function tryParsePsTable(lines: string[]) {
    const headerIndex = lines.findIndex(l => /^Mode\s+LastWriteTime\s+Length\s+Name/i.test(l));
    if (headerIndex === -1) return null;

    const dirLine = lines.find(l => /^Diret.rio:|^Directory:/i.test(l));
    const currentPath = dirLine
        ? dirLine.replace(/^Diret.rio:|^Directory:/i, "").trim()
        : null;

    const itemRegex = /^([d\-l])[\w-]{4,5}\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2})\s+(\d+)?\s*(.+)$/;

    const items: Array<{
        name: string;
        type: "folder" | "file";
        date: string;
        time: string;
        size: number;
    }> = [];

    for (const linha of lines.slice(headerIndex + 1)) {
        if (/^-{3,}/.test(linha)) continue; // linha separadora "---- ----"
        const match = linha.match(itemRegex);
        if (!match) continue;

        const [, tipo, date, time, size, name] = match;
        items.push({
            name: name.trim(),
            type: tipo === "d" ? "folder" : "file",
            date,
            time,
            size: size ? Number(size) : 0,
        });
    }

    if (items.length === 0) return { currentPath, empty: true, items: [] };

    return { currentPath, empty: false, items, total: items.length };
}


function tryParseKeyValue(lines: string[]) {
    const kvRegex = /^([^:=]{2,60}?)\s*[:=]\s*(.+)$/;

    const matches = lines
        .map(l => l.match(kvRegex))
        .filter(Boolean) as RegExpMatchArray[];

    if (matches.length < lines.length * 0.5 || matches.length === 0) {
        return null;
    }

    // detecta se é uma lista repetida da mesma chave (ex: "package:x" várias vezes)
    const keys = matches.map(m => m[1].trim());
    const uniqueKeys = new Set(keys);

    const isRepeatedKeyList =
        uniqueKeys.size === 1 && matches.length > 1;

    if (isRepeatedKeyList) {
        const key = [...uniqueKeys][0];
        const values = matches.map(m => m[2].trim());

        return {
            repeatedKey: key,
            values,
            total: values.length,
        };
    }

    // ---------- caso normal: blocos de chave:valor variados ----------
    const blocks: Array<{ title: string | null; props: Record<string, string> }> = [];
    let current: { title: string | null; props: Record<string, string> } = { title: null, props: {} };

    for (const linha of lines) {
        const match = linha.match(kvRegex);
        if (match) {
            current.props[match[1].trim()] = match[2].trim();
        } else {
            if (Object.keys(current.props).length > 0) {
                blocks.push(current);
            }
            current = { title: linha.trim(), props: {} };
        }
    }
    if (Object.keys(current.props).length > 0) {
        blocks.push(current);
    }

    return { blocks, totalBlocks: blocks.length };
}


function tryParseTabular(lines: string[]) {
    const rows = lines
        .filter(l => l.includes("\t"))
        .map(l => l.split("\t").map(c => c.trim()).filter(Boolean));

    if (rows.length === 0) return null;

    return { rows };
}