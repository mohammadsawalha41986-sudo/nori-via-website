import { describe, it, expect } from 'vitest';
import path from 'node:path';

process.env.STORAGE_DIR = './storage';

import { sniffMime, safeDisplayName, imageSize, resolveKey, kindOfMime } from '../src/lib/storage';

/** A minimal but structurally valid PNG header declaring 1280×720. */
function makePng(width: number, height: number) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrLength = Buffer.from([0x00, 0x00, 0x00, 0x0d]);
  const ihdrType = Buffer.from('IHDR', 'ascii');
  const dims = Buffer.alloc(8);
  dims.writeUInt32BE(width, 0);
  dims.writeUInt32BE(height, 4);
  return Buffer.concat([signature, ihdrLength, ihdrType, dims]);
}

const png = makePng(1280, 720);
const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(20)]);
const pdf = Buffer.concat([Buffer.from('%PDF-1.7', 'ascii'), Buffer.alloc(20)]);
const webp = Buffer.concat([
  Buffer.from('RIFF', 'ascii'),
  Buffer.alloc(4),
  Buffer.from('WEBP', 'ascii'),
  Buffer.alloc(20),
]);

describe('sniffMime', () => {
  it('detects real image and document types from their bytes', () => {
    expect(sniffMime(png)).toBe('image/png');
    expect(sniffMime(jpeg)).toBe('image/jpeg');
    expect(sniffMime(pdf)).toBe('application/pdf');
    expect(sniffMime(webp)).toBe('image/webp');
  });

  it('rejects an executable renamed as an image', () => {
    // ELF header — a Linux binary a client might upload as "logo.png".
    const elf = Buffer.concat([Buffer.from([0x7f, 0x45, 0x4c, 0x46]), Buffer.alloc(32)]);
    expect(sniffMime(elf)).toBeNull();
  });

  it('rejects a shell script and an HTML payload', () => {
    expect(sniffMime(Buffer.from('#!/bin/sh echo pwned'.padEnd(40), 'ascii'))).toBeNull();
    expect(sniffMime(Buffer.from('<script>alert(1)</script>'.padEnd(40), 'ascii'))).toBeNull();
  });

  it('rejects content too short to identify', () => {
    expect(sniffMime(Buffer.from([0xff, 0xd8]))).toBeNull();
  });
});

describe('safeDisplayName', () => {
  it('strips directory traversal from a client filename', () => {
    expect(safeDisplayName('../../etc/passwd')).toBe('passwd');
    expect(safeDisplayName('..\\..\\windows\\system32\\cmd.exe')).toBe('cmd.exe');
  });

  it('collapses repeated dots', () => {
    expect(safeDisplayName('menu....pdf')).toBe('menu.pdf');
  });

  it('keeps Arabic filenames readable', () => {
    expect(safeDisplayName('قائمة الطعام.pdf')).toBe('قائمة الطعام.pdf');
  });

  it('caps the length', () => {
    expect(safeDisplayName('a'.repeat(500)).length).toBe(120);
  });
});

describe('resolveKey', () => {
  it('resolves a normal key inside the scope root', () => {
    const resolved = resolveKey('public', '2026/09/abc123.png');
    expect(resolved).toContain(path.join('storage', 'public', '2026', '09', 'abc123.png'));
  });

  it('refuses to escape the scope root', () => {
    expect(() => resolveKey('public', '../private/secret.pdf')).toThrow();
    expect(() => resolveKey('private', '../../../../etc/passwd')).toThrow();
  });
});

describe('imageSize', () => {
  it('reads PNG dimensions from the header', () => {
    expect(imageSize(png)).toEqual({ width: 1280, height: 720 });
  });

  it('returns null for content with no readable dimensions', () => {
    expect(imageSize(pdf)).toBeNull();
  });
});

describe('kindOfMime', () => {
  it('classifies each accepted type', () => {
    expect(kindOfMime('image/webp')).toBe('IMAGE');
    expect(kindOfMime('video/mp4')).toBe('VIDEO');
    expect(kindOfMime('application/pdf')).toBe('DOCUMENT');
  });
});
