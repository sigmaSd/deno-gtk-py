#!/usr/bin/env -S deno run --allow-read --allow-run=git --allow-env
import * as semver from "https://deno.land/std@0.212.0/semver/mod.ts";
import $ from "https://deno.land/x/dax@0.36.0/mod.ts";

async function getNewTag() {
  const tag = await $`git tag`.lines().then((lines) =>
    lines.reduce((pV, cV) => {
      const semCv = semver.parse(cV);
      const semPv = semver.parse(pV);
      return semver.gt(semCv, semPv) ? cV : pV;
    })
  );
  return getNextMinorVersion(tag);
}

function getNextMinorVersion(currentVersion: string) {
  const versionArray = currentVersion.split(".").map(Number);
  versionArray[2]++;
  const nextVersion = versionArray.join(".");
  return nextVersion;
}

function addVersionToReadme(newTag: string) {
  let readme = Deno.readTextFileSync("./README.md");
  readme = readme.replace(/deno-gtk-py\/([^/]+)/, newTag);
  Deno.writeTextFileSync("./README.md", readme);
}

if (import.meta.main) {
  const newTag = await getNewTag();
  addVersionToReadme(newTag);
  $.setPrintCommand(true);
  await $`git add .`;
  await $`git commit -m "add new apis"`;
  await $`git tag -a ${newTag} -m "add new apis"`;
  if (confirm("push to remote?")) {
    await $`git push --follow-tags`;
  }
}
