<script lang="ts">
  import { Icon } from 'nearbytes-widgets';
  import { ChevronRight, HardDrive } from '@lucide/svelte';
  import { crumbs } from './paths.js';

  let { root, cwd, onnavigate }:
    { root: string; cwd: string; onnavigate: (path: string) => void } = $props();
  const segs = $derived(crumbs(cwd));
</script>

<nav class="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden text-[13px]" aria-label="Location">
  <button
    type="button"
    class={['flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-white/8',
      cwd === '' ? 'font-semibold text-nb-text' : 'text-nb-muted hover:text-nb-text']}
    onclick={() => onnavigate('')}
  >
    <Icon glyph={HardDrive} size={14} class="text-nb-accent" />
    <span class="max-w-40 truncate">{root}</span>
  </button>
  {#each segs as seg, i (seg.path)}
    <Icon glyph={ChevronRight} size={13} class="shrink-0 text-nb-faint" />
    <button
      type="button"
      class={['min-w-0 truncate rounded-md px-1.5 py-1 transition-colors hover:bg-white/8',
        i === segs.length - 1 ? 'font-semibold text-nb-text' : 'text-nb-muted hover:text-nb-text']}
      onclick={() => onnavigate(seg.path)}
    >
      {seg.name}
    </button>
  {/each}
</nav>
