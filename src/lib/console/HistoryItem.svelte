<script lang="ts">
  const props = $props<{ entry: { id: number; timestamp: number; text: string; type?: string } }>();

  function formatTime(ms: number) {
    const date = new Date(ms);
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function getPrefix(type: string): string {
    switch (type) {
      case 'input':
        return '>';
      case 'output':
        return ' ';
      case 'alert':
        return '!';
      case 'info':
        return 'i';
      case 'notification':
        return 'i';
      case 'success':
        return ' ';
      default:
        return ' ';
    }
  }

</script>
<!-- 
'debug' | 'success' | 'info' | 'highlight' | 'input' | 'output' | 'alert' | 'notification' | 'warning'
Input: [HH:MM:SS] > user command
Output: [HH:MM:SS] message (indented)
Error: [HH:MM:SS] ! ERROR: message
Info: [HH:MM:SS] i INFO: message
Notification: [HH:MM:SS] i NOTIFICATION: message
Success: [HH:MM:SS] OK SUCCESS: message 
-->
<div class="history-item {props.entry.type}">
  { "[" + formatTime(props.entry.timestamp) + "] " + getPrefix(props.entry.type) + ' ' + props.entry.text }
</div>

<style>
.history-item {
  font-family: "Droid Sans Mono", monospace;
  font-size: 18px;
  color: #f8f8f2;
  padding: 2px 0;
  white-space: pre;
}

.history-item.debug        { color: #81a2be; } /* blue */
.history-item.output       { color: #b5bd68; } /* green */
.history-item.alert        { color: #a54242; } /* red */
.history-item.notification { color: #f0c674; } /* yellow */
.history-item.warning      { color: #de935f; } /* orange */
.history-item.success      { color: #8c9440; } /* dark green */
.history-item.info         { color: #5f819d; } /* muted blue */
.history-item.input        { color: #707880; } /* gray */
.history-item.highlight    { color: #b294bb; } /* magenta */
</style>