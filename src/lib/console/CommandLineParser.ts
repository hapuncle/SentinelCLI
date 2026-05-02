// lexer -> tokenize, check if valid
// then simple parsing is enough.

import type { FlagValue, ParsedCommand } from "./types";

// respect "" and ''
type Token =
    | { type: "WORD"; value: string }
    | { type: "STRING"; value: string }
    | { type: "FLAG"; value: string };

export class CommandLineParser {

    namespaces = new Set<string>([
        "sat",
    ]);

    lex(input: string): Token[] {
        const tokens: Token[] = [];
        let current = "";
        let inQuote: '"' | "'" | null = null; // keep track of inside quote
        
        // loop over input stream
        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            // check quoted strings
            if (inQuote) {
                if (char === inQuote) {
                    // close the current quote
                    tokens.push({type: "STRING", value: current});
                    current = "";
                    inQuote = null;
                } else {
                    // append
                    current += char;
                }
                continue;
            }

            // start quote
            if (char === '"' || char === "'") {
                if (current.length > 0) {
                    tokens.push({type: current.startsWith("--") ? "FLAG" : "WORD", value: current});
                    current = "";
                }
                inQuote = char;
                continue
            }

            // whitespace
            if (/\s/.test(char)) {
                if (current.length > 0) {
                    tokens.push({type: current.startsWith("--") ? "FLAG" : "WORD", value: current});
                    current = "";
                }
                continue;
            }

            current += char;
        }

        // last token
        if (current.length > 0) {
            tokens.push({type: current.startsWith("--") ? "FLAG" : "WORD", value: current});
        }

        // unclosed quote = invalid
        if (inQuote !== null) {
            throw new Error("Unclosed quote");
        }

        return tokens;
    }

    parseCommand(tokens: Token[], namespaces = new Set<string>()): ParsedCommand {
        let index = 0;
        let namespace = "";

        // only use namespace if token[0] is a known namespace
        if (tokens[0]?.type === "WORD" && namespaces.has(tokens[0].value)) {
            namespace = tokens[0].value;
            index = 1;
        }
        
        // get the name WORD
        const name = tokens[index]?.value ?? "";
        index++;

        const args: string[] = [];
        const flags: Record<string, FlagValue> = {};

        while (index < tokens.length) {
            const token = tokens[index];

            // FLAG path
            if (token.type === "FLAG") {
                const next = tokens[index + 1];

                // if the next type after FLAG is not another FLAG then that is the value of the FLAG
                // FLAG value ... FLAG ...
                if (next && next.type !== "FLAG") {
                    const raw = next.value;

                    const value: FlagValue = /^\d+$/.test(raw)
                        ? { type: "NUMBER", value: Number(raw) }
                        : { type: "STRING", value: raw };

                    flags[token.value.replace(/^--/, "")] = value;
                    index += 2;
                    continue;
                }

                // if the next token is a FLAG then the implicit value of the FLAG is the true value
                // FLAG FLAG ... FLAG ...
                flags[token.value.replace(/^--/, "")] = {
                    type: "BOOLEAN",
                    value: true
                };

                index++;
                continue;
            }

            args.push(token.value);
            index++;
        }

        return {
            namespace,
            name,
            args,
            flags
        };
    }

    // Lex and parse a command using a set of namespaces
    prepare(input: string): ParsedCommand {
        const tokens = this.lex(input);
        return this.parseCommand(tokens, this.namespaces);
    }
}