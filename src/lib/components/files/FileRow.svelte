<script lang="ts">
  import { ListItem, Badge } from 'nearbytes-widgets';
  import type { FileMetadata } from 'nearbytes-files';
  import FileName from './FileName.svelte';

  let { file, selected = false, onselect }:
    { file: FileMetadata; selected?: boolean; onselect?: (path: string) => void } = $props();

  function fmtSize(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
    return `${(n / 1024 ** 2).toFixed(1)} MB`;
  }
</script>

<ListItem {selected} onselect={() => onselect?.(file.path)}>
  <span class="flex min-w-0 flex-1 items-center justify-between gap-3">
    <FileName path={file.path} />
    <Badge>{fmtSize(file.size)}</Badge>
  </span>
</ListItem>
