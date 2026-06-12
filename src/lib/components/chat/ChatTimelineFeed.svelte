<script lang="ts">
  import { ChatBubble, Icon, cn } from 'nearbytes-widgets';
  import {
    ArrowRightLeft,
    Circle,
    FilePlus,
    FolderPlus,
    MessageSquare,
    Trash2,
    UserRound
  } from '@lucide/svelte';
  import type { TimelineEvent } from 'nearbytes-files';
  import type { Component } from 'svelte';

  let {
    events,
    cursorHash = null,
    ownKey = null,
    onselect
  }: {
    events: TimelineEvent[];
    cursorHash?: string | null;
    ownKey?: string | null;
    onselect: (eventHash: string) => void;
  } = $props();

  const cursorIdx = $derived(
    cursorHash === null ? events.length - 1 : events.findIndex((e) => e.eventHash === cursorHash)
  );

  function glyph(type: TimelineEvent['type']): Component<{ size?: number; class?: string }> {
    switch (type) {
      case 'CREATE_FILE': return FilePlus;
      case 'DELETE': return Trash2;
      case 'RENAME': return ArrowRightLeft;
      case 'MKDIR': return FolderPlus;
      case 'CHAT_MESSAGE': return MessageSquare;
      case 'DECLARE_IDENTITY': return UserRound;
      default: return Circle;
    }
  }

  function label(e: TimelineEvent): string {
    switch (e.type) {
      case 'CREATE_FILE': return e.path || 'Added file';
      case 'DELETE': return e.path || 'Deleted file';
      case 'RENAME': return e.toPath ? `${e.path} → ${e.toPath}` : e.path;
      case 'MKDIR': return e.path || 'Created folder';
      case 'CHAT_MESSAGE': return e.body ?? e.summary ?? 'Message';
      default: return e.summary ?? e.path ?? String(e.type).replace(/_/g, ' ').toLowerCase();
    }
  }

  function time(e: TimelineEvent): string {
    const ts = e.publishedAt ?? e.timestamp;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function authorKey(e: TimelineEvent): string | null {
    return e.message?.k ?? e.authorPublicKey ?? null;
  }
</script>

<div class="flex flex-col gap-1">
  {#each events as e, i (e.eventHash)}
    {@const active = i === cursorIdx}
    {@const future = cursorIdx >= 0 && i > cursorIdx}
    {@const chat = e.type === 'CHAT_MESSAGE'}
    {@const key = authorKey(e)}
    {@const own = key !== null && ownKey !== null && key === ownKey}
    <button
      type="button"
      class={cn(
        'group w-full rounded-lg text-left transition-colors',
        active ? 'bg-white/6 ring-1 ring-nb-accent/35' : 'hover:bg-white/4',
        future && 'opacity-40'
      )}
      onclick={() => onselect(e.eventHash)}
    >
      {#if chat && e.body}
        <div class="px-1 py-0.5 opacity-75">
          <ChatBubble
            {own}
            author={own ? undefined : key ? `${key.slice(0, 6)}…${key.slice(-2)}` : undefined}
            time={time(e)}
            class="text-nb-muted"
          >
            {e.body}
          </ChatBubble>
        </div>
      {:else}
        <div class="flex items-center gap-2.5 px-3 py-2">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-nb-group text-nb-faint">
            <Icon glyph={glyph(e.type)} size={13} />
          </span>
          <span class="min-w-0 flex-1 truncate text-[12px] text-nb-muted">{label(e)}</span>
          <span class="shrink-0 text-[11px] tabular-nums text-nb-faint">{time(e)}</span>
        </div>
      {/if}
    </button>
  {/each}
</div>
