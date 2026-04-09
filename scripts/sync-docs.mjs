/**
 * Copies Next.js static export (`out/`) into `docs/` for GitHub Pages
 * "Deploy from a branch" → Branch: main → Folder: /docs
 *
 * `.nojekyll` disables Jekyll so `_next/` is served correctly.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "out");
const docsDir = join(root, "docs");

if (!existsSync(outDir)) {
  console.error("out/ not found. Run: npm run build (with GITHUB_PAGES=true)");
  process.exit(1);
}

rmSync(docsDir, { recursive: true, force: true });
mkdirSync(docsDir, { recursive: true });
cpSync(outDir, docsDir, { recursive: true });
writeFileSync(join(docsDir, ".nojekyll"), "");
console.log("Synced out/ → docs/ (added .nojekyll)");
