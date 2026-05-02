import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext, ParsedCommand } from "../types";

export const cleanupCommand: CommandHandler = {
    name: "cleanup",
    description: "Cleans up threads that have status 'done' or'error'.",
    syntax: "cleanup [--e]",
    execute: (command: ParsedCommand, context: CommandContext) => {
        const flags = command.flags;

        const threadManager = context.threadManager;

        threadManager.removeAllByStatus("done");

        if (flags.e.type === "BOOLEAN" && flags.e.value) {
            threadManager.removeAllByStatus("error");
        }
    }
};