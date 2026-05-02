import * as satellite from "satellite.js";
import type { nearbyPostMessage } from "$lib/console/commands/sat/nearby";
import type { TLEChunk } from "$lib/console/types";

self.onmessage = ({ data }) => {
    const parsedData: nearbyPostMessage = data;
    const { satTLE, lat, lon, radius, timeWindow} = parsedData;
    const parsedLat: number = +lat;
    const parsedLon: number = +lon; 
    const now = new Date();
    const radiusMeters = radius * 1000;

    const stepSeconds = 60;
    const steps = timeWindow;

    self.postMessage({
        type: 'highlight',
        text: `Checking ${satTLE.length} stations.`
    });
    self.postMessage({
        type: 'highlight',
        text: `Starting calculations... (This may take a while.)`
    });

    type sat = {name: string, pos: satellite.EciVec3<number>, t: Date}

    let foundSats: sat[] = [];

    satTLE.forEach((chunk: TLEChunk) => {
        const {name, line1, line2} = chunk;
        const satrec = satellite.twoline2satrec(line1, line2);
        
        for (let i = 0; i < steps; i++) {
            const t = new Date(now.getTime() + i * stepSeconds * 1000);
            const pv = satellite.propagate(satrec, t);
            if (!pv.position) continue;

            const pos = pv.position;

            if (isWithinRange(pos, t, {lat: parsedLat, lon: parsedLon}, radiusMeters)){
                // Avoid duplicates
                if (!foundSats.some(s => s.name === name)) {
                    foundSats.push({ name, pos, t });
                }
                break; // only push 1 instance of within range to log 
                // (TODO: calculate time spent inside radius)
            }
        }
    })

    if(foundSats.length === 0){
        // Job is done
        self.postMessage({
            type: 'output',
            text: `No passes predicted.`
        });
        self.postMessage({ type: "done" });
        return;
    }

    foundSats.forEach(sat => {
        const gmst = satellite.gstime(sat.t);
        const geodetic = satellite.eciToGeodetic(sat.pos, gmst);
        const lat = satellite.degreesLat(geodetic.latitude);
        const lon = satellite.degreesLong(geodetic.longitude);

        self.postMessage({
            type: 'output',
            text: `${sat.name} | Pass predicted at coords ${lat}, ${lon} at timestamp: ${formatTime(sat.t.getTime())}`
        });
    });

    // Job is done
    self.postMessage({
            type: 'output',
            text: `Finished calculations, found ${foundSats.length} passes.`
    });
    self.postMessage({ type: "done" });

};

function isWithinRange(
    pos: satellite.EciVec3<number>, 
    now: Date, 
    target: {lat: number, lon: number}, 
    radius: number
): boolean {
    const gmst = satellite.gstime(now);
    const geodetic = satellite.eciToGeodetic(pos, gmst);
    // radians
    const lat = satellite.degreesLat(geodetic.latitude);
    const lon = satellite.degreesLong(geodetic.longitude);
    const d = dist(target.lat, target.lon, lat, lon);
    return d < radius;
}

function dist(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // https://www.movable-type.co.uk/scripts/latlong.html
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

function formatTime(ms: number) {
    const date = new Date(ms);
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}