<script lang="ts">
  import { Icon } from 'nearbytes-widgets';
  import { Paperclip } from '@lucide/svelte';
  // Presentational only; the chat protocol does not yet define attachments,
  // so this renders an opaque reference label the app may pass through.
  let { label }: { label: string } = $props();
</script>

<span class="inline-flex items-center gap-1.5 rounded-nb-sm bg-black/20 px-2 py-1 text-[12px]">
  <Icon glyph={Paperclip} size={13} /> {label}
</span>
