#!/usr/bin/env node
/**
 * Brand marks for this site: the flower used in the header and the footer, rendered to
 * favicon.svg plus the three PNG icons. Run AFTER scripts/assets.mjs, which writes the
 * OG image and would otherwise overwrite these files with its own generic mark.
 *   node scripts/assets.mjs && node scripts/brand.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets/img");

const FOREST = "#1e3a2c";
const GOLD = "#c9a227";
const PETAL = "#f4c95d";

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="${FOREST}"/>
  <g fill="${GOLD}">
    <ellipse cx="32" cy="21.5" rx="5.6" ry="8.4"/>
    <ellipse cx="32" cy="42.5" rx="5.6" ry="8.4"/>
    <ellipse cx="21.5" cy="32" rx="8.4" ry="5.6"/>
    <ellipse cx="42.5" cy="32" rx="8.4" ry="5.6"/>
  </g>
  <circle cx="32" cy="32" r="5.4" fill="${PETAL}"/>
  <circle cx="32" cy="32" r="2.4" fill="${FOREST}"/>
</svg>`;

writeFileSync(join(OUT, "favicon.svg"), mark + "\n");
console.log("✓ favicon.svg");

const uri = "data:image/svg+xml;base64," + Buffer.from(mark).toString("base64");
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();

for (const size of [180, 192, 512]) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(
    `<!DOCTYPE html><html><head><style>html,body{margin:0;background:transparent}` +
    `img{display:block;width:${size}px;height:${size}px}</style></head><body><img src="${uri}"></body></html>`,
    { waitUntil: "load" }
  );
  const name = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
  await page.screenshot({ path: join(OUT, name), omitBackground: true });
  console.log("✓", name);
}

await browser.close();
