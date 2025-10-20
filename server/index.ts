import { createServer } from "./app";

const port = Number(process.env.PORT || 3002);

createServer().then((app) => {
  app.listen(port, () => {
    console.log(`SSR server running http://localhost:${port}`);
  });
});
