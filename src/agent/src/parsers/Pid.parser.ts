export interface PidResult {
    pids: number[];
    running: boolean;
}

/**
 * Faz o parse da saida de:
 *   adb shell pidof <package>
 *
 * Retorna uma lista vazia (running: false) se o app nao estiver rodando,
 * ja que nesse caso o pidof nao imprime nada.
 */
export function parsePid(raw: string): PidResult {
    const pids = raw
        .trim()
        .split(/\s+/)
        .filter((p) => /^\d+$/.test(p))
        .map(Number);

    return { pids, running: pids.length > 0 };
}