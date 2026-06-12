<script lang="ts">
  import { Panel, PanelTitle, ScrollArea, Button, Icon, Badge, cn } from 'nearbytes-widgets';
  import { ExternalLink, Trash2, Pencil, Check, X, Info } from '@lucide/svelte';
  import VersionHistory from './VersionHistory.svelte';
  import { fileGlyph } from './fileIcon.js';
  import { fmtSize, basename, parentOf, joinPath } from './paths.js';
  import type { FilesView } from '../../stores/appState.svelte.js';
  import { selectedFile } from '../../stores/appState.svelte.js';
  import { useAdapter } from '../../context.js';

  let { files, readOnly = false }: { files: FilesView; readOnly?: boolean } = $props();
  const adapter = useAdapter();
  const file = $derived(selectedFile(files));
  const name = $derived(file ? basename(file.path) : '');
  const icon = $derived(file ? fileGlyph(name, file.mimeType) : null);

  let renaming = $state(false);
  let draftName = $state('');

  function startRename() { if (file) { draftName = name; renaming = true; } }
  async function commitRename() {
    const next = draftName.trim();
    if (file && next !== '' && next !== name) {
      await adapter.file.rename(file.path, joinPath(parentOf(file.path), next));
      files.selectedPath = joinPath(parentOf(file.path), next);
    }
    renaming = false;
  }
  async function remove() {
    if (!file) return;
    await adapter.file.remove(name);
    files.selectedPath = null;
  }

  function meta(label: string, value: string, mono = false) {
    return { label, value, mono };
  }
  const rows = $derived(
    file
      ? [
          meta('Where', parentOf(file.path) === '' ? 'Root' : parentOf(file.path)),
          meta('Size', fmtSize(file.size)),
          ...(file.mimeType ? [meta('Kind', file.mimeType)] : []),
          meta('Created', new Date(file.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })),
          meta('Blob', `${file.blobHash.slice(0, 18)}…`, true)
        ]
      : []
  );
</script>

<Panel surface="surface" class="h-full">
  {#snippet header()}
    <PanelTitle title="Inspector" glyph={Info} />
  {/snippet}

  {#if !file}
    <div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div class="flex size-16 items-center justify-center rounded-2xl bg-nb-group">
        <Icon glyph={Info} size={26} class="text-nb-faint" />
      </div>
      <div>
        <p class="text-[14px] font-medium text-nb-text">Nothing selected</p>
        <p class="mt-1 text-[12px] leading-relaxed text-nb-muted">Select a file to preview its details and history.</p>
      </div>
    </div>
  {:else}
    <ScrollArea class="min-h-0 flex-1">
      <div class="flex flex-col gap-5 p-4">
        <!-- Hero preview -->
        <div class="flex flex-col items-center gap-3 rounded-xl bg-nb-group px-4 py-6">
          <div class="flex size-20 items-center justify-center rounded-2xl bg-nb-elevated shadow-inner">
            {#if icon}<Icon glyph={icon.glyph} size={40} class={icon.tint} />{/if}
          </div>
          {#if renaming}
            <form class="flex w-full items-center gap-1.5" onsubmit={(e) => { e.preventDefault(); void commitRename(); }}>
              <!-- svelte-ignore a11y_autofocus -->
              <input autofocus bind:value={draftName}
                class="min-w-0 flex-1 rounded-md bg-nb-bg px-2 py-1 text-center text-[14px] font-medium text-nb-text outline-none ring-1 ring-nb-accent/50"
                onkeydown={(e) => { if (e.key === 'Escape') renaming = false; }} />
              <Button type="submit" variant="ghost" size="icon" class="size-7 text-nb-accent"><Icon glyph={Check} size={15} /></Button>
              <Button type="button" variant="ghost" size="icon" class="size-7 text-nb-faint" onclick={() => (renaming = false)}><Icon glyph={X} size={15} /></Button>
            </form>
          {:else}
            <button type="button" class="group flex max-w-full items-center gap-1.5" onclick={startRename} title="Rename" disabled={readOnly}>
              <span class="truncate text-center text-[14px] font-semibold text-nb-text">{name}</span>
              <Icon glyph={Pencil} size={12} class="shrink-0 text-nb-faint opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          {/if}
          {#if file.mimeType}<Badge>{file.mimeType.split('/').pop()}</Badge>{/if}
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-2">
          <Button variant="subtle" size="sm" class="justify-center" onclick={() => adapter.file.openExternally(name)}>
            <Icon glyph={ExternalLink} size={14} /> Open
          </Button>
          <Button variant="subtle" size="sm" class="justify-center text-nb-error hover:bg-nb-error/15" onclick={remove} disabled={readOnly}>
            <Icon glyph={Trash2} size={14} /> Remove
          </Button>
        </div>

        <!-- Metadata -->
        <dl class="flex flex-col gap-0 overflow-hidden rounded-xl bg-nb-group">
          {#each rows as r, i (r.label)}
            <div class={cn('flex items-baseline gap-3 px-3 py-2', i > 0 && 'border-t border-nb-hairline')}>
              <dt class="w-16 shrink-0 text-[12px] text-nb-faint">{r.label}</dt>
              <dd class={cn('min-w-0 flex-1 truncate text-right text-[12px] text-nb-text', r.mono && 'font-mono text-nb-muted')}>{r.value}</dd>
            </div>
          {/each}
        </dl>

        <!-- History -->
        <div class="flex flex-col">
          <VersionHistory {file} />
        </div>
      </div>
    </ScrollArea>
  {/if}
</Panel>
