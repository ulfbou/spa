import {
  catalogPath,
  cleanDist,
  copyApplication,
  loadApplications,
  readJson,
  writeCatalog,
  writeCatalogPage
} from "./lib.mjs";

await cleanDist();

const applications = await loadApplications();
const catalog = await readJson(catalogPath);

for (const application of applications) {
  await copyApplication(application);
}

const publishedApplications = await writeCatalog(applications, catalog);
await writeCatalogPage(publishedApplications);

console.log(
  `Built ${publishedApplications.length} application(s) into dist/aws/ai/.`
);
