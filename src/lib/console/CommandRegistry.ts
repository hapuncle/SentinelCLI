import { cleanupCommand } from "./commands/cleanup";
import { clearCommand } from "./commands/clear";
import { creditsCommand } from "./commands/credits";
import { helpCommand } from "./commands/help";
import { killCommand } from "./commands/kill";
import { trackCommand } from "./commands/sat/track";
import { testCommand } from "./commands/test";
import { threadsCommand } from "./commands/threads";
import { watchCommand } from "./commands/watch";
import { nearbyCommand } from "./commands/sat/nearby";

import type { CommandContext, ParsedCommand } from "./types";

export type CommandHandler = {
    name: string;
    description: string;
    syntax: string;
    execute: (
        command: ParsedCommand,
        context: CommandContext
    ) => Promise<string | void> | string | void;
};

export class CommandRegistry {
    registry: Record<string, CommandHandler> = {};

     constructor() {
        this.bootstrapDefaults();
    }

    private bootstrapDefaults(): void {
        this.register(clearCommand);
        this.register(helpCommand);
        this.register(creditsCommand);
        this.register(watchCommand);
        this.register(testCommand);
        this.register(threadsCommand);
        this.register(cleanupCommand);
        this.register(killCommand);
        this.register(trackCommand);
        this.register(nearbyCommand);
    }

    register(command: CommandHandler): void {
        this.registry[command.name] = command;
    }

    async execute(command: ParsedCommand, context: CommandContext): Promise<void> {
        const handler = this.registry[command.name];
        if (handler) {
            handler.execute(command, context);
        }
    }

    has(name: string): boolean {
        return name in this.registry;
    }

    getAll(): CommandHandler[] {
        return Object.values(this.registry);
    }
}