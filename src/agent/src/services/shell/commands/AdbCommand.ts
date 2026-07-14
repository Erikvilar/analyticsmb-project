import { TerminalCommand, TerminalService } from "../TerminalService";
import { ADB_COMMANDS } from "../../../commands/commands";

export class AdbCommand implements TerminalCommand {

    readonly name = "adb";

    async execute(
        prompt: any,
        packageAdb: string,
        terminal: TerminalService
    ): Promise<string> {



        const adbCommandBuilder = ADB_COMMANDS[prompt as keyof typeof ADB_COMMANDS];


        if (adbCommandBuilder) {
            const shellCommand = adbCommandBuilder(packageAdb ?? "");
            return terminal.executeShell(shellCommand);
        }


        return terminal.executeShell(prompt);
    }
}