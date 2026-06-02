<script lang="ts">
  import { Panel, ScrollArea, List, EmptyState, Icon } from 'nearbytes-widgets';
  import { Files, FolderOpen } from '@lucide/svelte';
  import FileRow from './FileRow.svelte';
  import type { FilesView } from '../../stores/appState.svelte.js';
  import { useAdapter } from '../../context.js';

  /** Sub-record of the app store, passed by reference (deep reactive). */
  let { files }: { files: FilesView } = $props();
  const adapter = useAdapter();
  const dirs = $derived(files.directories);
  let dragging = $state(false);

  // Electron exposes the absolute path on dropped File objects → `nbf put`.
  async function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    const dropped = Array.from(e.dataTransfer?.files ?? []) as Array<File & { path?: string }>;
    for (const f of dropped) if (f.path) await adapter.file.add(f.path);
  }
</script>

<Panel>
  {#snippet header()}<span class="flex items-center gap-2"><Icon glyph={Files} size={14} />Files</span>{/snippet}

  <div
    role="region"
    aria-label="File drop area"
    class={dragging ? 'h-full ring-1 ring-inset ring-nb-accent' : 'h-full'}
    ondragover={(e) => { e.preventDefault(); dragging = true; }}
    ondragleave={() => (dragging = false)}
    ondrop={onDrop}
  >
    {#if files.items.length === 0 && dirs.length === 0}
      <EmptyState title="No files" description="Drag files here, or select a hub to browse its contents.">
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
  </div>
</Panel>
