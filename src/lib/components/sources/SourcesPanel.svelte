<script lang="ts">
  import { Panel, ScrollArea, Icon } from 'nearbytes-widgets';
  import { User, HardDrive, Users } from '@lucide/svelte';
  import ManagedList from '../list/ManagedList.svelte';
  import IdentityFooter from './IdentityFooter.svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();

  function field(values: Record<string, string>, key: string): string {
    return values[key]?.trim() ?? '';
  }

  const profileRows = $derived(
    app.profiles.map((p) => ({
      id: p.name,
      title: p.name,
      editValues: { name: p.name, secret: '' }
    }))
  );

  const hubRows = $derived(
    app.hubs.map((h) => ({
      id: h.label,
      title: h.label,
      editValues: { label: h.label, secret: '' }
    }))
  );

  function shortHexKey(key: string): string {
    if (key.length <= 16) return key;
    return `${key.slice(0, 6)}…${key.slice(-4)}`;
  }

  const friendRows = $derived(
    app.friends.map((key) => ({
      id: key,
      title: shortHexKey(key),
      hint: key,
      mono: true,
      editValues: { key }
    }))
  );

  async function selectProfile(name: string) {
    app.activeProfile = name;
    await adapter.profile.use(name);
    try {
      const w = await adapter.whoami();
      app.identity = { publicKey: w.activeProfileKey || null, peerId: w.peerId || null };
    } catch {
      /* identity refresh is best-effort */
    }
  }

  async function selectHub(label: string) {
    app.activeHub = label;
    await adapter.hub.use(label);
  }
</script>

<Panel surface="sidebar" chrome="sidebar" class="h-full">
  <ScrollArea class="min-h-0 flex-1">
    <div class="px-1 pb-4 pt-1">
      <ManagedList
        title="Profiles"
        rows={profileRows}
        selectedId={app.activeProfile}
        emptyTitle="No profiles"
        emptyDescription="Add a profile to enable sync."
        fields={[
          { key: 'name', label: 'Name', placeholder: 'alice' },
          { key: 'secret', label: 'Secret', placeholder: 'alice:strong-secret', secret: true }
        ]}
        onselect={selectProfile}
        onreorder={async (names) => {
          await adapter.profile.reorder(names);
          const byName = new Map(app.profiles.map((p) => [p.name, p]));
          app.profiles = names
            .map((n) => byName.get(n))
            .filter((p): p is (typeof app.profiles)[number] => p !== undefined);
        }}
        onadd={async (v) => {
          const name = field(v, 'name');
          const secret = field(v, 'secret');
          await adapter.profile.add(name, secret);
          app.profiles.push({ name, secret });
          if (app.activeProfile === null) app.activeProfile = name;
        }}
        onupdate={async (id, v) => {
          const name = field(v, 'name');
          const secret = field(v, 'secret');
          const patch: { name?: string; secret?: string } = { name };
          if (secret.length > 0) patch.secret = secret;
          await adapter.profile.update(id, patch);
          if (app.activeProfile === id) app.activeProfile = name;
          app.profiles = await adapter.profile.list();
        }}
        onremove={async (id) => {
          await adapter.profile.remove(id);
          app.profiles = app.profiles.filter((p) => p.name !== id);
          if (app.activeProfile === id) {
            app.activeProfile = app.profiles[0]?.name ?? null;
          }
        }}
      >
        {#snippet leading()}
          <Icon glyph={User} size={15} />
        {/snippet}
      </ManagedList>

      <ManagedList
        title="Hubs"
        rows={hubRows}
        selectedId={app.activeHub}
        emptyTitle="No hubs"
        emptyDescription="Add a hub to browse files and chat."
        fields={[
          { key: 'label', label: 'Label', placeholder: 'teamdocs' },
          { key: 'secret', label: 'Secret', placeholder: 'teamdocs:password', secret: true }
        ]}
        onselect={selectHub}
        onreorder={async (labels) => {
          await adapter.hub.reorder(labels);
          const byLabel = new Map(app.hubs.map((h) => [h.label, h]));
          app.hubs = labels
            .map((l) => byLabel.get(l))
            .filter((h): h is (typeof app.hubs)[number] => h !== undefined);
        }}
        onadd={async (v) => {
          const label = field(v, 'label');
          const secret = field(v, 'secret');
          await adapter.hub.add(label, secret);
          app.hubs.push({ label, secret });
        }}
        onupdate={async (id, v) => {
          const label = field(v, 'label');
          const secret = field(v, 'secret');
          const patch: { label?: string; secret?: string } = { label };
          if (secret.length > 0) patch.secret = secret;
          await adapter.hub.update(id, patch);
          if (app.activeHub === id) app.activeHub = label;
          app.hubs = await adapter.hub.list();
        }}
        onremove={async (id) => {
          await adapter.hub.forget(id);
          app.hubs = app.hubs.filter((h) => h.label !== id);
          if (app.activeHub === id) {
            app.activeHub = null;
            app.files.items = [];
            app.files.directories = [];
            app.chat.items = [];
          }
        }}
      >
        {#snippet leading()}
          <Icon glyph={HardDrive} size={15} />
        {/snippet}
      </ManagedList>

      <ManagedList
        title="Friends"
        rows={friendRows}
        emptyTitle="No friends"
        emptyDescription="Add a public key to follow a profile."
        fields={[{ key: 'key', label: 'Public key', placeholder: '04a1b2… (130 hex)' }]}
        onreorder={async (keys) => {
          await adapter.friend.reorder(keys);
          app.friends = [...keys];
        }}
        onadd={async (v) => {
          const key = field(v, 'key').toLowerCase();
          await adapter.friend.add(key);
          if (!app.friends.includes(key)) app.friends.push(key);
        }}
        onupdate={async (id, v) => {
          const key = field(v, 'key').toLowerCase();
          if (key !== id) {
            await adapter.friend.remove(id);
            await adapter.friend.add(key);
            app.friends = app.friends.map((f) => (f === id ? key : f));
          }
        }}
        onremove={async (id) => {
          await adapter.friend.remove(id);
          app.friends = app.friends.filter((f) => f !== id);
        }}
      >
        {#snippet leading()}
          <Icon glyph={Users} size={15} />
        {/snippet}
      </ManagedList>
    </div>
  </ScrollArea>

  <IdentityFooter profileName={app.activeProfile} publicKey={app.identity.publicKey} />
</Panel>
