<script lang="ts">
    import HistoryItem from "./HistoryItem.svelte";
    import type { HistoryEntry } from '$lib/console/types';

    const props = $props<{ historyStack: HistoryEntry[] }>();

    let list: HTMLDivElement;

    $effect(() => {
      // Auto scroll to bottom
      props.historyStack.length;
      if (list) {
          list.scrollTop = list.scrollHeight;
      }
    });
</script>

<div class="historyList" bind:this={list}>
  {#each props.historyStack as entry (entry.id)}
    <HistoryItem {entry} />
  {/each}
</div>

<style>
.historyList {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  --sb-track-color: #232e33;
  --sb-thumb-color: #c5c8c6;
  --sb-size: 8px;
}

.historyList::-webkit-scrollbar {
  width: var(--sb-size);
}

.historyList::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 6px;
}

.historyList::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 6px;
}

@supports not selector(::-webkit-scrollbar) {
  .historyList {
      scrollbar-color: var(--sb-thumb-color)
                      var(--sb-track-color);
  }
}

</style>