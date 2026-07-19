#!/usr/bin/env node
/**
 * Generate mobile app icons (PNG) from the SVG source of truth.
 * Run whenever apps/mobile/assets/icon.svg changes:
 *   node scripts/generate-mobile-icons.mjs
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "apps/mobile/assets");
const SVG_WITH_BG = path.join(OUT_DIR, "icon.svg");

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

const svgSource = await readFile(SVG_WITH_BG, "utf8");
const svgNoBg = svgSource.replace(/<rect [^/]*\/>/, "");

async function render(svg, size, filename) {
  const out = path.join(OUT_DIR, filename);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log(`  wrote ${filename} (${size}x${size})`);
}

console.log(`Generating mobile icons from ${path.relative(ROOT, SVG_WITH_BG)}`);
await render(svgSource, 1024, "icon.png");
await render(svgNoBg, 1024, "adaptive-icon.png");
await render(svgSource, 48, "favicon.png");
console.log("Done.");
