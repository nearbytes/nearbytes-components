<script lang="ts">
  import { StatusIndicator } from 'nearbytes-widgets';
  import type { AppStatus } from '../../stores/appState.svelte.js';
  // Central textual status, visible on startup.
  let { status }: { status: AppStatus } = $props();
</script>

<footer class="flex h-7 shrink-0 items-center gap-2 border-t border-nb-hairline bg-nb-sidebar px-3 text-[12px] text-nb-muted">
  <StatusIndicator status={status.kind} />
  <span class="truncate">{status.text}</span>
</footer>
