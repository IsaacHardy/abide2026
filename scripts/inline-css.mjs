#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HTML_PATH = resolve(ROOT, "index.html");
const CSS_PATH = resolve(ROOT, "dist/output.css");

const MARKER = "<!-- CSS_INLINE_MARKER -->";
const STYLE_AFTER_MARKER = new RegExp(
  `(${MARKER})[\\s\\S]*?</style>`,
);

const html = readFileSync(HTML_PATH, "utf8");
const css = readFileSync(CSS_PATH, "utf8");

if (!STYLE_AFTER_MARKER.test(html)) {
  console.error(
    `inline-css: marker "${MARKER}" followed by a <style> block not found in index.html`,
  );
  process.exit(1);
}

const replacement = `$1\n  <style>${css}</style>`;
const updated = html.replace(STYLE_AFTER_MARKER, replacement);

if (updated === html) {
  console.log("inline-css: no changes");
} else {
  writeFileSync(HTML_PATH, updated);
  console.log(`inline-css: inlined ${css.length} bytes into index.html`);
}
