<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button, DropdownMenu, Icon, MenuItemLabel, cn } from 'nearbytes-widgets';
  import { MoreHorizontal, Pencil, Trash2, GripVertical } from '@lucide/svelte';
  import type { ListRow } from './types.js';

  let {
    row,
    selected = false,
    dropHighlight = false,
    draggable = true,
    showActivate = false,
    confirming = false,
    busy = false,
    leading,
    onselect,
    onedit,
    ondelete,
    onconfirmdelete,
    oncanceldelete,
    ondragstart,
    ondragover,
    ondrop,
    ondragend
  }: {
    row: ListRow;
    selected?: boolean;
    dropHighlight?: boolean;
    draggable?: boolean;
    showActivate?: boolean;
    confirming?: boolean;
    busy?: boolean;
    leading?: Snippet;
    onselect?: () => void;
    onedit: () => void;
    ondelete: () => void;
    onconfirmdelete: () => void;
    oncanceldelete: () => void;
    ondragstart: (e: DragEvent) => void;
    ondragover: (e: DragEvent) => void;
    ondrop: (e: DragEvent) => void;
    ondragend: () => void;
  } = $props();
</script>

{#if confirming}
  <li class="flex items-center gap-1.5 rounded-md bg-nb-error/12 px-2.5 py-1.5 ring-1 ring-nb-error/25 ring-inset">
    <span class="min-w-0 flex-1 truncate text-[12px] text-nb-text">Delete <span class="font-medium">{row.title}</span>?</span>
    <Button variant="ghost" size="sm" class="h-6 shrink-0 px-2 text-[12px] text-nb-muted hover:text-nb-text" onclick={oncanceldelete} disabled={busy}>Cancel</Button>
    <Button variant="ghost" size="sm" class="h-6 shrink-0 px-2 text-[12px] font-medium text-nb-error hover:bg-nb-error/20" onclick={onconfirmdelete} disabled={busy}>Delete</Button>
  </li>
{:else}
  <li
    role="option"
    aria-selected={selected}
    class={cn(
      'group grid min-w-0 grid-cols-[0.75rem_minmax(0,1fr)_1.75rem] items-center gap-0 rounded-md transition-colors',
      draggable && 'cursor-grab active:cursor-grabbing',
      dropHighlight && 'ring-1 ring-nb-accent/50 ring-inset',
      selected ? 'bg-nb-accent/15' : 'hover:bg-white/5'
    )}
    {draggable}
    {ondragstart}
    {ondragover}
    {ondrop}
    {ondragend}
  >
    <span
      class="col-start-1 flex w-3 justify-center text-nb-faint opacity-0 transition-opacity group-hover:opacity-60"
      aria-hidden="true"
    >
      {#if draggable}<Icon glyph={GripVertical} size={13} />{/if}
    </span>

    <button
      type="button"
      class={cn(
        'col-start-2 flex h-8 min-w-0 items-center gap-2.5 rounded-md py-0 pl-1.5 pr-1 text-left outline-none',
        'focus-visible:ring-1 focus-visible:ring-nb-accent/50',
        !onselect && 'cursor-default'
      )}
      title={row.hint ?? row.title}
      onclick={onselect}
      disabled={!onselect}
    >
      {#if leading}
        <span class={cn('flex w-4 shrink-0 justify-center', selected ? 'text-nb-accent' : 'text-nb-muted')}>
          {@render leading()}
        </span>
      {/if}
      <span
        class={cn(
          'min-w-0 flex-1 truncate text-[13px] leading-none',
          selected ? 'font-medium text-nb-text' : 'text-nb-text',
          row.mono && 'font-mono text-[11px] tracking-tight text-nb-muted'
        )}
      >
        {row.title}
      </span>
    </button>

    <div class="col-start-3 flex items-center justify-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props }: { props: Record<string, unknown> })}
            <Button
              variant="ghost"
              size="icon"
              class={cn(
                'size-7 shrink-0 rounded-md text-nb-faint',
                'opacity-0 transition-opacity hover:bg-white/8 hover:text-nb-text',
                'group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100'
              )}
              aria-label="Row actions"
              {...props}
            >
              <Icon glyph={MoreHorizontal} size={16} />
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="right" align="start" sideOffset={6} class="min-w-[10.5rem]">
          {#if showActivate && onselect}
            <DropdownMenu.Item onSelect={onselect}>
              <MenuItemLabel label="Activate" />
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
          {/if}
          <DropdownMenu.Item onSelect={onedit}>
            <MenuItemLabel glyph={Pencil} label="Edit" />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            class="text-nb-error data-highlighted:bg-nb-error/15 data-highlighted:text-nb-error"
            onSelect={ondelete}
          >
            <MenuItemLabel glyph={Trash2} label="Delete" />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </li>
{/if}
