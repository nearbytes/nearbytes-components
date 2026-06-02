<script lang="ts">
  import { EmptyState, Icon, ScrollArea } from 'nearbytes-widgets';
  import { History } from '@lucide/svelte';
  import type { FileMetadata, TimelineEvent } from 'nearbytes-files';
  import { useAdapter } from '../../context.js';

  let { file }: { file: FileMetadata | null } = $props();
  const adapter = useAdapter();
  let events = $state<TimelineEvent[]>([]);

  function rowPath(e: TimelineEvent): string | undefined {
    return (e as unknown as { path?: string }).path;
  }
  function rowTime(e: TimelineEvent): number {
    return (e as unknown as { timestamp?: number }).timestamp ?? 0;
  }
  function rowHash(e: TimelineEvent): string {
    return (e as unknown as { eventHash?: string }).eventHash ?? '';
  }

  $effect(() => {
    const f = file;
    if (f === null) { events = []; return; }
    void adapter.file.timeline().then((all) => {
      events = all.filter((e) => rowPath(e) === f.path);
    });
  });
</script>

{#if file === null}
  <EmptyState title="Version history" description="Select a file to view its timeline.">
    {#snippet icon()}<Icon glyph={History} size={24} />{/snippet}
  </EmptyState>
{:else if events.length === 0}
  <EmptyState title="No history" description={`No recorded events for ${file.path.split('/').pop()}.`}>
    {#snippet icon()}<Icon glyph={History} size={24} />{/snippet}
  </EmptyState>
{:else}
  <ScrollArea class="max-h-40">
    <ul class="flex flex-col gap-1 text-[12px]">
      {#each events as e (rowHash(e))}
        <li class="flex items-center justify-between gap-2 rounded-nb-sm px-2 py-1 hover:bg-nb-elevated">
          <span class="font-mono text-nb-accent">{String((e as unknown as { type?: unknown }).type)}</span>
          <span class="text-nb-faint">{new Date(rowTime(e)).toLocaleString()}</span>
        </li>
      {/each}
    </ul>
  </ScrollArea>
{/if}
