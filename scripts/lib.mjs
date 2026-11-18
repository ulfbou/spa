import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile
} from "node:fs/promises";
import path from "node:path";

export const root = process.cwd();
export const appsRoot = path.join(root, "apps");
export const catalogPath = path.join(root, "catalog", "apps.json");
export const distRoot = path.join(root, "dist", "aws", "ai");

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function listApplicationDirectories() {
  const entries = await readdir(appsRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function loadApplications() {
  const directoryNames = await listApplicationDirectories();

  return Promise.all(directoryNames.map(async (directoryName) => {
    const applicationRoot = path.join(appsRoot, directoryName);
    const manifestPath = path.join(applicationRoot, "manifest.json");

    return {
      directoryName,
      applicationRoot,
      manifestPath,
      manifest: await readJson(manifestPath)
    };
  }));
}

export async function cleanDist() {
  await rm(path.join(root, "dist"), {
    recursive: true,
    force: true
  });
}

export async function copyApplication(application) {
  await cp(
    application.applicationRoot,
    path.join(distRoot, application.manifest.id),
    {
      recursive: true,
      filter(source) {
        return !source.includes(`${path.sep}.DS_Store`);
      }
    }
  );
}

export async function writeCatalog(applications, catalog) {
  const catalogById = new Map(
    catalog.applications.map((entry) => [entry.id, entry])
  );

  const publishedApplications = applications
    .map(({ manifest }) => ({
      ...manifest,
      ...catalogById.get(manifest.id),
      route: `./${manifest.id}/`
    }))
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));

  await mkdir(distRoot, { recursive: true });

  await writeFile(
    path.join(distRoot, "catalog.json"),
    `${JSON.stringify({
      schemaVersion: 1,
      applications: publishedApplications
    }, null, 2)}\n`,
    "utf8"
  );

  return publishedApplications;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function writeCatalogPage(applications) {
  const cards = applications.map((application) => `
      <article class="app-card">
        <p class="eyebrow">${escapeHtml(application.examCode)}</p>
        <h2>${escapeHtml(application.title)}</h2>
        <p>${escapeHtml(application.summary)}</p>
        <p>
          <strong>Domäner:</strong>
          ${application.domains.length
            ? application.domains.map((domain) => `D${domain}`).join(", ")
            : "Flera"}
        </p>
        <a href="${escapeHtml(application.route)}">
          Starta ${escapeHtml(application.title)}
        </a>
      </article>`).join("\n");

  const html = `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta
    name="description"
    content="Interaktiva lärmiljöer för AWS Certified AI Practitioner."
  >
  <title>AWS AI Interactive Learning</title>
  <link rel="stylesheet" href="/css/aws/base.css">
  <link rel="stylesheet" href="/css/aws/learning-app.css">
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--aws-color-background, #0d1220);
      color: var(--aws-color-text, #e8edf7);
      font: 1rem/1.6 system-ui, sans-serif;
    }
    main {
      width: min(70rem, calc(100% - 2rem));
      margin-inline: auto;
      padding-block: 2rem;
    }
    .app-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
      gap: 1rem;
    }
    .app-card {
      padding: 1.25rem;
      border: 1px solid var(--aws-color-border, #2a3550);
      border-radius: 0.75rem;
      background: var(--aws-color-surface, #161d2f);
    }
    a { color: var(--aws-color-accent, #5b9dff); }
    .eyebrow {
      color: var(--aws-color-highlight, #ffc65c);
      font-size: 0.875rem;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <main>
    <p><a href="/aws/">← AWS</a></p>
    <h1>AWS AI Interactive Learning</h1>
    <p>
      Utforska AWS AI Practitioner genom fristående interaktiva
      lärmiljöer.
    </p>
    <div class="app-grid">
${cards}
    </div>
  </main>
</body>
</html>
`;

  await writeFile(path.join(distRoot, "index.html"), html, "utf8");
}
