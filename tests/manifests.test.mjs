import assert from "node:assert/strict";
import test from "node:test";
import { loadApplications } from "../scripts/lib.mjs";

test("every application manifest matches its directory", async () => {
  const applications = await loadApplications();

  assert.ok(applications.length > 0);

  for (const application of applications) {
    assert.equal(
      application.manifest.id,
      application.directoryName
    );
    assert.equal(application.manifest.schemaVersion, 1);
    assert.equal(application.manifest.entryPoint, "index.html");
  }
});
