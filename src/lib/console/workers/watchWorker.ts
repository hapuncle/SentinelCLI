self.onmessage = ({ data }) => {
    const { sats, verbose } = data; // SatelliteData

    if (!sats || sats.length === 0) {
        self.postMessage({ type: "error", text: "No satellites found" });
        return;
    }

    for (const sat of sats) {
        if(verbose){
            Object.keys(sat).forEach((key) => {
                 self.postMessage({
                    type: "output",
                    text: `${key}: ${sat[key]}`
                });
            })
        } else {
            self.postMessage({
                type: "output",
                text: `${sat.OBJECT_NAME} (${sat.NORAD_CAT_ID})`
            });
        }
    }

    self.postMessage({ type: "done" });
};