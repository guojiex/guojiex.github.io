# AGENTS.md

This repository is a Hexo blog.

The source of truth is the content under `source/`, especially `source/_posts/`.
Do not edit generated files in `public/` unless the task is specifically about build output inspection.

## Repository Shape

- `source/_posts/<category>/`
  - Published blog posts grouped by topic.
- `source/_drafts/`
  - Draft posts not yet published.
- `source/images/`, `source/media/`, `source/lib/`
  - Static assets referenced by posts.
- `public/`
  - Generated site output from Hexo.

## Writing Rules

- The front matter `title` is the page H1.
- In post bodies, start major sections at `##`, not `#`.
- Use `###` only for true subsections under a `##` section.
- Keep front matter concise and consistent:
  - `title`
  - `date`
  - `description`
  - `categories`
  - `tags`
- Prefer updating an existing post over creating a near-duplicate.
- Preserve the existing voice of the blog unless the user asks for a rewrite.

## Hexo Workflow

- Start local preview:
  - `npm run server`
- Generate static output:
  - `npm run build`
- Clean generated cache/output:
  - `npm run clean`
- Deploy with configured Hexo deployer:
  - `npm run deploy`

## Implementation Notes

- This repo uses local Hexo dependencies. Prefer `npm run ...` or `npx hexo ...` over a global `hexo` binary.
- Markdown rendering depends on `hexo-renderer-marked`; if posts stop appearing after `hexo clean`, check renderer dependencies first.
- When validating a content change, prefer inspecting the generated file in `public/<permalink>/index.html` after a build.

## Safety

- Do not delete or bulk-rewrite old posts unless explicitly requested.
- Avoid changing permalink-related config unless the user asks, since it affects published URLs.
- Treat `db.json` and `public/` as generated artifacts; regenerate them rather than manually patching output.
