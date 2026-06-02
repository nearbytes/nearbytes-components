/** Typed Svelte context keys for injecting the app state + adapter downward. */
import { getContext, setContext } from 'svelte';
import type { AppState } from './stores/appState.svelte.js';
import type { NearbytesAdapter } from './adapter.js';

const STATE = Symbol('nb.appState');
const ADAPTER = Symbol('nb.adapter');

export function provideAppState(state: AppState): void { setContext(STATE, state); }
export function useAppState(): AppState { return getContext<AppState>(STATE); }

export function provideAdapter(adapter: NearbytesAdapter): void { setContext(ADAPTER, adapter); }
export function useAdapter(): NearbytesAdapter { return getContext<NearbytesAdapter>(ADAPTER); }
