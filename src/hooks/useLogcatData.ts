import { useCallback, useMemo, useState } from "react";

export type LogcatMode = "APP" | "SYSTEM";

export type LogcatLevel =
    | "V"
    | "D"
    | "I"
    | "W"
    | "E"
    | "F";

export interface LogcatLine {
    time: string;
    pid: number;
    tid: number;
    level: LogcatLevel;
    tag: string;
    package?: string;
    message: string;
}

const MAX_LINES = 1000;

const useLogcatData = () => {

    const [running, setRunning] = useState(false);

    const [mode, setMode] = useState<LogcatMode>("APP");

    const [onlyWarnings, setOnlyWarnings] = useState(false);

    const [autoScroll, setAutoScroll] = useState(true);

    const [packageName, setPackageName] = useState("");

    const [lines, setLines] = useState<LogcatLine[]>([]);

    /* ============================================================
       Stream
    ============================================================ */

    const start = useCallback(async () => {

        setRunning(true);

        /*
            backend.start({
                mode,
                package: packageName,
                warnings: onlyWarnings
            })
        */

    }, [mode, packageName, onlyWarnings]);

    const stop = useCallback(() => {

        setRunning(false);

        /*
            backend.stop()
        */

    }, []);

    const restart = useCallback(async () => {

        stop();

        await start();

    }, [start, stop]);

    /* ============================================================
       Configurações
    ============================================================ */

    const toggleMode = useCallback(() => {

        setMode(prev => prev === "APP"
            ? "SYSTEM"
            : "APP");

    }, []);

    const toggleWarnings = useCallback(() => {

        setOnlyWarnings(prev => !prev);

    }, []);

    const toggleAutoScroll = useCallback(() => {

        setAutoScroll(prev => !prev);

    }, []);

    const clear = useCallback(() => {

        setLines([]);

    }, []);

    const append = useCallback((line: LogcatLine) => {

        setLines(prev => {

            const next = [...prev, line];

            if (next.length > MAX_LINES) {
                next.shift();
            }

            return next;
        });

    }, []);

    const appendMany = useCallback((batch: LogcatLine[]) => {

        setLines(prev => {

            const next = [...prev, ...batch];

            if (next.length > MAX_LINES) {
                return next.slice(next.length - MAX_LINES);
            }

            return next;
        });

    }, []);

    /* ============================================================
       Estatísticas
    ============================================================ */

    const stats = useMemo(() => {

        return {

            total: lines.length,

            errors: lines.filter(l => l.level === "E").length,

            warnings: lines.filter(l => l.level === "W").length,

            infos: lines.filter(l => l.level === "I").length,

            debugs: lines.filter(l => l.level === "D").length,

            fatals: lines.filter(l => l.level === "F").length,

        };

    }, [lines]);

    return {

        /* estado */

        running,

        mode,

        onlyWarnings,

        autoScroll,

        packageName,

        lines,

        stats,

        /* controle */

        start,

        stop,

        restart,

        clear,

        /* configuração */

        toggleMode,

        toggleWarnings,

        toggleAutoScroll,

        setPackage: setPackageName,

        /* atualização */

        append,

        appendMany,

    };

};

export default useLogcatData;