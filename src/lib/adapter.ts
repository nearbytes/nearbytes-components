/**
 * NearbytesAdapter — the single explicit boundary between renderer UI and any
 * non-renderer capability (filesystem, crypto, sync, WebDAV). It mirrors the
 * nearbytes-cli command surface 1:1 so the app has CLI feature parity and the
 * exact same sync semantics: the implementation in nearbytes-app drives the
 * same nearbytes-skeleton / nearbytes-files / nearbytes-chat packages the CLI
 * uses (createFilesystemSkeletonFromConfig + createFileService + reactive
 * volumes + skeleton.sync). The renderer NEVER touches Node/Electron directly.
 *
 * All domain types are imported (type-only, erased at runtime) from the
 * protocol packages — none are redefined here.
 */
import type {
  FileMetadata,
  DirectoryMetadata,
  TimelineEvent,
} from 'nearbytes-files';
import type { ChatTimelineItem } from 'nearbytes-chat';
import type { ProfileConfig, VolumeConfig } from 'nearbytes-skeleton';

export interface Whoami {
  readonly peerId: string;
  readonly instanceKey: string;
  readonly activeProfile: string | null;
  readonly activeProfileKey: string;
}

export interface SyncStatus {
  /** Central textual status shown on startup (mirrors CLI banner lines). */
  readonly text: string;
  readonly connectedPeers: number;
  readonly serving: boolean;
}

export interface VolumeView {
  readonly files: ReadonlyArray<FileMetadata>;
  readonly directories: ReadonlyArray<DirectoryMetadata>;
}

/** Snapshot push from the adapter into the renderer store (sync-driven). */
export interface AdapterEvents {
  onStatus(fn: (s: SyncStatus) => void): () => void;
  onActiveVolume(fn: (view: VolumeView) => void): () => void;
  onChat(fn: (items: ReadonlyArray<ChatTimelineItem>) => void): () => void;
}

export interface ProfileApi {
  list(): Promise<ProfileConfig[]>;
  add(name: string, secret: string): Promise<void>;
  use(name: string): Promise<void>;
  remove(name: string): Promise<void>;
  update(name: string, patch: { readonly name?: string; readonly secret?: string }): Promise<void>;
  reorder(names: readonly string[]): Promise<void>;
  publish(displayName: string, bio?: string, asProfile?: string): Promise<void>;
  active(): Promise<string | null>;
  /** Active profile public key hex (share with friends). */
  publicKey(name?: string): Promise<string>;
}

export interface HubApi {
  /** Hub == volume in the CLI; register/forget the channel secret. */
  list(): Promise<VolumeConfig[]>;
  add(label: string, secret: string): Promise<void>;
  use(label: string): Promise<void>;
  forget(label: string): Promise<void>;
  update(label: string, patch: { readonly label?: string; readonly secret?: string }): Promise<void>;
  reorder(labels: readonly string[]): Promise<void>;
  active(): Promise<string | null>;
}

export interface FileApi {
  list(): Promise<VolumeView>;
  add(localPath: string, name?: string): Promise<void>;
  /**
   * Add a file from raw bytes read in the renderer (drag-drop / file picker).
   * Portable: avoids the removed Electron `File.path`. `name` is the full
   * destination path inside the active hub.
   */
  addBytes(name: string, data: Uint8Array): Promise<void>;
  get(name: string, outputPath: string): Promise<void>;
  remove(name: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  rename(fromPath: string, toPath: string): Promise<void>;
  timeline(): Promise<TimelineEvent[]>;
  /** Materialize the file to a temp path and hand it to the OS default app. */
  openExternally(name: string): Promise<void>;
}

export interface ChatApi {
  read(limit?: number): Promise<ChatTimelineItem[]>;
  say(body: string): Promise<void>;
}

export interface FriendApi {
  list(): Promise<string[]>;
  add(publicKeyHex: string): Promise<void>;
  remove(publicKeyOrPrefix: string): Promise<void>;
  reorder(keys: readonly string[]): Promise<void>;
}

export interface NearbytesAdapter extends AdapterEvents {
  readonly profile: ProfileApi;
  readonly hub: HubApi;
  readonly file: FileApi;
  readonly chat: ChatApi;
  readonly friend: FriendApi;
  status(): Promise<SyncStatus>;
  whoami(): Promise<Whoami>;
  peers(): Promise<ReadonlyArray<unknown>>;
}
