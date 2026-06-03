<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Alert, Button, Icon, InsetGroup } from 'nearbytes-widgets';
  import { Plus } from '@lucide/svelte';
  import ManagedListForm from './ManagedListForm.svelte';
  import ManagedListRow from './ManagedListRow.svelte';
  import type { ListField, ListRow } from './types.js';

  let {
    title,
    rows,
    selectedId = null,
    fields,
    emptyTitle,
    emptyDescription,
    onselect,
    onreorder,
    onadd,
    onupdate,
    onremove,
    leading
  }: {
    title: string;
    rows: ListRow[];
    selectedId?: string | null;
    fields: ListField[];
    emptyTitle: string;
    emptyDescription: string;
    onselect?: (id: string) => void;
    onreorder: (ids: string[]) => void | Promise<void>;
    onadd: (values: Record<string, string>) => void | Promise<void>;
    onupdate: (id: string, values: Record<string, string>) => void | Promise<void>;
    onremove: (id: string) => void | Promise<void>;
    leading?: Snippet<[{ row: ListRow }]>;
  } = $props();

  let adding = $state(false);
  let editingId = $state<string | null>(null);
  let draft = $state<Record<string, string>>({});
  let dragFrom = $state<number | null>(null);
  let dropOn = $state<number | null>(null);
  let busy = $state(false);
  let error = $state<string | null>(null);
  let pendingDeleteId = $state<string | null>(null);

  function emptyDraft(seed?: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const f of fields) out[f.key] = seed?.[f.key] ?? '';
    return out;
  }

  function startAdd(): void {
    editingId = null;
    adding = true;
    draft = emptyDraft();
    error = null;
  }

  function startEdit(row: ListRow): void {
    adding = false;
    editingId = row.id;
    draft = emptyDraft(row.editValues ?? { [fields[0]?.key ?? 'name']: row.title });
    error = null;
  }

  function cancelForm(): void {
    adding = false;
    editingId = null;
    draft = emptyDraft();
    error = null;
  }

  async function submitForm(): Promise<void> {
    error = null;
    busy = true;
    try {
      const values: Record<string, string> = {};
      for (const f of fields) values[f.key] = draft[f.key]?.trim() ?? '';
      if (editingId !== null) await onupdate(editingId, values);
      else await onadd(values);
      cancelForm();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  async function confirmDelete(): Promise<void> {
    if (pendingDeleteId === null) return;
    busy = true;
    error = null;
    try {
      await onremove(pendingDeleteId);
      if (editingId === pendingDeleteId) cancelForm();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
      pendingDeleteId = null;
    }
  }

  function reorderIndices(from: number, to: number): void {
    if (from === to || from < 0 || to < 0) return;
    const ids = rows.map((r) => r.id);
    const [moved] = ids.splice(from, 1);
    if (moved === undefined) return;
    ids.splice(to, 0, moved);
    void onreorder(ids);
  }
</script>

<section class="managed-list-section flex flex-col" aria-label={title}>
  <div class="group/head flex items-center gap-0 px-3 pb-1 pt-3">
    <h3 class="min-w-0 flex-1 truncate pl-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-nb-faint">{title}</h3>
    <Button
      variant="ghost"
      size="icon"
      class="size-6 shrink-0 rounded-md text-nb-faint opacity-70 transition-all hover:bg-white/10 hover:text-nb-text group-hover/head:opacity-100"
      onclick={startAdd}
      disabled={busy || adding}
      aria-label={`Add ${title}`}
    >
      <Icon glyph={Plus} size={14} />
    </Button>
  </div>

  {#if error}
    <Alert variant="destructive" class="mx-2 mb-2 text-[12px]">{error}</Alert>
  {/if}

  {#if adding || editingId !== null}
    <ManagedListForm
      sectionTitle={title}
      {fields}
      bind:draft
      editing={editingId !== null}
      {busy}
      oncancel={cancelForm}
      onsubmit={() => void submitForm()}
    />
  {/if}

  {#if rows.length === 0 && !adding}
    <InsetGroup class="mx-3 mb-1">
      <p class="px-4 py-5 text-center text-[12px] leading-relaxed text-nb-muted">
        {emptyDescription}
      </p>
    </InsetGroup>
  {:else if rows.length > 0}
    <InsetGroup class="mx-3 mb-1">
    <ul class="flex flex-col gap-px py-0.5" role="listbox" aria-label={title}>
      {#each rows as row, index (row.id)}
        {#snippet rowLeading()}
          {#if leading}{@render leading({ row })}{/if}
        {/snippet}
        <ManagedListRow
          {row}
          {busy}
          selected={selectedId === row.id}
          confirming={pendingDeleteId === row.id}
          dropHighlight={dropOn === index && dragFrom !== null && dragFrom !== index}
          draggable={editingId === null && !adding && pendingDeleteId === null}
          showActivate={onselect !== undefined}
          leading={leading ? rowLeading : undefined}
          onselect={onselect ? () => onselect(row.id) : undefined}
          onedit={() => startEdit(row)}
          ondelete={() => { pendingDeleteId = row.id; }}
          onconfirmdelete={() => void confirmDelete()}
          oncanceldelete={() => { pendingDeleteId = null; }}
          ondragstart={(e) => {
            dragFrom = index;
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(index));
            }
          }}
          ondragover={(e) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
            dropOn = index;
          }}
          ondrop={(e) => {
            e.preventDefault();
            const from = dragFrom ?? Number(e.dataTransfer?.getData('text/plain'));
            reorderIndices(from, index);
            dragFrom = null;
            dropOn = null;
          }}
          ondragend={() => { dragFrom = null; dropOn = null; }}
        />
      {/each}
    </ul>
    </InsetGroup>
  {/if}
</section>
