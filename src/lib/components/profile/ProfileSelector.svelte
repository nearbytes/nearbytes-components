<script lang="ts">
  import { Avatar, Button, DropdownMenu, Icon, Separator } from 'nearbytes-widgets';
  import { Check, ChevronDown } from '@lucide/svelte';
  import { useAppState, useAdapter } from '../../context.js';

  const app = useAppState();
  const adapter = useAdapter();
  const activeLabel = $derived(app.activeProfile ?? 'No profile');

  async function use(name: string): Promise<void> {
    app.activeProfile = name;
    await adapter.profile.use(name);
    try {
      const w = await adapter.whoami();
      app.identity = { publicKey: w.activeProfileKey || null, peerId: w.peerId || null };
    } catch {
      /* identity refresh is best-effort */
    }
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <Button
        variant="ghost"
        size="sm"
        class="h-8 gap-2 rounded-lg px-2.5 hover:bg-white/8"
        {...props}
      >
        <Avatar fallback={activeLabel.slice(0, 1).toUpperCase()} class="size-6 text-[11px]" />
        <span class="max-w-40 truncate text-[13px] font-medium">{activeLabel}</span>
        <Icon glyph={ChevronDown} size={13} class="text-nb-faint" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end" class="min-w-[11rem]">
    <p class="px-2.5 py-1.5 text-[11px] font-medium text-nb-faint">Profile</p>
    <Separator />
    {#if app.profiles.length === 0}
      <p class="px-3 py-3 text-[12px] text-nb-muted">Add a profile in the sidebar.</p>
    {:else}
      {#each app.profiles as p (p.name)}
        <DropdownMenu.Item onSelect={() => use(p.name)} class="gap-2">
          <span class="flex size-4 shrink-0 justify-center text-nb-accent">
            {#if p.name === app.activeProfile}<Icon glyph={Check} size={14} />{/if}
          </span>
          <span class="truncate">{p.name}</span>
        </DropdownMenu.Item>
      {/each}
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
