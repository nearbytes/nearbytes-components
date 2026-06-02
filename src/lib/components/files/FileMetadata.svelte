<script lang="ts">
  import type { FileMetadata } from 'nearbytes-files';
  let { file }: { file: FileMetadata } = $props();

  function fmtSize(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
    return `${(n / 1024 ** 3).toFixed(1)} GB`;
  }
</script>

<dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px]">
  <dt class="text-nb-faint">Name</dt><dd class="truncate text-nb-text">{file.path.split('/').pop()}</dd>
  <dt class="text-nb-faint">Path</dt><dd class="truncate text-nb-muted">{file.path}</dd>
  <dt class="text-nb-faint">Size</dt><dd class="text-nb-text">{fmtSize(file.size)}</dd>
  {#if file.mimeType}<dt class="text-nb-faint">Type</dt><dd class="text-nb-text">{file.mimeType}</dd>{/if}
  <dt class="text-nb-faint">Created</dt><dd class="text-nb-text">{new Date(file.createdAt).toLocaleString()}</dd>
  <dt class="text-nb-faint">Blob</dt><dd class="truncate font-mono text-nb-muted">{file.blobHash.slice(0, 16)}…</dd>
</dl>
