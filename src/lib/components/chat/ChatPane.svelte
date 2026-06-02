<script lang="ts">
  import { Panel, ScrollArea, ChatComposer, EmptyState, Icon } from 'nearbytes-widgets';
  import { MessageSquare } from '@lucide/svelte';
  import ChatMessageView from './ChatMessageView.svelte';
  import type { ChatView } from '../../stores/appState.svelte.js';
  import { useAdapter } from '../../context.js';

  let { chat, ownKey = null, hubLabel = null }:
    { chat: ChatView; ownKey?: string | null; hubLabel?: string | null } = $props();
  const adapter = useAdapter();

  function send(text: string) { void adapter.chat.say(text); }
</script>

<Panel>
  {#snippet header()}
    <span class="flex items-center gap-2"><Icon glyph={MessageSquare} size={14} />Chat{#if hubLabel}<span class="text-nb-faint">· {hubLabel}</span>{/if}</span>
  {/snippet}

  <div class="flex h-full flex-col">
    {#if chat.items.length === 0}
      <EmptyState title="No messages" description={hubLabel ? 'Say hello to this hub.' : 'Select a hub to start chatting.'}>
        {#snippet icon()}<Icon glyph={MessageSquare} size={26} />{/snippet}
      </EmptyState>
    {:else}
      <ScrollArea class="min-h-0 flex-1">
        <div class="flex flex-col gap-2 p-3">
          {#each chat.items as item (item.eventHash)}
            <ChatMessageView {item} {ownKey} />
          {/each}
        </div>
      </ScrollArea>
    {/if}
    <ChatComposer bind:value={chat.draft} disabled={hubLabel === null} onsubmit={send} />
  </div>
</Panel>
