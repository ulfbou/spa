import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
  catalogPath,
  loadApplications,
  readJson
} from "./lib.mjs";

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const failures = [];
const requiredFiles = [
  "index.html",
  "app.js",
  "app.css",
  "manifest.json"
];

const applications = await loadApplications();
const catalog = await readJson(catalogPath);

if (catalog.schemaVersion !== 1) {
  failures.push("catalog/apps.json must use schemaVersion 1.");
}

const catalogIds = new Set(
  catalog.applications.map((application) => application.id)
);

for (const application of applications) {
  const { directoryName, applicationRoot, manifest } = application;

  if (!idPattern.test(directoryName)) {
    failures.push(`${directoryName}: directory must use kebab-case.`);
  }

  if (manifest.schemaVersion !== 1) {
    failures.push(`${directoryName}: manifest schemaVersion must be 1.`);
  }

  if (manifest.id !== directoryName) {
    failures.push(
      `${directoryName}: manifest id "${manifest.id}" must match directory.`
    );
  }

  if (!idPattern.test(manifest.id)) {
    failures.push(`${directoryName}: invalid manifest id.`);
  }

  if (manifest.entryPoint !== "index.html") {
    failures.push(`${directoryName}: entryPoint must be index.html.`);
  }

  if (manifest.sharedAssetContract !== 1) {
    failures.push(
      `${directoryName}: sharedAssetContract must currently be 1.`
    );
  }

  if (!catalogIds.has(manifest.id)) {
    failures.push(`${directoryName}: application is absent from catalog.`);
  }

  for (const requiredFile of requiredFiles) {
    try {
      await access(path.join(applicationRoot, requiredFile));
    } catch {
      failures.push(`${directoryName}: missing ${requiredFile}.`);
    }
  }

  const html = await readFile(
    path.join(applicationRoot, "index.html"),
    "utf8"
  );

  if (!html.includes('src="./app.js"')) {
    failures.push(`${directoryName}: index.html must load ./app.js.`);
  }

  if (!html.includes('href="./app.css"')) {
    failures.push(`${directoryName}: index.html must load ./app.css.`);
  }

  if (/[A-Za-z]:[\\/]/.test(html)) {
    failures.push(`${directoryName}: index.html contains a Windows path.`);
  }

  if (html.includes("...")) {
    failures.push(
      `${directoryName}: index.html contains an unresolved ellipsis.`
    );
  }
}

for (const catalogId of catalogIds) {
  if (!applications.some(({ manifest }) => manifest.id === catalogId)) {
    failures.push(
      `catalog/apps.json references missing application "${catalogId}".`
    );
  }
}

if (failures.length) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(`Validated ${applications.length} application(s).`);
}
