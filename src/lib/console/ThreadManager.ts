import type { ParsedCommand } from "./types";
import { Thread } from "./workers/thread";


export class ThreadManager {

    private threads: Thread[] = [];
    private nextThreadId = 0; // never reassign a thread id during runtime

    constructor(){

    }

    public addThread(worker: Worker, command: ParsedCommand): Thread {
        const thread = new Thread(this.nextThreadId++, worker, command);
        this.threads = [...this.threads, thread];
        return thread;
    }

    public removeThread (thread: Thread): void {
        thread.terminate();
        this.threads = this.threads.filter(t => t.id !== thread.id);
    }

    public getAll(): Thread[] {
        return this.threads;
    }

    public removeAllByStatus(status: "running" | "done" | "error"): void {
        this.threads = this.threads.filter(thread => thread.status !== status);
    }

}