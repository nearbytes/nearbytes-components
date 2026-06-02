<script lang="ts">
  import { Panel, Separator } from 'nearbytes-widgets';
  import FilePreviewPane from './FilePreviewPane.svelte';
  import FileMetadataView from './FileMetadata.svelte';
  import VersionHistory from './VersionHistory.svelte';
  import OpenExternally from './OpenExternally.svelte';
  import type { FilesView } from '../../stores/appState.svelte.js';
  import { selectedFile } from '../../stores/appState.svelte.js';

  let { files }: { files: FilesView } = $props();
  const file = $derived(selectedFile(files));
</script>

<Panel>
  <div class="flex h-full flex-col gap-3 p-3">
    <div class="h-40 shrink-0"><FilePreviewPane {file} /></div>
    {#if file}
      <div class="flex items-center justify-between">
        <span class="truncate text-[13px] font-medium text-nb-text">{file.path.split('/').pop()}</span>
        <OpenExternally {file} />
      </div>
      <Separator />
      <FileMetadataView {file} />
      <Separator />
    {/if}
    <VersionHistory {file} />
  </div>
</Panel>
