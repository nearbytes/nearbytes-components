<script lang="ts">
  import { Panel, ScrollArea, Separator, Icon } from 'nearbytes-widgets';
  import { Settings } from '@lucide/svelte';
  import ProfilesConfig from './ProfilesConfig.svelte';
  import HubsConfig from './HubsConfig.svelte';
  import FriendsConfig from './FriendsConfig.svelte';
</script>

<Panel>
  {#snippet header()}<span class="flex items-center gap-2"><Icon glyph={Settings} size={14} />Configuration</span>{/snippet}
  <ScrollArea class="h-full">
    <div class="mx-auto flex max-w-xl flex-col px-4">
      <ProfilesConfig />
      <Separator />
      <HubsConfig />
      <Separator />
      <FriendsConfig />
    </div>
  </ScrollArea>
</Panel>
