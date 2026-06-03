<script lang="ts">
  import { Panel, ScrollArea, EmptyState, Icon, Button } from 'nearbytes-widgets';
  import { FolderOpen, FolderPlus, Upload, ChevronLeft, Search, X } from '@lucide/svelte';
  import FileEntryRow from './FileEntryRow.svelte';
  import Breadcrumbs from './Breadcrumbs.svelte';
  import { entriesAt, parentOf, joinPath } from './paths.js';
  import type { FilesView } from '../../stores/appState.svelte.js';
  import { useAdapter } from '../../context.js';

  let { files, hubLabel = null }: { files: FilesView; hubLabel?: string | null } = $props();
  const adapter = useAdapter();

  let dragging = $state(false);
  let creatingFolder = $state(false);
  let folderName = $state('');
  let filter = $state('');
  let searching = $state(false);
  let picker = $state<HTMLInputElement | null>(null);

  const allEntries = $derived(entriesAt(files.cwd, files.items, files.directories));
  const entries = $derived(
    filter.trim() === ''
      ? allEntries
      : allEntries.filter((e) => e.name.toLowerCase().includes(filter.trim().toLowerCase()))
  );
  const hasContent = $derived(files.items.length > 0 || files.directories.length > 0);

  function navigate(path: string): void {
    files.cwd = path;
    files.selectedPath = null;
    filter = '';
    searching = false;
  }

  async function ingest(list: File[]) {
    for (const f of list) {
      const bytes = new Uint8Array(await f.arrayBuffer());
      await adapter.file.addBytes(joinPath(files.cwd, f.name), bytes);
    }
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    await ingest(Array.from(e.dataTransfer?.files ?? []));
  }

  async function onPick(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    await ingest(Array.from(input.files ?? []));
    input.value = '';
  }

  async function submitFolder() {
    const name = folderName.trim();
    if (name !== '') await adapter.file.mkdir(joinPath(files.cwd, name));
    folderName = '';
    creatingFolder = false;
  }
</script>

<Panel surface="bg" class="h-full">
  {#snippet header()}
    <div class="flex h-10 w-full items-center gap-1.5 pl-1 pr-2">
      <Button
        variant="ghost"
        size="icon"
        class="size-7 shrink-0 rounded-md text-nb-faint hover:bg-white/8 hover:text-nb-text disabled:opacity-30"
        disabled={files.cwd === ''}
        onclick={() => navigate(parentOf(files.cwd))}
        aria-label="Back"
      >
        <Icon glyph={ChevronLeft} size={17} />
      </Button>
      <Breadcrumbs root={hubLabel ?? 'Files'} cwd={files.cwd} onnavigate={navigate} />
      <div class="ml-auto flex shrink-0 items-center gap-0.5">
        {#if searching}
          <div class="flex h-7 items-center gap-1 rounded-md bg-nb-group pl-2 pr-1">
            <Icon glyph={Search} size={13} class="text-nb-faint" />
            <!-- svelte-ignore a11y_autofocus -->
            <input
              autofocus
              bind:value={filter}
              placeholder="Filter"
              class="w-28 bg-transparent text-[12px] text-nb-text outline-none placeholder:text-nb-faint"
            />
            <Button variant="ghost" size="icon" class="size-5 rounded text-nb-faint hover:text-nb-text"
              onclick={() => { searching = false; filter = ''; }} aria-label="Close search">
              <Icon glyph={X} size={12} />
            </Button>
          </div>
        {:else}
          <Button variant="ghost" size="icon" class="size-7 rounded-md text-nb-faint hover:bg-white/8 hover:text-nb-text"
            onclick={() => (searching = true)} aria-label="Search" title="Filter">
            <Icon glyph={Search} size={15} />
          </Button>
        {/if}
        <Button variant="ghost" size="icon" class="size-7 rounded-md text-nb-faint hover:bg-white/8 hover:text-nb-text"
          onclick={() => { creatingFolder = true; folderName = ''; }} aria-label="New folder" title="New folder"
          disabled={hubLabel === null}>
          <Icon glyph={FolderPlus} size={15} />
        </Button>
        <Button variant="ghost" size="icon" class="size-7 rounded-md text-nb-faint hover:bg-white/8 hover:text-nb-text"
          onclick={() => picker?.click()} aria-label="Add files" title="Add files" disabled={hubLabel === null}>
          <Icon glyph={Upload} size={15} />
        </Button>
      </div>
    </div>
  {/snippet}

  <input bind:this={picker} type="file" multiple class="hidden" onchange={onPick} />

  <div
    role="region"
    aria-label="File drop area"
    class={['flex min-h-0 flex-1 flex-col overflow-hidden transition-colors', dragging && 'bg-nb-accent/8']}
    ondragover={(e) => { e.preventDefault(); dragging = true; }}
    ondragleave={() => (dragging = false)}
    ondrop={onDrop}
  >
    {#if creatingFolder}
      <form class="mx-3 mt-3 flex items-center gap-2 rounded-lg bg-nb-group p-2"
        onsubmit={(e) => { e.preventDefault(); void submitFolder(); }}>
        <Icon glyph={FolderPlus} size={15} class="ml-1 text-nb-accent" />
        <!-- svelte-ignore a11y_autofocus -->
        <input autofocus bind:value={folderName} placeholder="Folder name"
          class="flex-1 bg-transparent text-[13px] text-nb-text outline-none placeholder:text-nb-faint"
          onkeydown={(e) => { if (e.key === 'Escape') creatingFolder = false; }} />
        <Button type="button" variant="ghost" size="sm" class="h-7" onclick={() => (creatingFolder = false)}>Cancel</Button>
        <Button type="submit" variant="default" size="sm" class="h-7">Create</Button>
      </form>
    {/if}

    {#if !hasContent}
      <EmptyState title="No files"
        description={hubLabel ? 'Drag files here or use the toolbar to add.' : 'Choose a hub in the sidebar to browse files.'}>
        {#snippet icon()}<Icon glyph={FolderOpen} size={34} class="text-nb-faint" />{/snippet}
      </EmptyState>
    {:else if entries.length === 0}
      <EmptyState title={filter ? 'No matches' : 'Empty folder'}
        description={filter ? 'Nothing matches your filter.' : 'This folder has no items yet.'}>
        {#snippet icon()}<Icon glyph={FolderOpen} size={34} class="text-nb-faint" />{/snippet}
      </EmptyState>
    {:else}
      <ScrollArea class="min-h-0 flex-1">
        <ul class="flex flex-col gap-px px-2 py-2" role="listbox" aria-label="Files">
          {#each entries as entry (entry.path)}
            <FileEntryRow
              {entry}
              selected={entry.kind === 'file' && entry.path === files.selectedPath}
              onopen={() => entry.kind === 'dir' ? navigate(entry.path) : adapter.file.openExternally(entry.name)}
              onselect={() => entry.kind === 'dir' ? navigate(entry.path) : (files.selectedPath = entry.path)}
              onremove={() => adapter.file.remove(entry.kind === 'file' ? entry.name : entry.path)}
            />
          {/each}
        </ul>
      </ScrollArea>
    {/if}
  </div>
</Panel>
