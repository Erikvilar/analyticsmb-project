export interface BatteryResult {
    level?: number; // 0-100
    temperatureCelsius?: number;
    status?: string;
    health?: string;
}

// codigos do android.os.BatteryManager
const STATUS_MAP: Record<string, string> = {
    "1": "UNKNOWN",
    "2": "CHARGING",
    "3": "DISCHARGING",
    "4": "NOT_CHARGING",
    "5": "FULL",
};

const HEALTH_MAP: Record<string, string> = {
    "1": "UNKNOWN",
    "2": "GOOD",
    "3": "OVERHEAT",
    "4": "DEAD",
    "5": "OVER_VOLTAGE",
    "6": "UNSPECIFIED_FAILURE",
    "7": "COLD",
};

/**
 * Faz o parse da saida de:
 *   dumpsys battery | grep -E 'level|temperature|status|health'
 *
 * Formato de cada linha: "  campo: valor"
 *   status: 2
 *   health: 2
 *   level: 85
 *   temperature: 320   (decimo de grau celsius)
 */
export function parseBattery(raw: string): BatteryResult {
    const result: BatteryResult = {};

    const level = raw.match(/^\s*level:\s*(\d+)/m);
    if (level) result.level = Number(level[1]);

    const temperature = raw.match(/^\s*temperature:\s*(\d+)/m);
    if (temperature) result.temperatureCelsius = Number(temperature[1]) / 10;

    const status = raw.match(/^\s*status:\s*(\d+)/m);
    if (status) result.status = STATUS_MAP[status[1]] ?? "UNKNOWN";

    const health = raw.match(/^\s*health:\s*(\d+)/m);
    if (health) result.health = HEALTH_MAP[health[1]] ?? "UNKNOWN";

    return result;
}