<script lang="ts">
  import { EmptyState, Icon } from 'nearbytes-widgets';
  import { History } from '@lucide/svelte';
  import type { FileMetadata } from 'nearbytes-files';

  // Placeholder: the event log already records every version; this view will
  // project the file's CREATE_FILE timeline once the adapter exposes it.
  let { file }: { file: FileMetadata | null } = $props();
</script>

<EmptyState
  title="Version history"
  description={file ? `History for ${file.path.split('/').pop()} is not wired yet.` : 'Select a file to view its history.'}>
  {#snippet icon()}<Icon glyph={History} size={24} />{/snippet}
</EmptyState>
