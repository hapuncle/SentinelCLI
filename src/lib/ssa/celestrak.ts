import type { Cache } from "$lib/console/CacheManager";

export type SatelliteData = {
    OBJECT_NAME: string;
    NORAD_CAT_ID: number;
}[];

async function fetchSatelliteData(cache: Cache<SatelliteData>, key: string, url: string): Promise<SatelliteData> {
    const cached = cache.get(key);
    if (cached) return cached;

    console.log("fetching from api")
    const res = await fetch(url);
    const data: SatelliteData = await res.json();

    cache.set(key, data);
    return data;
}

async function fetchSatelliteDataTLE(
    cache: Cache<string[]>,
    key: string,
    url: string
): Promise<string[]> {
    const cached = cache.get(key);
    if (cached) return cached;

    console.log("fetching TLE from api");

    const res = await fetch(url);
    const text = await res.text();

    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    cache.set(key, lines);
    return lines;
}

export async function fetchByGroup(cache: Cache<SatelliteData>, group: string): Promise<SatelliteData> {
    const normalized = group.toUpperCase();
    return fetchSatelliteData(
        cache,
        `group:${normalized}`,
        `https://celestrak.org/NORAD/elements/gp.php?GROUP=${normalized}&FORMAT=JSON`
    );
}

export async function fetchByCatnr(cache: Cache<SatelliteData>, catnr: string): Promise<SatelliteData> {
    return fetchSatelliteData(
        cache,
        `catnr:${catnr}`,
        `https://celestrak.org/NORAD/elements/gp.php?CATNR=${catnr}&FORMAT=JSON`
    );
}

export async function fetchTLEByCatnr(
    cache: Cache<string[]>,
    catnr: string
): Promise<string[]> {
    return fetchSatelliteDataTLE(
        cache,
        `tle:catnr:${catnr}`,
        `https://celestrak.org/NORAD/elements/gp.php?CATNR=${catnr}&FORMAT=TLE`
    );
}

export async function fetchTLEByGroup(
    cache: Cache<string[]>,
    group: string
): Promise<string[]> {
    const normalized = group.toUpperCase();
    return fetchSatelliteDataTLE(
        cache,
        `tle:group:${normalized}`,
        `https://celestrak.org/NORAD/elements/gp.php?GROUP=${normalized}&FORMAT=TLE`
    );
}