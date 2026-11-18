# Contributing

## Scope

This repository contains static AWS AI Practitioner learning applications,
their structured learning content, and deterministic validation/build tooling.

Do not add:

- server-side runtime dependencies;
- secrets or credentials;
- generated `dist/` content to source commits;
- host-site files owned by `ulfbou.github.io`;
- copied forms of `/css/aws/` or `/js/aws/`.

## Add an application

1. Copy `templates/static-spa/` to `apps/<app-id>/`.
2. Use a lowercase kebab-case application ID.
3. Update `manifest.json`.
4. Add the application to `catalog/apps.json`.
5. Run `npm run check`.

## Learning design

Prefer interactive exploration, comparisons, simulations, and concept
relationships. Assessment may be one learning mode, but it must not become the
default product model or reveal answers before learner interaction.
