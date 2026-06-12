<script lang="ts">
  import { Panel, PanelTitle, ScrollArea, ChatComposer, EmptyState, Icon, Button, cn } from 'nearbytes-widgets';
  import { History, MessageSquare } from '@lucide/svelte';
  import ChatMessageView from './ChatMessageView.svelte';
  import ChatTimelineFeed from './ChatTimelineFeed.svelte';
  import type { ChatView, TimelineView } from '../../stores/appState.svelte.js';
  import { useAdapter } from '../../context.js';

  let {
    chat,
    timeline,
    ownKey = null,
    hubLabel = null
  }: {
    chat: ChatView;
    timeline: TimelineView;
    ownKey?: string | null;
    hubLabel?: string | null;
  } = $props();
  const adapter = useAdapter();

  async function loadTimeline(): Promise<void> {
    if (hubLabel === null) {
      timeline.events = [];
      return;
    }
    timeline.events = await adapter.file.timeline();
  }

  async function toggleTimeline(): Promise<void> {
    if (timeline.enabled) {
      timeline.enabled = false;
      if (timeline.cursorHash !== null) {
        const view = await adapter.volume.live();
        timeline.cursorHash = view.cursorHash;
      }
      return;
    }
    timeline.enabled = true;
    await loadTimeline();
  }

  async function selectEvent(eventHash: string): Promise<void> {
    const view = await adapter.volume.goto(eventHash);
    timeline.cursorHash = view.cursorHash;
  }

  function send(text: string): void {
    void adapter.chat.say(text);
  }

  $effect(() => {
    const hub = hubLabel;
    timeline.enabled = false;
    timeline.events = [];
    timeline.cursorHash = null;
    void hub;
  });

  $effect(() => {
    if (!timeline.enabled || hubLabel === null) return;
    void adapter.file.timeline().then((events) => { timeline.events = events; });
  });
</script>

<Panel surface="surface" class="h-full">
  {#snippet header()}
    <div class="flex w-full items-center justify-between gap-2">
      <PanelTitle
        title={timeline.enabled ? 'Timeline' : 'Chat'}
        glyph={timeline.enabled ? History : MessageSquare}
        detail={hubLabel}
      />
      <div class="flex shrink-0 items-center gap-1">
        {#if timeline.enabled && timeline.cursorHash !== null}
          <Button
            variant="ghost"
            size="sm"
            class="h-7 px-2 text-[11px] text-nb-faint hover:text-nb-text"
            onclick={() => void adapter.volume.live().then((v) => { timeline.cursorHash = v.cursorHash; })}
          >
            Live
          </Button>
        {/if}
        <Button
          variant={timeline.enabled ? 'subtle' : 'ghost'}
          size="icon"
          class={cn(
            'size-7 rounded-md',
            timeline.enabled
              ? 'text-nb-accent'
              : 'text-nb-faint hover:bg-white/8 hover:text-nb-text'
          )}
          disabled={hubLabel === null}
          aria-label="Toggle timeline"
          aria-pressed={timeline.enabled}
          onclick={() => void toggleTimeline()}
        >
          <Icon glyph={History} size={15} />
        </Button>
      </div>
    </div>
  {/snippet}

  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    {#if hubLabel === null}
      <EmptyState title="No hub" description="Choose a hub in the sidebar.">
        {#snippet icon()}<Icon glyph={MessageSquare} size={32} class="text-nb-faint" />{/snippet}
      </EmptyState>
    {:else if timeline.enabled}
      {#if timeline.events.length === 0}
        <EmptyState title="No events" description="Activity on this hub will appear here.">
          {#snippet icon()}<Icon glyph={History} size={32} class="text-nb-faint" />{/snippet}
        </EmptyState>
      {:else}
        <ScrollArea class="min-h-0 flex-1">
          <div class="px-3 py-3">
            <ChatTimelineFeed
              events={timeline.events}
              cursorHash={timeline.cursorHash}
              {ownKey}
              onselect={(hash) => void selectEvent(hash)}
            />
          </div>
        </ScrollArea>
      {/if}
      <div class="shrink-0 border-t border-nb-hairline px-4 py-2">
        <p class="text-center text-[11px] text-nb-faint">
          {#if timeline.cursorHash === null}
            At live head — click an event to browse files at that moment
          {:else}
            Read-only — browsing history
          {/if}
        </p>
      </div>
    {:else if chat.items.length === 0}
      <EmptyState title="No messages" description="Send the first message to this hub.">
        {#snippet icon()}<Icon glyph={MessageSquare} size={32} class="text-nb-faint" />{/snippet}
      </EmptyState>
    {:else}
      <ScrollArea class="min-h-0 flex-1">
        <div class="flex flex-col gap-2.5 px-4 py-4">
          {#each chat.items as item, i (item.eventHash)}
            {@const prev = chat.items[i - 1]}
            <ChatMessageView {item} {ownKey} grouped={prev !== undefined && prev.message.k === item.message.k} />
          {/each}
        </div>
      </ScrollArea>
    {/if}

    {#if !timeline.enabled}
      <div class="shrink-0 px-4 pb-4 pt-2">
        <ChatComposer bind:value={chat.draft} disabled={hubLabel === null} onsubmit={send} />
      </div>
    {/if}
  </div>
</Panel>
