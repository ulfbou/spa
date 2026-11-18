import { createNamespacedStore } from "./modules/storage.js";
import { renderDomainExplorer } from "./modules/domain-explorer.js";

const EXPECTED_SHARED_CONTRACT = 1;
const sharedContract = globalThis.UlfbouAws?.contractVersion;

if (
  sharedContract !== undefined &&
  sharedContract !== EXPECTED_SHARED_CONTRACT
) {
  throw new Error(
    `Shared AWS asset contract mismatch: expected ${EXPECTED_SHARED_CONTRACT}, ` +
    `received ${sharedContract}.`
  );
}

const store = createNamespacedStore({
  namespace: "ulfbou.aws.ai.study-hub",
  schemaVersion: 1
});

const response = await fetch("./data/domains.json");
if (!response.ok) {
  throw new Error(`Unable to load domains: HTTP ${response.status}.`);
}

const domains = await response.json();

renderDomainExplorer({
  domains,
  grid: document.querySelector("#domain-grid"),
  selection: document.querySelector("#selection"),
  store
});
