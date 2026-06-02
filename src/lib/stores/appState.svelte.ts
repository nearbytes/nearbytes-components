/**
 * App state — a single Svelte 5 deep-reactive `$state` tree owned by the app.
 * Sub-records are passed BY REFERENCE into components; mutations made by the
 * adapter sync layer (via setters here) propagate through deep reactivity.
 *
 * This is VIEW/UI state only. All domain records are protocol types.
 */
import type { FileMetadata, DirectoryMetadata } from 'nearbytes-files';
import type { ChatTimelineItem } from 'nearbytes-chat';
import type { ProfileConfig, VolumeConfig } from 'nearbytes-skeleton';
import type { StatusKind } from 'nearbytes-widgets';

export type WorkPanel = 'files' | 'settings';

export interface FilesView {
  items: FileMetadata[];
  directories: DirectoryMetadata[];
  cwd: string;
  selectedPath: string | null;
}

export interface ChatView {
  items: ChatTimelineItem[];
  draft: string;
}

export interface AppStatus {
  text: string;
  kind: StatusKind;
}

export interface AppState {
  status: AppStatus;
  profiles: ProfileConfig[];
  activeProfile: string | null;
  hubs: VolumeConfig[];
  activeHub: string | null;
  friends: string[];
  files: FilesView;
  chat: ChatView;
  panel: WorkPanel;
}

export function createAppState(): AppState {
  // `$state` must initialize a declaration (not a bare return expression).
  const state = $state<AppState>({
    status: { text: 'Starting NearBytes…', kind: 'syncing' },
    profiles: [],
    activeProfile: null,
    hubs: [],
    activeHub: null,
    friends: [],
    files: { items: [], directories: [], cwd: '', selectedPath: null },
    chat: { items: [], draft: '' },
    panel: 'files'
  });
  return state;
}

/** Currently-selected file (derived helper; pure, no side effects). */
export function selectedFile(files: FilesView): FileMetadata | null {
  if (files.selectedPath === null) return null;
  return files.items.find((f) => f.path === files.selectedPath) ?? null;
}
