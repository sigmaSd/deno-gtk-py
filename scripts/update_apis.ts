import $ from "https://deno.land/x/dax@0.36.0/mod.ts";

function assert<T>(
  value: T,
  message = "Value should be defined",
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
}

async function getNewTag() {
  const tag = await $`git tag`.lines().then((lines) => lines.at(-1));
  assert(tag);
  return getNextMinorVersion(tag);
}

function getNextMinorVersion(currentVersion: string) {
  const versionArray = currentVersion.split(".").map(Number);
  versionArray[2]++;
  const nextVersion = versionArray.join(".");
  return nextVersion;
}

if (import.meta.main) {
  const newTag = await getNewTag();
  $.setPrintCommand(true);
  await $`git add .`;
  await $`git commit -m "add new apis"`;
  await $`git tag -a ${newTag} -m "add new apis"`;
  if (confirm("push to remote?")) {
    await $`git push --follow-tags"`;
  }
}
