/**
 * Pure path helpers for the Finder-like browser. Paths are `/`-separated,
 * no leading slash; the empty string `''` is the volume root.
 */
import type { FileMetadata, DirectoryMetadata } from 'nearbytes-files';

export function basename(path: string): string {
  const i = path.lastIndexOf('/');
  return i === -1 ? path : path.slice(i + 1);
}

export function parentOf(path: string): string {
  const i = path.lastIndexOf('/');
  return i === -1 ? '' : path.slice(0, i);
}

export function joinPath(dir: string, name: string): string {
  return dir === '' ? name : `${dir}/${name}`;
}

/** Breadcrumb segments for `cwd`, each with its absolute path. */
export function crumbs(cwd: string): Array<{ name: string; path: string }> {
  if (cwd === '') return [];
  const parts = cwd.split('/');
  const out: Array<{ name: string; path: string }> = [];
  let acc = '';
  for (const p of parts) {
    acc = acc === '' ? p : `${acc}/${p}`;
    out.push({ name: p, path: acc });
  }
  return out;
}

export interface DirEntry {
  readonly kind: 'dir';
  readonly name: string;
  readonly path: string;
  readonly childCount: number;
}
export interface FileEntry {
  readonly kind: 'file';
  readonly name: string;
  readonly path: string;
  readonly file: FileMetadata;
}
export type Entry = DirEntry | FileEntry;

/** Immediate children (folders first, then files) of `cwd`. */
export function entriesAt(
  cwd: string,
  files: ReadonlyArray<FileMetadata>,
  directories: ReadonlyArray<DirectoryMetadata>
): Entry[] {
  const prefix = cwd === '' ? '' : `${cwd}/`;
  const dirChildren = new Map<string, number>();
  const bump = (name: string) => dirChildren.set(name, (dirChildren.get(name) ?? 0) + 1);
  const ensure = (name: string) => { if (!dirChildren.has(name)) dirChildren.set(name, 0); };

  // Explicit directories declared directly under cwd (may be empty).
  for (const d of directories) {
    if (parentOf(d.path) === cwd && basename(d.path) !== '') ensure(basename(d.path));
  }

  const fileEntries: FileEntry[] = [];
  for (const f of files) {
    if (cwd !== '' && !f.path.startsWith(prefix)) continue;
    const rest = f.path.slice(prefix.length); // path relative to cwd
    const slash = rest.indexOf('/');
    if (slash === -1) {
      if (rest === '.keep' || rest === '') continue; // placeholder
      fileEntries.push({ kind: 'file', name: rest, path: f.path, file: f });
    } else {
      bump(rest.slice(0, slash)); // descendant lives under an intermediate folder
    }
  }

  const dirNames = dirChildren;

  const dirEntries: DirEntry[] = [...dirNames.entries()].map(([name, childCount]) => ({
    kind: 'dir',
    name,
    path: joinPath(cwd, name),
    childCount
  }));

  dirEntries.sort((a, b) => a.name.localeCompare(b.name));
  fileEntries.sort((a, b) => a.name.localeCompare(b.name));
  return [...dirEntries, ...fileEntries];
}

export function fmtSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(1)} GB`;
}

export function fmtWhen(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
