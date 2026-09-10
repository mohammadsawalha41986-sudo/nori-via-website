/**
 * Regenerates the favicon set from the NORIVA "N" brand mark.
 *
 * The mark itself is untouched — the same three paths and the same three brand
 * colours as `public/icon.svg` — but a favicon has to be square, and Google
 * ignores anything smaller than 48px, so the mark is re-framed on a 1:1 canvas
 * with even padding and rasterised at the sizes browsers and search engines
 * actually ask for. Run with `node scripts/generate-icons.mjs`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'public');

/** Brand colours, copied verbatim from the design tokens. */
const GROUND = '#0B1225';
const BAR = '#FFFFFF';
const DIAGONAL = '#F5106E';

/** The mark's own geometry, lifted unchanged from the wordmark's monogram. */
const MARK = {
  paths: [
    { d: 'M5 5h8v26H5V5Z', fill: BAR },
    { d: 'M27 5h8v26h-8V5Z', fill: BAR },
    { d: 'M5 5h8l22 26h-8L5 5Z', fill: DIAGONAL },
  ],
  x: 5,
  y: 5,
  width: 30,
  height: 26,
};

/**
 * The share of the canvas the mark occupies. The remainder is padding: a mark
 * drawn edge to edge is clipped the moment a platform rounds the corners.
 */
const MARK_RATIO = 0.66;

/** Square SVG of the mark, centred on the brand ground at any canvas size. */
function squareMarkSvg(size, { rounded = false } = {}) {
  const scale = (size * MARK_RATIO) / MARK.width;
  const drawnWidth = MARK.width * scale;
  const drawnHeight = MARK.height * scale;
  const tx = (size - drawnWidth) / 2 - MARK.x * scale;
  const ty = (size - drawnHeight) / 2 - MARK.y * scale;
  const radius = rounded ? size * 0.18 : 0;

  const paths = MARK.paths
    .map((p) => `<path d="${p.d}" fill="${p.fill}"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${GROUND}"/>
  <g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(6)})">${paths}</g>
</svg>`;
}

const png = (size, options) =>
  sharp(Buffer.from(squareMarkSvg(size, options))).png({ compressionLevel: 9 }).toBuffer();

/**
 * Packs PNG images into an ICO container.
 *
 * PNG-compressed entries are what every browser in use reads, and they keep
 * the 48px entry — the one Google requires — small enough to stay inline.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach((image, i) => {
    const at = i * 16;
    // 256 is stored as 0; every size here is smaller, but keep the rule.
    directory[at] = image.size >= 256 ? 0 : image.size;
    directory[at + 1] = image.size >= 256 ? 0 : image.size;
    directory[at + 2] = 0; // palette colours
    directory[at + 3] = 0; // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(image.data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += image.data.length;
  });

  return Buffer.concat([header, directory, ...images.map((i) => i.data)]);
}

await mkdir(OUT, { recursive: true });

// The square source of truth, kept as SVG for browsers that prefer it.
await writeFile(path.join(OUT, 'icon.svg'), `${squareMarkSvg(512)}\n`);

const files = [
  ['favicon-48x48.png', 48],
  ['favicon-96x96.png', 96],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [name, size] of files) {
  await writeFile(path.join(OUT, name), await png(size));
}

// iOS crops to a rounded square itself, so this one ships square and unrounded.
await writeFile(path.join(OUT, 'apple-touch-icon.png'), await png(180));

const ico = buildIco(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) }))),
);
await writeFile(path.join(OUT, 'favicon.ico'), ico);

console.log('✓ favicon set regenerated from the NORIVA N mark');
