// Serves the emoji picker's data from our own origin: Frimousse otherwise fetches it from
// jsDelivr, which would see every reader's IP address. The version follows the lockfile.
import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const source = join(
  dirname(createRequire(import.meta.url).resolve("emojibase-data/package.json")),
  "en",
);
const target = join(process.cwd(), "public", "emojibase-data", "en");

await mkdir(target, { recursive: true });

for (const file of ["data.json", "messages.json"]) {
  await copyFile(join(source, file), join(target, file));
}
