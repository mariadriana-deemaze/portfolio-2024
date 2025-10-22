import { createServer } from "./index.js";
createServer().then((app) => {
  const port = Number(process.env.PORT ?? 5173);
  app.listen(port, () => console.log(`✅ SSR server http://localhost:${port}`));
});
