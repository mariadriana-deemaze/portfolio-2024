---
name: portfolio-navigation
description: Navigate the Maria Adriana portfolio, fetch markdown versions of public pages, and locate primary sections for projects, blog posts, and contact details.
---

# Portfolio Navigation

Use this skill when an agent needs a quick machine-readable understanding of the public portfolio site.

## Routes

- `/` for the profile overview and featured content
- `/projects` for the portfolio index
- `/blog` for published writing
- `/contact` for contact details

## Preferred access pattern

1. Request public pages with `Accept: text/markdown` when a concise machine-readable response is sufficient.
2. Use `/.well-known/api-catalog` and `/api/openapi.json` to discover structured API capabilities.
3. Use the contact endpoint only when the user explicitly wants to send a message.
