import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("tmp-rabbit");
const outDir = path.resolve("public/chatbot");

const files = fs
  .readdirSync(assetsDir)
  .filter((f) => f.endsWith(".png"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

function isCheckerPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min > 22) return false;
  if (min < 145) return false;
  return true;
}

function isCharacterPixel(r, g, b) {
  if (r < 100 && g < 100 && b < 100) return true;
  if (b > 140 && b > r + 25 && b > g) return true;
  if (g > 140 && g > r + 15) return true;
  if (r > 160 && g < 140 && b < 160 && r > g + 30) return true;
  if (r > 60 && r < 170 && g > 40 && g < 140 && b < 110 && Math.abs(r - g) < 55) {
    return true;
  }
  return false;
}

async function cutout(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);
  const visited = new Uint8Array(width * height);
  const stack = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    const idx = p * channels;
    const r = out[idx];
    const g = out[idx + 1];
    const b = out[idx + 2];
    if (isCharacterPixel(r, g, b)) return;
    if (!isCheckerPixel(r, g, b)) return;
    stack.push(x, y);
  };

  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    const p = y * width + x;
    if (visited[p]) continue;
    visited[p] = 1;

    const idx = p * channels;
    const r = out[idx];
    const g = out[idx + 1];
    const b = out[idx + 2];
    if (isCharacterPixel(r, g, b)) continue;
    if (!isCheckerPixel(r, g, b)) continue;

    out[idx + 3] = 0;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  // Soft fringe on checker anti-alias next to holes only
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * channels;
      if (out[idx + 3] === 0) continue;
      if (isCharacterPixel(out[idx], out[idx + 1], out[idx + 2])) continue;

      const r = out[idx];
      const g = out[idx + 1];
      const b = out[idx + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max - min > 28 || min < 160) continue;

      let nearHole = false;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (out[((y + dy) * width + (x + dx)) * channels + 3] === 0) {
          nearHole = true;
          break;
        }
      }
      if (nearHole) out[idx + 3] = 0;
    }
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[(y * width + x) * channels + 3] > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  await sharp(out, { raw: { width, height, channels } })
    .extract({
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    })
    .png()
    .toFile(outputPath);

  console.log("wrote", path.basename(outputPath), `${maxX - minX + 1}x${maxY - minY + 1}`);
}

fs.mkdirSync(outDir, { recursive: true });

const names = ["idle", "wink", "happy", "blink", "sleepy", "talk"];
for (let i = 0; i < files.length; i++) {
  const src = path.join(assetsDir, files[i]);
  const dest = path.join(outDir, `rabbit-${names[i] ?? String(i + 1)}.png`);
  await cutout(src, dest);
}

console.log("done");
