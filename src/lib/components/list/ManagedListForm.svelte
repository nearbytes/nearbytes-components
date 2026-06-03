<script lang="ts">
  import { Button, Icon, Input, Label } from 'nearbytes-widgets';
  import { Check, X } from '@lucide/svelte';
  import type { ListField } from './types.js';

  let {
    sectionTitle,
    fields,
    draft = $bindable(),
    editing,
    busy,
    oncancel,
    onsubmit
  }: {
    sectionTitle: string;
    fields: ListField[];
    draft: Record<string, string>;
    editing: boolean;
    busy: boolean;
    oncancel: () => void;
    onsubmit: () => void;
  } = $props();
</script>

<form
  class="mx-3 mb-2 flex flex-col gap-3 rounded-lg bg-nb-group p-3"
  onsubmit={(e) => { e.preventDefault(); onsubmit(); }}
>
  {#each fields as field (field.key)}
    <div class="flex flex-col gap-1.5">
      <Label for={`${sectionTitle}-${field.key}`} class="text-nb-muted">{field.label}</Label>
      <Input
        id={`${sectionTitle}-${field.key}`}
        type={field.secret ? 'password' : 'text'}
        bind:value={draft[field.key]}
        placeholder={field.placeholder}
        disabled={busy}
        class="bg-nb-bg"
      />
    </div>
  {/each}
  {#if editing && fields.some((f) => f.secret)}
    <p class="text-[11px] leading-snug text-nb-faint">Leave secret blank to keep the current value.</p>
  {/if}
  <div class="flex justify-end gap-2">
    <Button type="button" variant="ghost" size="sm" onclick={oncancel} disabled={busy}>
      <Icon glyph={X} size={14} /> Cancel
    </Button>
    <Button type="submit" variant="default" size="sm" disabled={busy}>
      <Icon glyph={Check} size={14} /> {editing ? 'Save' : 'Add'}
    </Button>
  </div>
</form>
