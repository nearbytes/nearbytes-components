import {
  File, FileText, FileImage, FileSpreadsheet, FileCode, FileArchive,
  FileAudio, FileVideo, FileType
} from '@lucide/svelte';
import type { Component } from 'svelte';

type Glyph = Component<{ size?: number; class?: string }>;

/** Pick a glyph + accent tint for a file by name/mime. */
export function fileGlyph(name: string, mime?: string): { glyph: Glyph; tint: string } {
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1).toLowerCase() : '';
  const m = mime ?? '';
  if (m.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'heic'].includes(ext))
    return { glyph: FileImage, tint: 'text-purple-400' };
  if (m.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(ext))
    return { glyph: FileAudio, tint: 'text-pink-400' };
  if (m.startsWith('video/') || ['mp4', 'mov', 'mkv', 'webm'].includes(ext))
    return { glyph: FileVideo, tint: 'text-rose-400' };
  if (['xlsx', 'xls', 'csv', 'numbers'].includes(ext))
    return { glyph: FileSpreadsheet, tint: 'text-emerald-400' };
  if (['zip', 'tar', 'gz', '7z', 'rar'].includes(ext))
    return { glyph: FileArchive, tint: 'text-amber-400' };
  if (['js', 'ts', 'tsx', 'jsx', 'json', 'py', 'rs', 'go', 'sh', 'html', 'css', 'svelte'].includes(ext))
    return { glyph: FileCode, tint: 'text-sky-400' };
  if (['md', 'txt', 'rtf'].includes(ext))
    return { glyph: FileText, tint: 'text-nb-muted' };
  if (ext === 'pdf') return { glyph: FileType, tint: 'text-red-400' };
  return { glyph: File, tint: 'text-nb-muted' };
}
