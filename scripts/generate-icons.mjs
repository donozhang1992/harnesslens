import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const outputs = [
  ["extensions/browser/icons/icon16.png", 16],
  ["extensions/browser/icons/icon32.png", 32],
  ["extensions/browser/icons/icon48.png", 48],
  ["extensions/browser/icons/icon128.png", 128],
  ["extensions/vscode/media/icon.png", 128],
];

for (const [path, size] of outputs) {
  const absolutePath = resolve(path);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, createIcon(size));
}

console.log(`Generated ${outputs.length} HarnessLens icon files.`);

function createIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const radius = size * 0.2;
  const scale = size / 128;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const background = roundedRectCoverage(x, y, size, size, radius);

      if (background <= 0) {
        setPixel(pixels, index, 0, 0, 0, 0);
        continue;
      }

      const top = [15, 23, 42];
      const bottom = [30, 64, 175];
      const mix = y / Math.max(1, size - 1);
      const base = blend(top, bottom, mix);
      let color = base;

      if (insideCircle(x, y, 58 * scale, 52 * scale, 31 * scale)) {
        color = [236, 253, 245];
      }

      if (insideRing(x, y, 58 * scale, 52 * scale, 31 * scale, 23 * scale)) {
        color = [45, 212, 191];
      }

      if (insideRotatedRect(x, y, 86 * scale, 82 * scale, 12 * scale, 39 * scale, -45)) {
        color = [45, 212, 191];
      }

      const bars = [
        [44, 43, 22],
        [52, 53, 31],
        [60, 63, 40],
      ];

      for (const [barX, barY, barWidth] of bars) {
        if (
          insideRoundedRect(
            x,
            y,
            barX * scale,
            barY * scale,
            barWidth * scale,
            5 * scale,
            2.5 * scale,
          )
        ) {
          color = [15, 23, 42];
        }
      }

      setPixel(pixels, index, color[0], color[1], color[2], Math.round(255 * background));
    }
  }

  return encodePng(size, size, pixels);
}

function roundedRectCoverage(x, y, width, height, radius) {
  const px = Math.min(x, width - 1 - x);
  const py = Math.min(y, height - 1 - y);

  if (px >= radius || py >= radius) {
    return 1;
  }

  const dx = radius - px - 0.5;
  const dy = radius - py - 0.5;
  return dx * dx + dy * dy <= radius * radius ? 1 : 0;
}

function insideRoundedRect(x, y, left, top, width, height, radius) {
  if (x < left || x > left + width || y < top || y > top + height) {
    return false;
  }

  const cx = Math.max(left + radius, Math.min(x, left + width - radius));
  const cy = Math.max(top + radius, Math.min(y, top + height - radius));
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function insideCircle(x, y, cx, cy, radius) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function insideRing(x, y, cx, cy, outer, inner) {
  const distance = (x - cx) ** 2 + (y - cy) ** 2;
  return distance <= outer ** 2 && distance >= inner ** 2;
}

function insideRotatedRect(x, y, cx, cy, width, height, degrees) {
  const radians = (degrees * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  const localX = dx * Math.cos(radians) - dy * Math.sin(radians);
  const localY = dx * Math.sin(radians) + dy * Math.cos(radians);
  return Math.abs(localX) <= width / 2 && Math.abs(localY) <= height / 2;
}

function blend(from, to, amount) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
}

function setPixel(pixels, index, red, green, blue, alpha) {
  pixels[index] = red;
  pixels[index + 1] = green;
  pixels[index + 2] = blue;
  pixels[index + 3] = alpha;
}

function encodePng(width, height, pixels) {
  const scanlines = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const scanlineOffset = y * (width * 4 + 1);
    scanlines[scanlineOffset] = 0;
    pixels.copy(scanlines, scanlineOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", createHeader(width, height)),
    chunk("IDAT", deflateSync(scanlines)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function createHeader(width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;
  return header;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
