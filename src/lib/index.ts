// nearbytes-components — app-level component library built on nearbytes-widgets.
// Renderer-only. Domain types are imported (type-only) from protocol packages.

// State + boundaries
export { createAppState, selectedFile } from './stores/appState.svelte.js';
export type { AppState, AppStatus, FilesView, ChatView, TimelineView, Identity } from './stores/appState.svelte.js';
export { provideAppState, useAppState, provideAdapter, useAdapter } from './context.js';
export type {
  NearbytesAdapter, SyncStatus, VolumeView, Whoami,
  ProfileApi, HubApi, VolumeCursorApi, FileApi, ChatApi, FriendApi
} from './adapter.js';

// Shell (full workbench layout lives here — nearbytes-app only boots adapter + hydrate)
export { default as AppShell } from './components/shell/AppShell.svelte';
export { default as FinderShell } from './components/shell/FinderShell.svelte';
export { default as StatusBar } from './components/shell/StatusBar.svelte';

// Sources + managed lists
export { default as SourcesPanel } from './components/sources/SourcesPanel.svelte';
export { default as ManagedList } from './components/list/ManagedList.svelte';
export type { ListField, ListRow } from './components/list/types.js';

// Files
export { default as FileBrowser } from './components/files/FileBrowser.svelte';
export { default as FileRow } from './components/files/FileRow.svelte';
export { default as FileName } from './components/files/FileName.svelte';
export { default as FileMetadataView } from './components/files/FileMetadata.svelte';
export { default as FilePreviewPane } from './components/files/FilePreviewPane.svelte';
export { default as FileInspector } from './components/files/FileInspector.svelte';
export { default as VersionHistory } from './components/files/VersionHistory.svelte';
export { default as OpenExternally } from './components/files/OpenExternally.svelte';

// Chat
export { default as ChatPane } from './components/chat/ChatPane.svelte';
export { default as ChatMessageView } from './components/chat/ChatMessageView.svelte';
export { default as MessageAttachment } from './components/chat/MessageAttachment.svelte';

// Profile indicator (full management lives in Sources)
export { default as ProfileSelector } from './components/profile/ProfileSelector.svelte';
