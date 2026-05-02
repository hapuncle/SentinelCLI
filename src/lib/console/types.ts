import type { CacheManager } from "./CacheManager";
import type { CommandRegistry } from "./CommandRegistry";
import type { ThreadManager } from "./ThreadManager";


// types

export type HistoryEntry = {
        id: number;
        timestamp: number;
        text: string;
        type?: 'debug' | 'success' | 'info' | 'highlight' | 'input' | 'output' | 'alert' | 'notification' | 'warning';
};

export type CommandContext = {
    registry: CommandRegistry;
    cacheManager: CacheManager;
    threadManager: ThreadManager;
    pushToHistory: (text: string, type: 'debug' | 'success' | 'info' | 'highlight' | 'input' | 'output' | 'alert' | 'notification' | 'warning') => void;
    clearHistory?: () => void;
};

export type ParsedCommand = {
    namespace: string
    name: string;
    args: string[];
    flags: Record<string, FlagValue>; // --flag
};

export type FlagValue =
    | { type: "BOOLEAN"; value: boolean }
    | { type: "STRING"; value: string }
    | { type: "NUMBER"; value: number };

export type TLEChunk = {
    name : string,
    line1 : string,
    line2 : string
}

export type WatchWorkerMessage =
  | { type: "output"; text: string }
  | { type: "error"; text: string }
  | { type: "done" };