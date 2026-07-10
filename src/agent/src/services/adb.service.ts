import { COMMANDS } from "../commands/commands";
import { TerminalService } from "./terminal.service";
import { parseMeminfo, MeminfoResult } from "../parsers/Meminfo.parser";
import { parseGfxinfo, GfxinfoResult } from "../parsers/Gfxinfo.parser";
import { parseCpuInfo, CpuInfoResult } from "../parsers/Cpuinfo.parser";
import { parseBattery, BatteryResult } from "../parsers/Battery.parser";
import { parsePid, PidResult } from "../parsers/Pid.parser";
import {NetworkConnection, parseNetwork} from "../parsers/Network.parser";

const t = new TerminalService();

export class AdbService {
    async meminfo(): Promise<MeminfoResult> {
        const raw = await t.execute(COMMANDS.meminfo);
        return parseMeminfo(raw);
    }

    async gfxinfo(): Promise<GfxinfoResult> {
        const raw = await t.execute(COMMANDS.gfxinfo);
        return parseGfxinfo(raw);
    }

    async cpu(): Promise<CpuInfoResult> {
        const raw = await t.execute(COMMANDS.cpu);
        return parseCpuInfo(raw);
    }

    async battery(): Promise<BatteryResult> {
        const raw = await t.execute(COMMANDS.battery);
        return parseBattery(raw);
    }

    async pid(): Promise<PidResult> {
        const raw = await t.execute(COMMANDS.pid);
        return parsePid(raw);
    }
    async network():Promise<NetworkConnection[]>{
        const raw = await t.execute(COMMANDS.network);
        return parseNetwork(raw);
    }
}