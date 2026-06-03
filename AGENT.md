# AGENT.md — nearbytes-components

App-level NearBytes component library. Composes `nearbytes-widgets` into the
Finder-like file manager + chat experience. Uses a single Svelte 5 deep-reactive
app-state tree (sub-records passed by reference) and a typed `NearbytesAdapter`
boundary for all non-renderer capability.

## Read before editing
All work MUST follow **[SWE/CODING.md](./SWE/CODING.md)** (shared UI guidelines).

## Rules specific to this repo
- Compose UI from **shadcn-svelte** primitives exported by `nearbytes-widgets`
  (`Button`, `Card`, `Label`, `Alert`, `AlertDialog`, `DropdownMenu`, `ContextMenu`, …).
  Do not use raw `<button>` / hand-rolled dialogs when a primitive exists.
- Renderer-only. Import protocol domain types with `import type` only
  (`nearbytes-files`, `nearbytes-chat`, `nearbytes-skeleton`); never their runtime.
- No Node/Electron. Side-effecting capability goes through `NearbytesAdapter`
  (`src/lib/adapter.ts`), injected via `provideAdapter` / `useAdapter`.
- App state lives in `src/lib/stores/appState.svelte.ts`; components receive
  sub-records by reference and mutate them in place (deep reactivity).
- The adapter mirrors the `nbf` CLI command surface 1:1 so sync and config
  behaviour (profiles, hubs/volumes, friends) match the CLI exactly.

## Layout
- `components/shell` — `AppShell`, `FinderShell`, `StatusBar` (full desktop layout)
- `components/sources` — profiles, hubs, friends (`ManagedList` inline editing)
- `components/list` — reusable `ManagedList` (drag reorder, add/edit/delete)
- `components/files` · `components/chat` · `components/profile`
