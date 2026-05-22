#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CSS_PATH = resolve(ROOT, "dist/output.css");
const INLINE_SCRIPT = resolve(ROOT, "scripts/inline-css.mjs");

function runInline() {
  const proc = spawn("node", [INLINE_SCRIPT], { stdio: "inherit" });
  proc.on("error", (err) => console.error("inline-css spawn failed:", err));
}

const tailwind = spawn(
  "npx",
  [
    "@tailwindcss/cli",
    "-i",
    "src/input.css",
    "-o",
    "dist/output.css",
    "--watch",
  ],
  { cwd: ROOT, stdio: "inherit" },
);

tailwind.on("exit", (code) => process.exit(code ?? 0));

const shutdown = () => {
  tailwind.kill("SIGTERM");
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function startWatcher() {
  if (!existsSync(CSS_PATH)) {
    setTimeout(startWatcher, 250);
    return;
  }
  runInline();
  let pending;
  watch(CSS_PATH, () => {
    clearTimeout(pending);
    pending = setTimeout(runInline, 100);
  });
}

startWatcher();
