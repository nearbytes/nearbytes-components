<script lang="ts">
  import { FilePreview, Icon } from 'nearbytes-widgets';
  import { FileText } from '@lucide/svelte';
  import type { FileMetadata } from 'nearbytes-files';

  let { file }: { file: FileMetadata | null } = $props();
  const isImage = $derived(file?.mimeType?.startsWith('image/') ?? false);
</script>

<FilePreview fallbackLabel={file ? 'Preview unavailable' : 'No file selected'}>
  {#if file}
    {#if isImage}
      <Icon glyph={FileText} size={40} class="text-nb-faint" />
    {:else}
      <div class="flex flex-col items-center gap-2 text-nb-faint">
        <Icon glyph={FileText} size={40} />
        <span class="text-[12px]">{file.path.split('/').pop()}</span>
      </div>
    {/if}
  {/if}
</FilePreview>
