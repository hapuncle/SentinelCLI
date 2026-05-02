<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let {
      placeholder = "> ",
      inputValue = $bindable("")
    }: {
      placeholder?: string;
      inputValue?: string;
    } = $props();

    function submit(): void {
        dispatch('submit', { text: inputValue }); // Fire event to parent
        inputValue = "";
    }

    function onMovePointerUp(): void {
      dispatch('pointerUp'); // Fire arrowkeyUp event to parent
    }

    function onMovePointerDown(): void {
      dispatch('pointerDown'); // Fire arrowkeyDown event to parent
    }

</script>

<div class="prompt">
  <span>{placeholder}</span>
  <input bind:value={inputValue} 
    onkeydown = {
      (e) => { 
        switch (e.key) {
          case 'Enter':
            submit();
            break;
          case 'ArrowUp':
            onMovePointerUp();
            break;
          case 'ArrowDown':
            onMovePointerDown();
            break;
        };}
      } autofocus/>
</div>

<style>
  .prompt {
    padding: 10px;
    font-family: "Droid Sans Mono", monospace;
    color: #c5c8c6; 
    background-color: #1d1f21;
  }

  input { 
    background: transparent; 
    border: none; 
    color: inherit; 
    outline: none; 
    width: 80%; 
    font-family: "Droid Sans Mono", monospace;
  }
</style>