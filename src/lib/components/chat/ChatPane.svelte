<script lang="ts">
  import { Panel, PanelTitle, ScrollArea, ChatComposer, EmptyState, Icon } from 'nearbytes-widgets';
  import { MessageSquare } from '@lucide/svelte';
  import ChatMessageView from './ChatMessageView.svelte';
  import type { ChatView } from '../../stores/appState.svelte.js';
  import { useAdapter } from '../../context.js';

  let { chat, ownKey = null, hubLabel = null }:
    { chat: ChatView; ownKey?: string | null; hubLabel?: string | null } = $props();
  const adapter = useAdapter();

  function send(text: string) {
    void adapter.chat.say(text);
  }
</script>

<Panel surface="surface" class="h-full">
  {#snippet header()}
    <PanelTitle title="Chat" glyph={MessageSquare} detail={hubLabel} />
  {/snippet}

  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    {#if chat.items.length === 0}
      <EmptyState
        title="No messages"
        description={hubLabel ? 'Send the first message to this hub.' : 'Choose a hub in the sidebar.'}
      >
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

    <div class="shrink-0 px-4 pb-4 pt-2">
      <ChatComposer bind:value={chat.draft} disabled={hubLabel === null} onsubmit={send} />
    </div>
  </div>
</Panel>
