import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext } from "../types";

export const clearCommand: CommandHandler = {
    name: "clear",
    description: "Clears the terminal",
    syntax: "clear",
    execute: (_, context: CommandContext) => {
        context.clearHistory?.();
    }
};