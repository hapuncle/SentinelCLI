import type { CommandHandler } from "../CommandRegistry";
import { type CommandContext, type ParsedCommand } from "../types";

export const killCommand: CommandHandler = {
    name: "kill",
    description: "Terminates a thread immediately, disregarding any result.",
    syntax: "kill <id|'all'>",
    execute: (command: ParsedCommand, context: CommandContext) => {
        const args = command.args;
        const threadManager = context.threadManager;
        const threads = threadManager.getAll();
        
        if (args[0].toString() === "all") {
            threadManager.getAll().forEach((thread) => {
                threadManager.removeThread(thread);
            })
        } else {
            const target = threads.find((thread) => thread.id.toString() === args[0]);
            if (target) {
                threadManager.removeThread(target);
            } else {
                context.pushToHistory(`No target found with id: ${args[0]}`, "alert");
            }
        }
        
    }
};