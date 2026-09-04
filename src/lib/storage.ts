import 'server-only';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { env } from './env';

export const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
export const DOC_MIME = ['application/pdf'] as const;
export const VIDEO_MIME = ['video/mp4', 'video/webm'] as const;

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const XLS_MIME = 'application/vnd.ms-excel';
export const DOC_LEGACY_MIME = 'application/msword';

/** Document types accepted for Library resources. Never executables. */
export const RESOURCE_MIME = [
  'application/pdf',
  XLSX_MIME,
  DOCX_MIME,
  XLS_MIME,
  DOC_LEGACY_MIME,
] as const;

/** Extensions are derived from the validated MIME type, never from user input. */
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  [XLSX_MIME]: 'xlsx',
  [DOCX_MIME]: 'docx',
  [XLS_MIME]: 'xls',
  [DOC_LEGACY_MIME]: 'doc',
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
export const MAX_RESOURCE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES_PER_INQUIRY = 8;

export type Scope = 'public' | 'private';

function root(scope: Scope) {
  return path.resolve(process.cwd(), env.storageDir, scope);
}

/** Human label for a document MIME type, shown on Library resource cards. */
export function documentLabel(mime: string): string {
  switch (mime) {
    case XLSX_MIME:
    case XLS_MIME:
      return 'XLSX';
    case DOCX_MIME:
    case DOC_LEGACY_MIME:
      return 'DOCX';
    case 'application/pdf':
      return 'PDF';
    default:
      return 'FILE';
  }
}

/** `1048576` → `1 MB`. */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
}

export function kindOfMime(mime: string): 'IMAGE' | 'VIDEO' | 'DOCUMENT' {
  if ((IMAGE_MIME as readonly string[]).includes(mime)) return 'IMAGE';
  if ((VIDEO_MIME as readonly string[]).includes(mime)) return 'VIDEO';
  return 'DOCUMENT';
}

/** Keeps a human-readable name for display only; it never touches the filesystem. */
export function safeDisplayName(name: string) {
  return (name.split(/[/\\]/).pop() || 'file')
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 120);
}

/**
 * Sniffs the leading bytes so a renamed executable cannot masquerade as an
 * image. Returns the detected MIME, or null when the content is not allowed.
 */
export function sniffMime(buf: Buffer): string | null {
  const b = buf;
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (b.toString('ascii', 0, 4) === '%PDF') return 'application/pdf';
  const box = b.toString('ascii', 4, 8);
  if (box === 'ftyp') {
    const brand = b.toString('ascii', 8, 12);
    if (brand.startsWith('avif') || brand.startsWith('avis')) return 'image/avif';
    return 'video/mp4';
  }
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return 'video/webm';

  // OOXML files are ZIP containers, so the signature alone cannot tell an
  // .xlsx from a .docx — or from an arbitrary archive. The part names in the
  // ZIP directory are stored uncompressed, so they identify the real format.
  if (b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07)) {
    const text = b.toString('latin1');
    if (text.includes('xl/workbook.xml') || text.includes('xl/_rels/workbook.xml.rels')) return XLSX_MIME;
    if (text.includes('word/document.xml')) return DOCX_MIME;
    return null;
  }

  // Legacy OLE compound files (.xls/.doc) are told apart by their stream names,
  // which are stored as UTF-16LE inside the directory entries.
  if (
    b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0 &&
    b[4] === 0xa1 && b[5] === 0xb1 && b[6] === 0x1a && b[7] === 0xe1
  ) {
    const text = b.toString('utf16le');
    if (text.includes('Workbook') || text.includes('Book')) return XLS_MIME;
    if (text.includes('WordDocument')) return DOC_LEGACY_MIME;
    return null;
  }

  return null;
}

export async function storeFile(
  buf: Buffer,
  mime: string,
  scope: Scope,
): Promise<{ storageKey: string; url: string }> {
  const ext = EXT_BY_MIME[mime];
  if (!ext) throw new Error('Unsupported file type');

  const now = new Date();
  const dir = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const name = `${randomBytes(16).toString('hex')}.${ext}`;
  const key = `${dir}/${name}`;

  const target = path.join(root(scope), dir);
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, name), buf);

  return { storageKey: key, url: scope === 'public' ? `/media/${key}` : `/api/admin/attachments/${key}` };
}

/** Resolves a storage key while refusing anything that escapes the scope root. */
export function resolveKey(scope: Scope, key: string) {
  const base = root(scope);
  const full = path.resolve(base, key);
  if (full !== base && !full.startsWith(base + path.sep)) throw new Error('Invalid path');
  return full;
}

export async function readStoredFile(scope: Scope, key: string) {
  return readFile(resolveKey(scope, key));
}

export async function deleteStoredFile(scope: Scope, key: string) {
  try {
    await unlink(resolveKey(scope, key));
  } catch {
    /* already gone */
  }
}

/** Reads intrinsic dimensions from PNG/JPEG/WebP headers without a native dependency. */
export function imageSize(buf: Buffer): { width: number; height: number } | null {
  try {
    if (buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const fmt = buf.toString('ascii', 12, 16);
      if (fmt === 'VP8X') return { width: (buf.readUIntLE(24, 3) & 0xffffff) + 1, height: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
      if (fmt === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (fmt === 'VP8L') {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
      return null;
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1]!;
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
  } catch {
    return null;
  }
  return null;
}
