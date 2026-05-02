import type { CommandHandler } from "../CommandRegistry";
import type { CommandContext, ParsedCommand } from "../types";
import { resolveSatelliteGroup } from "$lib/ssa/tracking";
import type { SatelliteData } from "$lib/ssa/celestrak";

export const watchCommand: CommandHandler = {
    name: "watch",
    description: "Watches satellites by group or NORAD ID",
    syntax: "watch <group|catnr> [--v]",

    execute: async (command: ParsedCommand, context: CommandContext) => {
        const target = command.args[0];
        const threadManager = context.threadManager;
        const verbose = command.flags.v?.value === true;

        const cache = context.cacheManager.satelliteData;

        if (!target) {
            context.pushToHistory(
                "ERROR: Missing watch target.",
                "alert"
            );
            return;
        }

        context.pushToHistory(
            `Fetching ${target} from CelesTrak...`,
            "info"
        );

        const sats = await resolveSatelliteGroup(context.cacheManager.satelliteData, target);

        const worker = new Worker(
            new URL("../workers/watchWorker.ts", import.meta.url),
            { type: "module" }
        );

        const thread = threadManager.addThread(worker, command);

        worker.postMessage({ sats, verbose });

        worker.onmessage = (e) => {
            const { type, text } = e.data;

            if (type === "done") {
                thread.setStatus("done");
                return;
            }

            if (type === "error") {
                thread.setStatus("error");
                context.pushToHistory(text, "alert");
                return;
            }

            context.pushToHistory(text, "output");
        };
    }
};