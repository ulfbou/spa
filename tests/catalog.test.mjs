import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogPath,
  loadApplications,
  readJson
} from "../scripts/lib.mjs";

test("catalog references every application exactly once", async () => {
  const applications = await loadApplications();
  const catalog = await readJson(catalogPath);
  const ids = catalog.applications.map((application) => application.id);

  assert.equal(new Set(ids).size, ids.length);

  for (const application of applications) {
    assert.ok(ids.includes(application.manifest.id));
  }
});
