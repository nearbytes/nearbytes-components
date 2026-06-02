<script lang="ts">
  import { MenuEntry, Icon, StatusIndicator, type StatusKind } from 'nearbytes-widgets';
  import { User } from '@lucide/svelte';

  /** `publicKey` is a profile public-key hex string (a NearBytes friend id). */
  let { publicKey, label, presence = 'offline', selected = false, onselect }:
    { publicKey: string; label?: string; presence?: StatusKind; selected?: boolean; onselect?: (key: string) => void } = $props();

  const short = $derived(`${publicKey.slice(0, 6)}…${publicKey.slice(-4)}`);
</script>

<MenuEntry {selected} onselect={() => onselect?.(publicKey)}>
  {#snippet leading()}<Icon glyph={User} size={15} />{/snippet}
  {label ?? short}
  {#snippet trailing()}<StatusIndicator status={presence} />{/snippet}
</MenuEntry>
