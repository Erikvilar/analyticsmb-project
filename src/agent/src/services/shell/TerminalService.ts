import {CommandRegistry} from "./register/CommandRegister";
import {ShellSession} from "./shellSession/ShellSession";


export interface TerminalCommand {

    readonly name: string;

    readonly aliases?: string[];

    execute(
        command:string[],
        packageAdb:string,
        terminal: TerminalService
    ): Promise<string>;

}

export class TerminalService {

    constructor(
        private readonly registry: CommandRegistry,
        private readonly shell: ShellSession
    ) {}

    register(command: TerminalCommand) {
        this.registry.register(command);
    }

    async execute(input: string,packageAdb:string): Promise<string> {

        const [name, ...args] = input.trim().split(/\s+/);

        const command = this.registry.find(name);

        if (command) {
            return command.execute(args, packageAdb, this);
        }

        return this.shell.execute(input);
    }

    async executeShell(command: string) {
        return this.shell.execute(command);
    }

}