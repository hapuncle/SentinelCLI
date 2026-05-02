import { fetchByCatnr, fetchByGroup, type SatelliteData, fetchTLEByCatnr, fetchTLEByGroup } from "./celestrak";
import type { Cache } from "$lib/console/CacheManager";
import type { TLEChunk } from "$lib/console/types";

export async function resolveSatellite(
    cache: Cache<SatelliteData>,
    target: string
): Promise<SatelliteData[number]> {
    const isCatnr = /^\d+$/.test(target);

    const data = isCatnr
        ? await fetchByCatnr(cache, target)
        : await fetchByGroup(cache, target);

    const sat = data[0];
    if (!sat) throw new Error("Satellite not found");

    return sat;
}

export async function resolveSatelliteGroup(
    cache: Cache<SatelliteData>,
    target: string
): Promise<SatelliteData> {
    const isCatnr = /^\d+$/.test(target);

    const data = isCatnr
        ? await fetchByCatnr(cache, target)
        : await fetchByGroup(cache, target);
        
    return data;
}

export async function resolveSatelliteTLE(
    cache: Cache<string[]>, // TLE made up of string lines
    target: string
): Promise<{ name: string; line1: string; line2: string }> {
    const isCatnr = /^\d+$/.test(target);
    if (!isCatnr) {throw new Error("Invalid nr")};
    const data = await fetchTLEByCatnr(cache, target);

    if (!data || data.length === 0) {
        throw new Error("Satellite not found");
    }

    const name = data[0];
    const line1 = data[1];
    const line2 = data[2];

    if (!line1 || !line2) {
        throw new Error("Invalid TLE data");
    }

    return { name, line1, line2 };
}

export async function resolveSatelliteTLEGroup(
    cache: Cache<string[]>, // TLE made up of string lines
    target: string
): Promise<TLEChunk[]> {
    const data = await fetchTLEByGroup(cache, target);

    if (!data || data.length === 0) {
        throw new Error("Satellite group not found");
    }

    if (data.length % 3 !== 0) {
        console.log("lines: " + data.length);
    }

    let chunks : TLEChunk[] = [];

    for (let index = 0; index < (data.length / 3); index++) {
        const name  = data[3 * index + 0];
        const line1 = data[3 * index + 1];
        const line2 = data[3 * index + 2];

        if (!line1 || !line2) {
            throw new Error(`Invalid TLE data at index ${index}`);
        }

        const chunk: TLEChunk = {name , line1, line2};
        chunks.push(chunk);
    } 

    console.log("stations total: " + chunks.length);

    return chunks;
}