<script lang="ts">
  import { Avatar, Button, Icon, Input, Label, cn } from 'nearbytes-widgets';
  import { Copy, Check, BadgeCheck, ChevronDown, KeyRound } from '@lucide/svelte';
  import { useAdapter } from '../../context.js';

  let { profileName, publicKey }:
    { profileName: string | null; publicKey: string | null } = $props();
  const adapter = useAdapter();

  let copied = $state(false);
  let expanded = $state(false);
  let displayName = $state('');
  let bio = $state('');
  let publishing = $state(false);
  let published = $state(false);

  const shortKey = $derived(
    publicKey ? `${publicKey.slice(0, 10)}…${publicKey.slice(-6)}` : 'No key'
  );

  async function copyKey() {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey);
      copied = true;
      setTimeout(() => (copied = false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function publish(e: Event) {
    e.preventDefault();
    if (displayName.trim() === '') return;
    publishing = true;
    try {
      await adapter.profile.publish(displayName.trim(), bio.trim() || undefined);
      published = true;
      setTimeout(() => (published = false), 1600);
      expanded = false;
    } finally {
      publishing = false;
    }
  }
</script>

<div class="shrink-0 border-t border-nb-hairline bg-nb-sidebar/80 px-3 py-2.5">
  <div class="flex items-center gap-2.5">
    <Avatar fallback={(profileName ?? '?').slice(0, 1).toUpperCase()} class="size-8 text-[13px]" />
    <div class="min-w-0 flex-1">
      <p class="truncate text-[13px] font-medium text-nb-text">{profileName ?? 'No profile'}</p>
      <button
        type="button"
        class="flex max-w-full items-center gap-1 font-mono text-[10px] text-nb-faint transition-colors hover:text-nb-muted"
        onclick={copyKey}
        disabled={!publicKey}
        title="Copy your public key"
      >
        <Icon glyph={KeyRound} size={10} />
        <span class="truncate">{shortKey}</span>
      </button>
    </div>
    <Button
      variant="ghost"
      size="icon"
      class={cn('size-7 rounded-md text-nb-faint hover:bg-white/8 hover:text-nb-text', copied && 'text-nb-online')}
      onclick={copyKey}
      disabled={!publicKey}
      aria-label="Copy public key"
      title="Copy public key to share with friends"
    >
      <Icon glyph={copied ? Check : Copy} size={14} />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      class="size-7 rounded-md text-nb-faint hover:bg-white/8 hover:text-nb-text"
      onclick={() => (expanded = !expanded)}
      aria-label="Publish profile"
      title="Publish display name & bio"
      disabled={profileName === null}
    >
      <Icon glyph={published ? BadgeCheck : ChevronDown} size={15} class={cn('transition-transform', expanded && 'rotate-180', published && 'text-nb-online')} />
    </Button>
  </div>

  {#if expanded}
    <form class="mt-2.5 flex flex-col gap-2.5 rounded-lg bg-nb-group p-3" onsubmit={publish}>
      <div class="flex flex-col gap-1.5">
        <Label for="id-name" class="text-nb-muted">Display name</Label>
        <Input id="id-name" bind:value={displayName} placeholder="Alice Doe" disabled={publishing} class="bg-nb-bg" />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label for="id-bio" class="text-nb-muted">Bio</Label>
        <Input id="id-bio" bind:value={bio} placeholder="Optional" disabled={publishing} class="bg-nb-bg" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onclick={() => (expanded = false)} disabled={publishing}>Cancel</Button>
        <Button type="submit" variant="default" size="sm" disabled={publishing || displayName.trim() === ''}>
          <Icon glyph={BadgeCheck} size={14} /> Publish
        </Button>
      </div>
    </form>
  {/if}
</div>
