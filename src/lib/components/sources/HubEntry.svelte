<script lang="ts">
  import { MenuEntry, Icon } from 'nearbytes-widgets';
  import { HardDrive } from '@lucide/svelte';
  import type { VolumeConfig } from 'nearbytes-skeleton';

  let { hub, selected = false, onselect }:
    { hub: VolumeConfig; selected?: boolean; onselect?: (label: string) => void } = $props();
</script>

<MenuEntry {selected} onselect={() => onselect?.(hub.label)}>
  {#snippet leading()}<Icon glyph={HardDrive} size={15} />{/snippet}
  {hub.label}
</MenuEntry>
