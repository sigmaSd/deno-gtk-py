#!/usr/bin/env -S deno run --allow-read --allow-write=./README.md --allow-run=git --allow-env
// deno-lint-ignore no-import-prefix
import $ from "jsr:@david/dax@0.41.0";
import metaData from "../deno.json" with { type: "json" };

function addVersionToReadme(newTag: string) {
  let readme = Deno.readTextFileSync("./README.md");
  readme = readme.replace(/deno-gtk-py\/([^/]+)/, newTag);
  Deno.writeTextFileSync("./README.md", readme);
}

if (import.meta.main) {
  const version = metaData.version;
  if (!confirm(`Creating version: ${version}`)) {
    Deno.exit(1);
  }
  addVersionToReadme(version);

  $.setPrintCommand(true);
  await $`git add .`;
  await $`git commit -m "add new apis"`;
  await $`git tag -a ${version} -m "add new apis"`;
  if (confirm("Push to remote?")) {
    await $`git push --follow-tags`;
  }
}
