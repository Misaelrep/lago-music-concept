import fs from "node:fs";
import path from "node:path";

// Lectura de assets en build (sólo servidor): existencia y dimensiones
// intrínsecas, para respetar la proporción original de flyers y logo.

export type Asset = { src: string; width: number; height: number };

function jpegSize(buf: Buffer) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    // SOF0–SOF15 (excepto DHT, JPG, DAC)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

export function readAsset(src: string): Asset | null {
  const file = path.join(process.cwd(), "public", src);
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  let size: { width: number; height: number } | null = null;
  if (buf.toString("ascii", 1, 4) === "PNG") {
    size = { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } else if (buf[0] === 0xff && buf[1] === 0xd8) {
    size = jpegSize(buf);
  } else if (buf.toString("ascii", 8, 12) === "WEBP" && buf.toString("ascii", 12, 16) === "VP8X") {
    size = { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  if (!size) return null;
  return { src, ...size };
}
