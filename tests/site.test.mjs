import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const publicUrl = "https://kachalovg.github.io/neurosurgeon/";

const requiredFiles = [
  "index.html",
  "css/styles.css",
  "js/main.js",
  "images/favicon.png",
  "images/kirill-orlov-hero.webp",
  "images/kirill-orlov-operation.webp",
  "images/kirill-orlov-work.webp",
  "images/kirill-orlov-children.webp",
  "images/og.png",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
];

test("dist contains only the publishable site structure", async () => {
  for (const path of requiredFiles) {
    await access(join(dist, path));
  }

  const topLevel = (await readdir(dist)).sort();
  assert.deepEqual(topLevel, [
    ".nojekyll",
    "css",
    "images",
    "index.html",
    "js",
    "robots.txt",
    "site.webmanifest",
    "sitemap.xml",
  ]);
});

test("metadata points to the GitHub Pages production URL", async () => {
  const html = await readFile(join(dist, "index.html"), "utf8");
  const robots = await readFile(join(dist, "robots.txt"), "utf8");
  const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
  const manifest = JSON.parse(await readFile(join(dist, "site.webmanifest"), "utf8"));

  assert.match(html, new RegExp(`<link rel="canonical" href="${publicUrl}">`));
  assert.match(html, new RegExp(`${publicUrl}images/og\\.png`));
  assert.match(robots, new RegExp(`${publicUrl}sitemap\\.xml`));
  assert.match(sitemap, new RegExp(`<loc>${publicUrl}</loc>`));
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
});

test("private source materials and removed contact details are absent", async () => {
  const html = await readFile(join(dist, "index.html"), "utf8");
  const allFiles = await collectFiles(dist);

  assert.doesNotMatch(html, /href=["']tel:/i);
  assert.doesNotMatch(html, /\b112\b/);
  assert.doesNotMatch(html, /kirill-orlov-consultation/i);
  assert.doesNotMatch(html, /mobile-actions|Написать врачу/i);
  assert.equal(allFiles.some((path) => /\.(?:env|pdf|pptx?|zip|tar|log)$/i.test(path)), false);
});

test("mobile-specific copy is concise and secondary recognition text can be hidden", async () => {
  const html = await readFile(join(dist, "index.html"), "utf8");
  const css = await readFile(join(dist, "css", "styles.css"), "utf8");

  assert.match(html, /class="copy-mobile"/);
  assert.match(html, /class="recognition-lead"/);
  assert.match(css, /\.copy-desktop\s*\{\s*display:\s*none/);
  assert.match(css, /\.recognition-lead\s*\{\s*display:\s*none/);
  assert.match(css, /width:\s*100vw/);
});

test("verified publication links are present", async () => {
  const html = await readFile(join(dist, "index.html"), "utf8");
  for (const pubmedId of ["40323397", "25934783", "36254355", "33122218", "39401507", "28689342"]) {
    assert.match(html, new RegExp(`pubmed\\.ncbi\\.nlm\\.nih\\.gov/${pubmedId}/`));
  }
});

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  }));
  return nested.flat();
}
