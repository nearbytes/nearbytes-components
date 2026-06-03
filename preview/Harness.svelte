<script lang="ts">
  import { onMount } from 'svelte';
  import { createAppState, provideAppState, provideAdapter, AppShell } from 'nearbytes-components';
  import { createMockAdapter, seed } from './mockAdapter.js';

  const app = createAppState();
  const adapter = createMockAdapter();
  provideAppState(app);
  provideAdapter(adapter);

  onMount(async () => {
    app.profiles = await adapter.profile.list();
    app.activeProfile = await adapter.profile.active();
    app.hubs = await adapter.hub.list();
    app.activeHub = await adapter.hub.active();
    app.friends = await adapter.friend.list();
    const v = await adapter.file.list();
    app.files.items = [...v.files];
    app.files.directories = [...v.directories];
    app.chat.items = await adapter.chat.read();
    const s = await adapter.status();
    app.status = { text: s.text, kind: 'online' };
    const who = await adapter.whoami();
    app.identity = { publicKey: who.activeProfileKey, peerId: who.peerId };

    adapter.onActiveVolume((view) => {
      app.files.items = [...view.files];
      app.files.directories = [...view.directories];
    });
    adapter.onChat((items) => { app.chat.items = [...items]; });
    void seed;
  });
</script>

<div class="h-full min-h-0 w-full">
  <AppShell />
</div>
