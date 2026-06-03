<script lang="ts">
  import { StatusIndicator, Icon } from 'nearbytes-widgets';
  import { Fingerprint } from '@lucide/svelte';
  import type { AppStatus } from '../../stores/appState.svelte.js';
  // Central textual status, visible on startup.
  let { status, peerId = null }: { status: AppStatus; peerId?: string | null } = $props();
</script>

<footer
  class="flex h-8 shrink-0 items-center gap-2 border-t border-nb-hairline bg-nb-sidebar/90 px-4 text-[11px] text-nb-muted backdrop-blur-xl"
>
  <StatusIndicator status={status.kind} />
  <span class="truncate">{status.text}</span>
  {#if peerId}
    <span class="ml-auto flex shrink-0 items-center gap-1 font-mono text-nb-faint" title={`Peer ID: ${peerId}`}>
      <Icon glyph={Fingerprint} size={12} />
      {peerId.slice(0, 10)}
    </span>
  {/if}
</footer>
