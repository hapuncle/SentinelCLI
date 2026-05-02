import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext, ParsedCommand } from "../types";

export const testCommand: CommandHandler = {
    name: "test",
    description: "Test",
    syntax: "test",
    execute: (command: ParsedCommand, context: CommandContext) => {
        if (window.Worker){
            const threadManager = context.threadManager;

            console.log("Threads: ", threadManager.getAll().length);
            const myWorker = new Worker(new URL("../workers/worker.js", import.meta.url));
            const myThread = threadManager.addThread(myWorker, command);

            myWorker.postMessage(command.args[0]);
            myWorker.onmessage = (e) => {
                console.log("Received response in test.js: " + e.data)
                myThread.setStatus("done");
            }
        } else {
            console.log("Your browser doesn't support web workers.");
        }
    }
};