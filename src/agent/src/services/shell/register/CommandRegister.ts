import {TerminalCommand} from "../TerminalService";

export class CommandRegistry {

    private readonly commands = new Map<string, TerminalCommand>();

    register(command: TerminalCommand): void {

        this.commands.set(command.name.toLowerCase(), command);

        command.aliases?.forEach(alias =>
            this.commands.set(alias.toLowerCase(), command)
        );

    }

    unregister(name: string): void {

        this.commands.delete(name.toLowerCase());

    }

    find(name: string): TerminalCommand | undefined {

        return this.commands.get(name.toLowerCase());

    }

    list(): TerminalCommand[] {

        return [...new Set(this.commands.values())];

    }

}