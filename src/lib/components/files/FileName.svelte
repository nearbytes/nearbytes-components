<script lang="ts">
  import { Icon } from 'nearbytes-widgets';
  import { File, Folder } from '@lucide/svelte';

  let { path, isDirectory = false }: { path: string; isDirectory?: boolean } = $props();
  const name = $derived(path.split('/').pop() ?? path);
</script>

<span class="flex min-w-0 items-center gap-2">
  <Icon glyph={isDirectory ? Folder : File} size={15} class="text-nb-muted" />
  <span class="truncate text-[13px]">{name}</span>
</span>
