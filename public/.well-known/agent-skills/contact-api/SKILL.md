---
name: contact-api
description: Submit validated portfolio contact requests to Maria Adriana through the public contact API.
---

# Contact API

Use this skill when the user wants to send a message through the portfolio contact form.

## Endpoint

- `POST /api/send`

## Request body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project inquiry",
  "message": "I would like to discuss a collaboration."
}
```

## Notes

- The API may return `429` if the same email is submitted too frequently.
- Use `/contact` or `Accept: text/markdown` on `/contact` if you need supporting human-readable context first.
