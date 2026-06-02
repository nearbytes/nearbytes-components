<script lang="ts">
  import { ConfigSection, ConfigField, Input, Button, List, ListItem, Icon, EmptyState } from 'nearbytes-widgets';
  import { Plus, HardDrive } from '@lucide/svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();
  let label = $state('');
  let secret = $state('');

  async function add() {
    if (label.trim().length === 0 || secret.trim().length === 0) return;
    await adapter.hub.add(label.trim(), secret.trim());
    app.hubs.push({ label: label.trim(), secret: secret.trim() });
    label = ''; secret = '';
  }
</script>

<ConfigSection title="Hubs" description="Register hub/volume secrets (mirrors `volume add` in the CLI).">
  <ConfigField label="Label"><Input bind:value={label} placeholder="teamdocs" /></ConfigField>
  <ConfigField label="Secret" hint="name:password — stored 0600, exactly as the CLI volume registry">
    <div class="flex gap-2">
      <Input bind:value={secret} placeholder="teamdocs:strong-password" type="password" />
      <Button variant="default" size="md" onclick={add}><Icon glyph={Plus} size={14} /> Add</Button>
    </div>
  </ConfigField>

  {#if app.hubs.length === 0}
    <EmptyState title="No hubs" description="Add a hub secret to mount it.">
      {#snippet icon()}<Icon glyph={HardDrive} size={22} />{/snippet}
    </EmptyState>
  {:else}
    <List class="gap-0.5" label="Hubs">
      {#each app.hubs as hub (hub.label)}
        <ListItem selected={hub.label === app.activeHub} onselect={() => (app.activeHub = hub.label)}>{hub.label}</ListItem>
      {/each}
    </List>
  {/if}
</ConfigSection>
