<script lang="ts">
  import { Icon, ContextMenu, MenuItemLabel, cn } from 'nearbytes-widgets';
  import { Folder, ChevronRight, ExternalLink, Trash2, FolderInput } from '@lucide/svelte';
  import type { Entry } from './paths.js';
  import { fmtSize, fmtWhen } from './paths.js';
  import { fileGlyph } from './fileIcon.js';

  let { entry, selected = false, onopen, onselect, onremove }:
    {
      entry: Entry;
      selected?: boolean;
      onopen: () => void;
      onselect: () => void;
      onremove: () => void;
    } = $props();

  const icon = $derived(entry.kind === 'file' ? fileGlyph(entry.name, entry.file.mimeType) : null);
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <li role="option" aria-selected={selected} {...props}>
        <button
          type="button"
          class={cn(
            'group flex h-9 w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 text-left outline-none transition-colors',
            'focus-visible:ring-1 focus-visible:ring-nb-accent/50',
            selected ? 'bg-nb-accent/15 ring-1 ring-nb-accent/30 ring-inset' : 'hover:bg-white/5'
          )}
          onclick={onselect}
          ondblclick={onopen}
        >
          {#if entry.kind === 'dir'}
            <Icon glyph={Folder} size={17} class="shrink-0 text-nb-accent" />
          {:else if icon}
            <Icon glyph={icon.glyph} size={17} class={cn('shrink-0', icon.tint)} />
          {/if}

          <span class="min-w-0 flex-1 truncate text-[13px] text-nb-text">{entry.name}</span>

          {#if entry.kind === 'dir'}
            <span class="shrink-0 text-[11px] tabular-nums text-nb-faint">
              {entry.childCount > 0 ? `${entry.childCount} item${entry.childCount === 1 ? '' : 's'}` : ''}
            </span>
            <Icon glyph={ChevronRight} size={15} class="shrink-0 text-nb-faint opacity-60 group-hover:opacity-100" />
          {:else}
            <span class="shrink-0 text-[11px] tabular-nums text-nb-faint">{fmtWhen(entry.file.createdAt)}</span>
            <span class="w-16 shrink-0 text-right text-[11px] tabular-nums text-nb-muted">{fmtSize(entry.file.size)}</span>
          {/if}
        </button>
      </li>
    {/snippet}
  </ContextMenu.Trigger>
  <ContextMenu.Content class="min-w-[10rem]">
    {#if entry.kind === 'dir'}
      <ContextMenu.Item onSelect={onopen}><MenuItemLabel glyph={FolderInput} label="Open" /></ContextMenu.Item>
    {:else}
      <ContextMenu.Item onSelect={onopen}><MenuItemLabel glyph={ExternalLink} label="Open" /></ContextMenu.Item>
    {/if}
    <ContextMenu.Separator />
    <ContextMenu.Item class="text-nb-error data-highlighted:bg-nb-error/15 data-highlighted:text-nb-error" onSelect={onremove}>
      <MenuItemLabel glyph={Trash2} label="Remove" />
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
