<script lang="ts">
  import { ListItem, Badge, ContextMenu, Icon } from 'nearbytes-widgets';
  import { ExternalLink, Trash2 } from '@lucide/svelte';
  import type { FileMetadata } from 'nearbytes-files';
  import FileName from './FileName.svelte';
  import { useAdapter } from '../../context.js';

  let { file, selected = false, onselect }:
    { file: FileMetadata; selected?: boolean; onselect?: (path: string) => void } = $props();
  const adapter = useAdapter();
  const name = $derived(file.path.split('/').pop() ?? file.path);

  function fmtSize(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
    return `${(n / 1024 ** 2).toFixed(1)} MB`;
  }
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <ListItem {selected} onselect={() => onselect?.(file.path)} {...props}>
      <span class="flex min-w-0 flex-1 items-center justify-between gap-3">
        <FileName path={file.path} />
        <Badge>{fmtSize(file.size)}</Badge>
      </span>
      </ListItem>
    {/snippet}
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => adapter.file.openExternally(name)}>
      <Icon glyph={ExternalLink} size={13} /> Open
    </ContextMenu.Item>
    <ContextMenu.Item onSelect={() => adapter.file.remove(name)}>
      <Icon glyph={Trash2} size={13} /> Remove
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
