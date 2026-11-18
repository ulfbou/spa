# AWS AI Interactive Learning SPAs

This repository owns standalone static browser applications for interactively
exploring the AWS Certified AI Practitioner curriculum.

## Publication model

Source applications live in `apps/`.

The deterministic build produces:

```text
dist/aws/ai/
```

That artifact is intended to be published into the separate host repository:

```text
ulfbou.github.io/aws/ai/
```

The host repository continues to own:

```text
/aws/index.html
/css/aws/
/js/aws/
```

## Commands

```bash
npm run validate
npm run build
npm run test
npm run check
```

No package installation is required. The tooling uses Node.js built-in modules.

## Application contract

Each application must contain:

```text
apps/<app-id>/
├── index.html
├── app.js
├── app.css
└── manifest.json
```

Application IDs use lowercase kebab-case. The build maps:

```text
apps/study-hub/
```

to:

```text
dist/aws/ai/study-hub/
```

## Shared production assets

Applications reference host-owned assets by root-relative URL:

```html
<link rel="stylesheet" href="/css/aws/base.css">
<script src="/js/aws/runtime.js" defer></script>
```

The local scaffold remains usable without those optional shared files. Production
validation records the required shared asset contract in each application
manifest.
