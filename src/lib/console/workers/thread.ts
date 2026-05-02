import type { ParsedCommand } from "../types";

export class Thread {
    id: number;
    timestamp: number; // Start time of thread in ms
    worker: Worker;
    command: ParsedCommand;
    status: "running" | "done" | "error";

    constructor(id: number, worker: Worker, command: ParsedCommand) {
        this.id = id;
        this.worker = worker;
        this.timestamp = Date.now();
        this.command = command;
        this.status = "running";
    }

    public age(): number {
        return Date.now() - this.timestamp;
    }

    public setStatus(status: "running" | "done" | "error") {
        this.status = status;
        if (this.status === "done") {
            this.worker.terminate();
        }
    }

    public terminate() {
        this.worker.terminate();
        this.setStatus("done"); //change
    } 

    public toString(): string {
        return `#${this.id}, Status: ${this.status}, Command: ${this.command.name}, Age: ${this.age()}.`
    }
}