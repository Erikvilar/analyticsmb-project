import { lookupIp } from "../utils/ip-lookup";
import { reverseLookup } from "../utils/reverse.dns";
import { extractAddress } from "../utils/network";

export interface NetworkConnection {
    protocol: string;
    state: string;
    pid?: number;
    localIp: string;
    localPort: number;
    remoteIp: string;
    remotePort: number;
    hostname: string | null;
    provider: string;
    service: string;
}

/** Extrai o pid do campo "users:(("app",pid=1234,fd=52))" que o ss -tunap retorna */
function extractPid(processField: string | undefined): number | undefined {
    if (!processField) return undefined;
    const m = processField.match(/pid=(\d+)/);
    return m ? Number(m[1]) : undefined;
}

/**
 * raw: saida bruta de `ss -tunap`
 * pidFilter: se informado, mantem apenas conexoes desses pids
 */
export async function parseNetwork(
    raw: string,
    pidFilter?: number[]
): Promise<NetworkConnection[]> {
    const lines = raw.split("\n");

    const connections = await Promise.all(
        lines
            .filter((line) => line.includes("tcp"))
            .map(async (line) => {
                const parts = line.trim().split(/\s+/);

                const state = parts[1];
                const local = parts[4];
                const remote = parts[5];
                const pid = extractPid(parts[6]);

                // descarta cedo linhas que nao pertencem ao pid filtrado (evita lookup a toa)
                if (pidFilter && (pid === undefined || !pidFilter.includes(pid))) {
                    return null;
                }

                const [localIp, localPort] = extractAddress(local);
                const [remoteIp, remotePort] = extractAddress(remote);

                const hostname = await reverseLookup(remoteIp);
                const lookup = lookupIp(remoteIp);

                return {
                    protocol: "tcp",
                    state,
                    pid,
                    localIp,
                    localPort,
                    remoteIp,
                    remotePort,
                    hostname,
                    provider: lookup.provider,
                    service: lookup.service,
                };
            })
    );

    return connections.filter((c)=> c !== null);
}