import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext } from "../types";

export const threadsCommand: CommandHandler = {
    name: "threads",
    description: "Shows active threads",
    syntax: "threads",
    execute: (_, context: CommandContext) => {
        const threads = context.threadManager.getAll();
        threads.forEach((thread) => {
            context.pushToHistory(thread.toString(), "output");
        })
        if (threads.length == 0) {
            context.pushToHistory("No threads active.", "output");
        }
    }
};