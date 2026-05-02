import * as satellite from "satellite.js";

self.onmessage = ({ data }) => {
    const { satTLE, interval } = data;
    const timeoutMS = 1000 * 60 * 60 * 2; // 2 hours
    const {name, line1, line2} = satTLE;
    const satrec = satellite.twoline2satrec(line1, line2);
    
    self.postMessage({
        type: 'highlight',
        text: `Starting automated tracking of target ${name}, interval=${interval}, expires at ${formatTime(Date.now() + timeoutMS)}.`
    });

    let intervalId = setInterval(() => {
        const now = new Date();
        const pv = satellite.propagate(satrec, now);

        if (!pv.position || !pv.velocity) {
            self.postMessage({
                type: "warning",
                text: "Propagation failed at current epoch"
            });
            return;
        }
    
        const gmst = satellite.gstime(now);
        console.log(satrec, pv)

        const geodetic = satellite.eciToGeodetic(pv.position, gmst);
        const lat = satellite.degreesLat(geodetic.latitude);
        const lon = satellite.degreesLong(geodetic.longitude);
        const height = geodetic.height;
        
        self.postMessage({
            type: 'output',
            text: `${name} | ${formatTime(now.getTime())}: lat: ${lat.toFixed(4)}, lon: ${lon.toFixed(4)}, height: ${height.toFixed(4)}m`
        });
    }, interval);
    
    setTimeout(() => {
        clearInterval(intervalId);
        // finish
        self.postMessage({ type: "done" });
    }, timeoutMS);
};

function formatTime(ms: number) {
    const date = new Date(ms);
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}