<script lang="ts">
  import { Icon } from 'nearbytes-widgets';
  import { History } from '@lucide/svelte';
  import type { FileMetadata, TimelineEvent } from 'nearbytes-files';
  import { useAdapter } from '../../context.js';

  function prettyType(t: string): string {
    return t.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  }

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
    if (f === null) {
      events = [];
      return;
    }
    void adapter.file.timeline().then((all) => {
      events = all.filter((e) => rowPath(e) === f.path);
    });
  });
</script>

<div class="flex flex-col">
  <p class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-nb-faint">
    <Icon glyph={History} size={12} /> Version history
  </p>

  {#if file === null}
    <p class="py-3 text-[12px] text-nb-muted">Select a file to see its timeline.</p>
  {:else if events.length === 0}
    <p class="rounded-lg bg-nb-group px-3 py-4 text-center text-[12px] text-nb-muted">No events recorded yet.</p>
  {:else}
    <ol class="relative flex flex-col gap-0 rounded-xl bg-nb-group p-1">
      {#each events as e, i (rowHash(e))}
        <li class="flex items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-white/5">
          <span class="relative flex size-2 shrink-0 items-center justify-center">
            <span class={['size-1.5 rounded-full', i === events.length - 1 ? 'bg-nb-accent' : 'bg-nb-faint']}></span>
          </span>
          <span class="flex-1 text-[12px] font-medium text-nb-text">{prettyType(String((e as unknown as { type?: unknown }).type))}</span>
          <span class="shrink-0 text-[11px] tabular-nums text-nb-faint">{new Date(rowTime(e)).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </li>
      {/each}
    </ol>
  {/if}
</div>
