---
name: project-catalog
description: Discover Maria Adriana portfolio projects and retrieve public writeups in markdown form.
---

# Project Catalog

Use this skill when an agent needs to browse portfolio work samples or summarize a specific project.

## Workflow

1. Request `/projects` with `Accept: text/markdown` to get the project index.
2. Follow a project route such as `/projects/portfolio-2024`.
3. Request the project page again with `Accept: text/markdown` to obtain the long-form project writeup.

## Related resources

- `/.well-known/api-catalog`
- `/api/openapi.json`
- `/docs/api`
