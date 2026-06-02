<script lang="ts">
  import { ConfigSection, ConfigField, Input, Button, List, ListItem, Icon, EmptyState } from 'nearbytes-widgets';
  import { UserPlus, Trash2, Users } from '@lucide/svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();
  let draftKey = $state('');

  async function add() {
    const key = draftKey.trim().toLowerCase();
    if (key.length === 0) return;
    await adapter.friend.add(key);
    if (!app.friends.includes(key)) app.friends.push(key);
    draftKey = '';
  }
  async function remove(key: string) {
    await adapter.friend.remove(key);
    app.friends = app.friends.filter((f) => f !== key);
  }
</script>

<ConfigSection title="Friends" description="Followed profile public keys are synced like in the CLI (friend add/remove).">
  <ConfigField label="Add friend" hint="Profile public key (130 hex chars)">
    <div class="flex gap-2">
      <Input bind:value={draftKey} placeholder="04a1b2…" />
      <Button variant="default" size="md" onclick={add}><Icon glyph={UserPlus} size={14} /> Add</Button>
    </div>
  </ConfigField>

  {#if app.friends.length === 0}
    <EmptyState title="No friends" description="Add a public key to start syncing.">
      {#snippet icon()}<Icon glyph={Users} size={22} />{/snippet}
    </EmptyState>
  {:else}
    <List class="gap-0.5" label="Friends">
      {#each app.friends as key (key)}
        <ListItem>
          <span class="flex w-full items-center justify-between gap-2">
            <span class="truncate font-mono text-[12px]">{key}</span>
            <button class="text-nb-faint hover:text-nb-error" onclick={() => remove(key)} aria-label="Remove friend">
              <Icon glyph={Trash2} size={14} />
            </button>
          </span>
        </ListItem>
      {/each}
    </List>
  {/if}
</ConfigSection>
