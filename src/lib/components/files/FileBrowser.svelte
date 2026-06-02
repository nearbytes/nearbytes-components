<script lang="ts">
  import { Panel, ScrollArea, List, EmptyState, Icon } from 'nearbytes-widgets';
  import { Files, FolderOpen } from '@lucide/svelte';
  import FileRow from './FileRow.svelte';
  import type { FilesView } from '../../stores/appState.svelte.js';

  /** Sub-record of the app store, passed by reference (deep reactive). */
  let { files }: { files: FilesView } = $props();
  const dirs = $derived(files.directories);
</script>

<Panel>
  {#snippet header()}<span class="flex items-center gap-2"><Icon glyph={Files} size={14} />Files</span>{/snippet}

  {#if files.items.length === 0 && dirs.length === 0}
    <EmptyState title="No files" description="Add a file or select a hub to browse its contents.">
      {#snippet icon()}<Icon glyph={FolderOpen} size={28} />{/snippet}
    </EmptyState>
  {:else}
    <ScrollArea class="h-full">
      <List class="gap-0.5 p-2" label="Files">
        {#each files.items as file (file.path)}
          <FileRow {file}
            selected={file.path === files.selectedPath}
            onselect={(p) => (files.selectedPath = p)} />
        {/each}
      </List>
    </ScrollArea>
  {/if}
</Panel>
