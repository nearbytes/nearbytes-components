import type { NearbytesAdapter, SyncStatus, VolumeView, Whoami } from '../src/lib/adapter.js';
import type { FileMetadata, DirectoryMetadata, TimelineEvent } from 'nearbytes-files';
import type { ChatTimelineItem } from 'nearbytes-chat';
import type { ProfileConfig, VolumeConfig } from 'nearbytes-skeleton';

// In-memory model so reorder/add/remove/cd behave for visual iteration.
const now = Date.now();
const SELF_KEY = '04a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344';
const f = (path: string, size: number, mimeType?: string, ageMin = 0): FileMetadata => ({
  path,
  blobHash: Math.random().toString(16).slice(2).padEnd(48, '0'),
  size,
  mimeType,
  createdAt: now - ageMin * 60_000
});
const d = (path: string): DirectoryMetadata => ({ path, createdAt: now, explicit: true });

const model = {
  profiles: [
    { name: 'alice', secret: 'alice:s' },
    { name: 'work', secret: 'work:s' }
  ] as ProfileConfig[],
  activeProfile: 'alice' as string | null,
  hubs: [
    { label: 'teamdocs', secret: 'teamdocs:s' },
    { label: 'design', secret: 'design:s' },
    { label: 'personal', secret: 'personal:s' }
  ] as VolumeConfig[],
  activeHub: 'teamdocs' as string | null,
  friends: [
    '04a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
    '04ffeeddccbbaa00998877665544332211009988776655443322110099887766554433221100aabbccddeeff00112233445566aa11'
  ],
  files: [
    f('Roadmap 2026.md', 12_400, 'text/markdown', 4),
    f('Brand/logo-primary.svg', 48_021, 'image/svg+xml', 30),
    f('Brand/palette.png', 220_133, 'image/png', 95),
    f('Brand/guidelines.pdf', 1_982_220, 'application/pdf', 140),
    f('Photos/launch-01.jpg', 3_204_881, 'image/jpeg', 220),
    f('Photos/launch-02.jpg', 2_771_004, 'image/jpeg', 221),
    f('Specs/protocol.md', 33_120, 'text/markdown', 9),
    f('budget.xlsx', 88_400, 'application/vnd.openxmlformats', 600)
  ] as FileMetadata[]
};

const statusFns: Array<(s: SyncStatus) => void> = [];
const volFns: Array<(v: VolumeView) => void> = [];
const chatFns: Array<(c: ReadonlyArray<ChatTimelineItem>) => void> = [];

function dirsFor(): DirectoryMetadata[] {
  const set = new Set<string>();
  for (const file of model.files) {
    const parts = file.path.split('/');
    let acc = '';
    for (let i = 0; i < parts.length - 1; i++) {
      acc = acc ? `${acc}/${parts[i]}` : parts[i]!;
      set.add(acc);
    }
  }
  return [...set].map(d);
}
const view = (): VolumeView => ({ files: model.files, directories: dirsFor() });
const pushVol = () => volFns.forEach((fn) => fn(view()));

let chat: ChatTimelineItem[] = [
  mkMsg('04a1b2c3', 'Pushed the new roadmap draft — take a look when you can.', 22),
  mkMsg('04ffeedd', 'Looks great. The Q3 section needs the revised metrics though.', 18),
  mkMsg('04a1b2c3', 'Good catch. Adding them now.', 12),
  mkMsg(SELF_KEY, 'Done — palette.png is in Brand/ as well.', 3)
];
function mkMsg(k: string, body: string, ageMin: number): ChatTimelineItem {
  return {
    eventHash: Math.random().toString(16).slice(2),
    publishedAt: now - ageMin * 60_000,
    message: { v: 1, k, t: now - ageMin * 60_000, body } as ChatTimelineItem['message']
  } as ChatTimelineItem;
}

export function createMockAdapter(): NearbytesAdapter {
  return {
    onStatus(fn) { statusFns.push(fn); return () => {}; },
    onActiveVolume(fn) { volFns.push(fn); return () => {}; },
    onChat(fn) { chatFns.push(fn); return () => {}; },
    status: async () => ({ text: `Synced · teamdocs · ${model.files.length} files`, connectedPeers: 3, serving: true }),
    whoami: async () => ({ peerId: '04deadbeefcafef00d', instanceKey: '04deadbeef', activeProfile: model.activeProfile, activeProfileKey: SELF_KEY } as Whoami),
    peers: async () => [{}, {}, {}],
    profile: {
      list: async () => [...model.profiles],
      add: async (name, secret) => { model.profiles.push({ name, secret }); },
      use: async (name) => { model.activeProfile = name; },
      remove: async (name) => { model.profiles = model.profiles.filter((p) => p.name !== name); },
      update: async (name, patch) => {
        const p = model.profiles.find((x) => x.name === name);
        if (p && patch.name) p.name = patch.name;
      },
      reorder: async (names) => {
        const by = new Map(model.profiles.map((p) => [p.name, p]));
        model.profiles = names.map((n) => by.get(n)!).filter(Boolean);
      },
      publish: async () => {},
      active: async () => model.activeProfile,
      publicKey: async () => '04a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344'
    },
    hub: {
      list: async () => [...model.hubs],
      add: async (label, secret) => { model.hubs.push({ label, secret }); },
      use: async (label) => { model.activeHub = label; pushVol(); },
      forget: async (label) => { model.hubs = model.hubs.filter((h) => h.label !== label); },
      update: async (label, patch) => {
        const h = model.hubs.find((x) => x.label === label);
        if (h && patch.label) h.label = patch.label;
      },
      reorder: async (labels) => {
        const by = new Map(model.hubs.map((h) => [h.label, h]));
        model.hubs = labels.map((l) => by.get(l)!).filter(Boolean);
      },
      active: async () => model.activeHub
    },
    file: {
      list: async () => view(),
      add: async (localPath, name) => {
        const base = name ?? localPath.split('/').pop() ?? 'file';
        model.files.push(f(base, 10_000, undefined, 0));
        pushVol();
      },
      addBytes: async (name, data) => {
        model.files.push(f(name, data.byteLength, undefined, 0));
        pushVol();
      },
      get: async () => {},
      remove: async (name) => { model.files = model.files.filter((x) => x.path !== name && x.path.split('/').pop() !== name); pushVol(); },
      mkdir: async (path) => { model.files.push(f(`${path}/.keep`, 0, undefined, 0)); pushVol(); },
      rename: async (from, to) => { const file = model.files.find((x) => x.path === from); if (file) file.path = to; pushVol(); },
      timeline: async (): Promise<TimelineEvent[]> => [
        { type: 'CREATE_FILE', path: model.files[0]?.path, timestamp: now - 8 * 60_000, eventHash: 'h1' },
        { type: 'UPDATE_FILE', path: model.files[0]?.path, timestamp: now - 4 * 60_000, eventHash: 'h2' }
      ] as unknown as TimelineEvent[],
      openExternally: async () => {}
    },
    chat: {
      read: async () => [...chat],
      say: async (body) => { chat = [...chat, mkMsg(SELF_KEY, body, 0)]; chatFns.forEach((fn) => fn(chat)); }
    },
    friend: {
      list: async () => [...model.friends],
      add: async (key) => { model.friends.push(key); },
      remove: async (key) => { model.friends = model.friends.filter((k) => k !== key && !k.startsWith(key)); },
      reorder: async (keys) => { model.friends = [...keys]; }
    }
  };
}

export const seed = { model, view, chat: () => chat };
