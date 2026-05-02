import type { SatelliteData } from "$lib/ssa/celestrak";

interface CacheEntry<T> {
    timestamp: number;
    data: T;
}

export class Cache<T> {

    private memory: Record<string, CacheEntry<T>> = {};

    private CACHE_TTL = 1000 * 60 * 60 * 2; // 2 hours, default
    private INTERNAL_IDENTIFIER : string; // Used in localstorage cache id

    constructor(id: string, ttl?: number){
        this.INTERNAL_IDENTIFIER = id;

        if (ttl) { this.CACHE_TTL = ttl };
        
    }

    private storageKey(key: string): string {
        return `${this.INTERNAL_IDENTIFIER}_${key}`;
    }

    isValid(entry: CacheEntry<T>): boolean {
        return Date.now() - entry.timestamp < this.CACHE_TTL;
    }

    get(key: string): T | null {
        const mem = this.memory[key];
        if (mem && this.isValid(mem)) {
            console.log("using cache")
            return mem.data;
        }

        try {
            const raw = localStorage.getItem(this.storageKey(key));
            if (!raw) return null;
            
            console.log("using localStorage")
            const entry: CacheEntry<T> = JSON.parse(raw);

            if (!this.isValid(entry)) return null;

            this.memory[key] = entry;
            return entry.data;
        } catch {
            return null;
        }
    }

    set(key: string, data: T): void {
        const entry: CacheEntry<T> = {
            timestamp: Date.now(),
            data
        };

        this.memory[key] = entry;

        try {
            localStorage.setItem(this.storageKey(key), JSON.stringify(entry));
        } catch {
            // nothing
        }
    }

    clear(key: string): void {
        delete this.memory[key];
        localStorage.removeItem(this.storageKey(key));
    }
}

export class CacheManager {

    satelliteData = new Cache<SatelliteData>("satellite_data");
    TLEData = new Cache<string[]>("tle_data");
    // other managers

}