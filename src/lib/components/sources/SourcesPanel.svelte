<script lang="ts">
  import { Panel, ScrollArea, EmptyState, Icon } from 'nearbytes-widgets';
  import { Network, Plus } from '@lucide/svelte';
  import HubEntry from './HubEntry.svelte';
  import FriendEntry from './FriendEntry.svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();

  function selectHub(label: string) {
    app.activeHub = label;
    void adapter.hub.use(label);
  }
</script>

<Panel surface="sidebar">
  {#snippet header()}<span class="flex items-center gap-2"><Icon glyph={Network} size={14} />Sources</span>{/snippet}

  <ScrollArea class="h-full">
    <div class="flex flex-col gap-4 p-2">
      <div class="flex flex-col gap-0.5">
        <p class="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-nb-faint">Hubs</p>
        {#if app.hubs.length === 0}
          <p class="px-2 text-[12px] text-nb-faint">No hubs yet</p>
        {:else}
          {#each app.hubs as hub (hub.label)}
            <HubEntry {hub} selected={hub.label === app.activeHub} onselect={selectHub} />
          {/each}
        {/if}
      </div>

      <div class="flex flex-col gap-0.5">
        <p class="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-nb-faint">Friends</p>
        {#if app.friends.length === 0}
          <p class="px-2 text-[12px] text-nb-faint">No friends followed</p>
        {:else}
          {#each app.friends as key (key)}
            <FriendEntry publicKey={key} />
          {/each}
        {/if}
      </div>
    </div>
  </ScrollArea>
</Panel>
