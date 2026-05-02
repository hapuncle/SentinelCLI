import type { CommandHandler } from "../../CommandRegistry";
import type { CommandContext, ParsedCommand, TLEChunk } from "../../types";

import { resolveSatelliteTLEGroup } from "$lib/ssa/tracking";


// TODO: add support for keywords/locations, e.g: "Amsterdam".
// sat nearby <lat> <lon> --radius 200 --window 2
export const nearbyCommand: CommandHandler = {
    name: "nearby",
    description: "Scans all satellites to see which will be within target location range within a specific radius and time window (Minutes).",
    syntax: "sat nearby <lat> <lon> [!radius (km)|!window (min)|?group]",

    execute: async (command: ParsedCommand, context: CommandContext) => {

        const lat = command.args[0];
        const lon = command.args[1];

        const radius = Number(command.flags.radius?.value ?? 100); // km, 100 default
        const timeWindow = Number(command.flags.window?.value ?? (60)); // minutes, 1 hour default
        const group = String(command.flags.group?.value ?? "stations"); // default use every satellite
        

        if (!lat && !lon) {
            context.pushToHistory("ERROR: Missing arguments", "alert");
            return;
        }

        const satTLE = await getSatelliteTLE(group);

        const worker = new Worker(
            new URL("../../workers/sat/nearbyWorker.ts", import.meta.url),
            { type: "module" }
        );

        const thread = context.threadManager.addThread(worker, command);

        const message: nearbyPostMessage = {
            satTLE,
            lat,
            lon,
            radius,
            timeWindow
        }

        worker.postMessage(message);

        worker.onmessage = (e) => {
            const { type, text } = e.data;

            if (type === "done") {
                thread.setStatus("done");
                return;
            }

            context.pushToHistory(text, type);
        };

        async function getSatelliteTLE(target: string) {
            const sat = await resolveSatelliteTLEGroup(context.cacheManager.TLEData, target);

            if (!sat) throw new Error("Satellite group not found");

            return sat;
        }
    }
};

export type nearbyPostMessage = {
    satTLE: TLEChunk[],
    lat: string,
    lon: string,
    radius: number,
    timeWindow: number
}

