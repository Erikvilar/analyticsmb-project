import { ADB_COMMANDS } from "../commands/commands";
import { TerminalService } from "./shell/TerminalService";
import {parseMeminfo, MeminfoResult, parseProcMeminfo} from "../parsers/Meminfo.parser";
import { parseGfxinfo, type GfxinfoResult } from "../parsers/Gfxinfo.parser";
import { parseCpuInfo, CpuInfoResult } from "../parsers/Cpuinfo.parser";
import { parseBattery, BatteryResult } from "../parsers/Battery.parser";
import { parsePid, PidResult } from "../parsers/Pid.parser";
import {parserPrompt, PromptResult} from "../parsers/Prompt.parser";
import {NetworkConnection, parseNetwork} from "../parsers/Network.parser";
import {AppInfoResult, parserAppInfo} from "../parsers/AppInfo.parser";
import {CommandRegistry} from "./shell/register/CommandRegister";
import {ShellSession} from "./shell/shellSession/ShellSession";
import {AdbCommand} from "./shell/commands/AdbCommand";
import {qualityParser} from "../parsers/Quality.parser";


const command = new CommandRegistry();
const shell = new ShellSession();
const t = new TerminalService(command,shell);
const adb = new AdbCommand();

export class AdbService {
    async qualityInfo(packageAdb:string) {
        const meminfo = await t.executeShell(ADB_COMMANDS.meminfo(packageAdb))
        const gfxinfo = await t.executeShell(ADB_COMMANDS.gfxinfo(packageAdb))

        return qualityParser(gfxinfo,meminfo)
    }
    async meminfo(packageAdb:string): Promise<MeminfoResult> {
        const [raw, procRaw] = await Promise.all([
            t.executeShell(ADB_COMMANDS.meminfo(packageAdb)),
            t.executeShell(ADB_COMMANDS.procMeminfo()),
        ]);

        const result = parseMeminfo(raw);
        const { totalRamKB, availRamKB } = parseProcMeminfo(procRaw);

        return {
            ...result,
            systemTotalRamKB: totalRamKB,
            systemAvailRamKB: availRamKB,
        };
    }
    async gfxinfo(packageAdb:string): Promise<GfxinfoResult> {
        const raw = await t.executeShell(ADB_COMMANDS.gfxinfo(packageAdb));
        return parseGfxinfo(raw);
    }
    async cpu(packageAdb:string): Promise<CpuInfoResult> {
        const raw = await t.executeShell(ADB_COMMANDS.cpu(packageAdb));
        return parseCpuInfo(raw);
    }
    async battery(packageAdb:string): Promise<BatteryResult> {
        const raw = await t.executeShell(ADB_COMMANDS.battery());
        return parseBattery(raw);
    }
    async pid(packageAdb:string): Promise<PidResult> {
        const raw = await t.executeShell(ADB_COMMANDS.pid(packageAdb));
        return parsePid(raw);
    }
    async network(packageAdb:string):Promise<NetworkConnection[]>{
        const raw = await t.executeShell(ADB_COMMANDS.network());
        return parseNetwork(raw);
    }
    async appInfo(packageAdb:string):Promise<AppInfoResult>{
        const raw = await t.executeShell(ADB_COMMANDS.appinfo(packageAdb));
        return parserAppInfo(raw);
    }
    async processes(){
        const raw = await t.executeShell(ADB_COMMANDS.processes());
        return parserPrompt("processes",raw);
    }
    async promptRequest(prompt: string,packageName:string): Promise<PromptResult | String[]> {
        if(prompt === "help" || prompt.startsWith("help")) {
           const keys =  Object.keys(ADB_COMMANDS).toString()
            return parserPrompt(prompt,keys)
        }
        let raw = await adb.execute(prompt,packageName,t);
        return parserPrompt(prompt,raw);



    }
}