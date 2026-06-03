<script lang="ts">
  import { ChatBubble } from 'nearbytes-widgets';
  import type { ChatTimelineItem } from 'nearbytes-chat';

  let { item, ownKey, grouped = false }:
    { item: ChatTimelineItem; ownKey: string | null; grouped?: boolean } = $props();
  const own = $derived(ownKey !== null && item.message.k === ownKey);
  const author = $derived(`${item.message.k.slice(0, 6)}…${item.message.k.slice(-2)}`);
  const time = $derived(
    new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
</script>

<ChatBubble {own} author={grouped || own ? undefined : author} time={time}>{item.message.body}</ChatBubble>
