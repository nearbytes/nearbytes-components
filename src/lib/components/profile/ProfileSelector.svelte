<script lang="ts">
  import { Button, DropdownMenu, Avatar, Icon } from 'nearbytes-widgets';
  import { ChevronDown, Check, UserPlus } from '@lucide/svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();
  const activeLabel = $derived(app.activeProfile ?? 'No profile');

  async function use(name: string) {
    app.activeProfile = name;
    await adapter.profile.use(name);
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button variant="subtle" size="sm" {...props}>
        <Avatar fallback={activeLabel.slice(0, 1).toUpperCase()} class="h-4 w-4" />
        <span class="max-w-28 truncate">{activeLabel}</span>
        <Icon glyph={ChevronDown} size={13} />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    {#each app.profiles as p (p.name)}
      <DropdownMenu.Item onSelect={() => use(p.name)}>
        <span class="flex w-4 justify-center">
          {#if p.name === app.activeProfile}<Icon glyph={Check} size={13} />{/if}
        </span>
        {p.name}
      </DropdownMenu.Item>
    {/each}
    <DropdownMenu.Separator class="my-1 h-px bg-nb-hairline" />
    <DropdownMenu.Item>
      <Icon glyph={UserPlus} size={13} /> Add profile…
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
