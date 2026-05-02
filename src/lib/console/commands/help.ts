import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext } from "../types";

export const exclusionList = ["credits"];

export const helpCommand: CommandHandler = {
    name: "help",
    description: "Shows available commands",
    syntax: "help",
    execute: (_, context: CommandContext) => {
        context.registry.getAll().forEach(cmd => {
            if(!exclusionList.includes(cmd.name)){
                context.pushToHistory(`${cmd.name} - ${cmd.description}`, "output");
            }
        });
    }
};