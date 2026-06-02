<script lang="ts">
  import { Button, Icon } from 'nearbytes-widgets';
  import { ExternalLink } from '@lucide/svelte';
  import { useAdapter } from '../../context.js';
  import type { FileMetadata } from 'nearbytes-files';

  let { file }: { file: FileMetadata | null } = $props();
  const adapter = useAdapter();
</script>

<Button variant="subtle" size="sm" disabled={!file}
  onclick={() => file && adapter.file.openExternally(file.path.split('/').pop() ?? file.path)}>
  <Icon glyph={ExternalLink} size={14} /> Open
</Button>
