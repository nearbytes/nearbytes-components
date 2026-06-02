<script lang="ts">
  import { ConfigSection, ConfigField, Input, Button, List, ListItem, Icon, EmptyState } from 'nearbytes-widgets';
  import { UserPlus, User } from '@lucide/svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();
  let name = $state('');
  let secret = $state('');

  async function add() {
    if (name.trim().length === 0 || secret.trim().length === 0) return;
    await adapter.profile.add(name.trim(), secret.trim());
    app.profiles.push({ name: name.trim(), secret: secret.trim() });
    if (app.activeProfile === null) app.activeProfile = name.trim();
    name = ''; secret = '';
  }
</script>

<ConfigSection title="Profiles" description="Sync/social keypairs (mirrors `profile add/use`). First profile becomes active.">
  <ConfigField label="Name"><Input bind:value={name} placeholder="alice" /></ConfigField>
  <ConfigField label="Secret" hint="name:password seed for crypto.deriveKeys">
    <div class="flex gap-2">
      <Input bind:value={secret} placeholder="alice:strong-secret" type="password" />
      <Button variant="default" size="md" onclick={add}><Icon glyph={UserPlus} size={14} /> Add</Button>
    </div>
  </ConfigField>

  {#if app.profiles.length === 0}
    <EmptyState title="No profiles" description="Add a profile to enable sync.">
      {#snippet icon()}<Icon glyph={User} size={22} />{/snippet}
    </EmptyState>
  {:else}
    <List class="gap-0.5" label="Profiles">
      {#each app.profiles as p (p.name)}
        <ListItem selected={p.name === app.activeProfile} onselect={() => { app.activeProfile = p.name; void adapter.profile.use(p.name); }}>
          {p.name}
        </ListItem>
      {/each}
    </List>
  {/if}
</ConfigSection>
