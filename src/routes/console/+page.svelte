<script lang="ts">
    import History from '$lib/console/History.svelte';
    import Prompt from '$lib/console/Prompt.svelte';
    import { CommandLineParser } from '$lib/console/CommandLineParser';
    import { CommandRegistry } from '$lib/console/CommandRegistry';
    import type { CommandContext, HistoryEntry } from '$lib/console/types';
    import { onMount } from 'svelte';
    import { ThreadManager } from '$lib/console/ThreadManager';
    import { CacheManager } from '$lib/console/CacheManager';

    const parser = new CommandLineParser();
    const commandRegistry = new CommandRegistry();
    const threadManager = new ThreadManager();
    const cacheManager = new CacheManager();

    let historyStack = $state<HistoryEntry[]>([]);
    let historyPointer = -1; // pointer for the historyStack

    let promptText = $state("");

    let nextHistoryId = 0;

    const context : CommandContext = {
        registry: commandRegistry,
        cacheManager: cacheManager,
        threadManager: threadManager,
        pushToHistory: pushToHistoryStack,
        clearHistory: () => historyStack = [],
    };
		
    onMount(async () => {
        const command = parser.prepare("credits");
        console.log(command);
        await commandRegistry.execute(command, context);
    });

    function pushToHistoryStack(text: string, type: 'debug' | 'success' | 'info' | 'highlight' | 'input' | 'output' | 'alert' | 'notification' | 'warning' = 'input'): void {
        historyStack = [...historyStack, { id: nextHistoryId, timestamp: Date.now(), text, type }];
        nextHistoryId++;
    }

    async function handlePromptSubmit(event: { detail: { text: string } }): Promise<void> {
        const inputText = event.detail.text;

        pushToHistoryStack(inputText, 'input');
        historyPointer = -1;

        try {
            const command = parser.prepare(inputText);
            console.log(command);
            if (!commandRegistry.has(command.name)) {
                pushToHistoryStack(`ERROR: Unknown command '${command.name}'. Type 'help' to see a list of available commands.`, 'alert');
                return;
            }

            await commandRegistry.execute(command, context);
        } catch {
            pushToHistoryStack(`ERROR: Invalid syntax.`, 'alert');
        }
    }

    function trimmedStack(type: 'debug' | 'success' | 'info' | 'highlight' | 'input' | 'output' | 'alert' | 'notification' | 'warning'): HistoryEntry[] {
        const flipped = historyStack.toReversed();
        return flipped.filter(entry => entry.type === type);
    }

    function handlePointerUp(): void {
        historyPointer = Math.min(historyPointer + 1, trimmedStack('input').length - 1);
        updatePromptPlaceholder(historyPointer);
    }

    function handlePointerDown(): void {
        historyPointer = Math.max(historyPointer - 1, -1);
        updatePromptPlaceholder(historyPointer);
    }

    function updatePromptPlaceholder(pointer: number): void {
        promptText = historyPointer === -1 ? "" : trimmedStack('input')[historyPointer]?.text ?? "";
    }

</script>

<div class="header">

</div>
<div class="container">
    <History {historyStack} />
    <Prompt placeholder="> "
    bind:inputValue={promptText}
    on:submit={handlePromptSubmit}
    on:pointerUp={handlePointerUp}
    on:pointerDown={handlePointerDown}/>
</div>

<style>
:global(body) {
  background-color: #1D1F21;
  font-family: "Droid Sans Mono", monospace;
  margin: 0;
}

:global(html, body) {
  height: 100%;
}

.header {
    background-color: #161719;
    height: 50px;
    flex-shrink: 0;
}

.container {
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-sizing: border-box;
}

</style>