import type { CommandHandler } from "../../CommandRegistry";
import type { CommandContext, ParsedCommand } from "../../types";

import { resolveSatellite, resolveSatelliteTLE } from "$lib/ssa/tracking";

// sat track iss --live --interval 1000
export const trackCommand: CommandHandler = {
    name: "track",
    description: "Tracks satellites in realtime using SGP4.",
    syntax: "sat track <target> [live|interval amount]",

    execute: async (command: ParsedCommand, context: CommandContext) => {
        // FETCH TLE + store in cache
        // RUN SGP4
        // IF LIVE: run SGP4 every 5 seconds

        const target = command.args[0];
        const live = command.flags.live?.value === true;
        const interval = command.flags.interval?.value ?? 5000; //ms
        

        if (!target) {
            context.pushToHistory("ERROR: Missing target", "alert");
            return;
        }

        if (!live) {
            return;
        }

        const satTLE = await getSatelliteTLE(target);

        const worker = new Worker(
            new URL("../../workers/sat/trackWorker.ts", import.meta.url),
            { type: "module" }
        );

        const thread = context.threadManager.addThread(worker, command);

        worker.postMessage({
            satTLE,
            interval
        });

        worker.onmessage = (e) => {
            const { type, text } = e.data;

            if (type === "done") {
                thread.setStatus("done");
                return;
            }

            context.pushToHistory(text, type);
        };

        async function getSatelliteTLE(target: string) {
            const sat = await resolveSatelliteTLE(context.cacheManager.TLEData, target);

            if (!sat) throw new Error("Satellite not found");

            return sat;
        }
    }
};

