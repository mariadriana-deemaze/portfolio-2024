
![Preview](preview.png)

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/portfolio-2024-livid-xi)

# 🚀 maria-adriana.com

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: [Vercel](https://vercel.com)

## Project Overview

- `app/api/*` - [API routes](https://nextjs.org/docs/api-routes/introduction) powering e-mail sending and spotify features.
- `app/**` - Static content.
- `@components/**` - Various components used throughout the site, and namespace by page.
- `@public/**` - Static assets like images and fonts.
- `@utils/**` - Collection of helpful utilities or code for external services.
- `@styles/**` - Custom styles allocation.
- `@types/**` - Allocation of shared types.
- `@data/**` - Static data.

## Running the project

Firstly, create an `.env` file with the variables listed in `.env.sample`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## 📄 License

MIT © [Maria Adriana](https://github.com/mariadriana-deemaze/portfolio-2024/blob/main/LICENSE)
