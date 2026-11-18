import assert from "node:assert/strict";
import test from "node:test";
import {
  readFile
} from "node:fs/promises";

test("study-hub storage uses an application namespace", async () => {
  const appSource = await readFile(
    "apps/study-hub/app.js",
    "utf8"
  );

  assert.match(
    appSource,
    /ulfbou\.aws\.ai\.study-hub/
  );
});
