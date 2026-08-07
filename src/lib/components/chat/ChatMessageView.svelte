<script lang="ts">
  import { ChatBubble } from 'nearbytes-widgets';
  import { isAttributed } from 'nearbytes-chat';
  import type { ChatTimelineItem } from 'nearbytes-chat';

  let { item, ownKey, names = {}, grouped = false }:
    {
      item: ChatTimelineItem;
      ownKey: string | null;
      /** Verified profile key → display name, when the reader can resolve one. */
      names?: Record<string, string>;
      grouped?: boolean;
    } = $props();

  // Messages written before per-author attribution carry `k` equal to the
  // channel key, which names the hub rather than a person. Rendering that as an
  // author invents a participant who does not exist, so those stay anonymous.
  const attributed = $derived(isAttributed(item));
  const own = $derived(attributed && ownKey !== null && item.message.k === ownKey);
  const author = $derived(
    !attributed
      ? undefined
      : (names[item.message.k] ?? `${item.message.k.slice(0, 6)}…${item.message.k.slice(-2)}`)
  );
  const time = $derived(
    new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
</script>

<ChatBubble {own} author={grouped || own ? undefined : author} time={time}>{item.message.body}</ChatBubble>
