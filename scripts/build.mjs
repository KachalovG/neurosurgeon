import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "src");
const output = join(root, "dist");

if (dirname(output) !== root) {
  throw new Error("Refusing to clean an output directory outside the project root.");
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

await Promise.all([
  cp(join(source, "html", "index.html"), join(output, "index.html")),
  cp(join(source, "css"), join(output, "css"), { recursive: true }),
  cp(join(source, "js"), join(output, "js"), { recursive: true }),
  cp(join(source, "images"), join(output, "images"), { recursive: true }),
  cp(join(source, "public"), output, { recursive: true }),
]);

await writeFile(join(output, ".nojekyll"), "", "utf8");

console.log("Built publish-ready site in dist/");
