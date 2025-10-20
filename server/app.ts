import express from "express";
import path from "node:path";
import fs from "node:fs";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import type { ViteDevServer } from "vite";
import App from "../src/App";

const isProd = process.env.NODE_ENV === "production";

export async function createServer() {
  const app = express();

  let vite: ViteDevServer | undefined;
  let template: string;
  let manifest: Record<string, { file: string }> | null = null;

  if (!isProd) {
    // DEV: use Vite middleware & the raw index.html
    const viteCreateServer = (await import("vite")).createServer;
    vite = await viteCreateServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
  } else {
    // PROD: serve built assets and load manifest
    app.use("/assets", express.static(path.resolve(process.cwd(), "dist/client"), { immutable: true, maxAge: "1y" }));
    template = fs.readFileSync(path.resolve(process.cwd(), "dist/client/index.html"), "utf-8");
    manifest = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "dist/client/manifest.json"), "utf-8"));
  }

  app.get("/robots.txt", (_req, res) => {
    void _req;
    res.type("text/plain").send("User-agent: *\nAllow: /\nSitemap: https://yoursite.com/sitemap.xml");
  });

  app.get("*", async (req, res, next) => {
    try {
      let html = template;

      if (!isProd && vite) {
        html = await vite.transformIndexHtml(req.originalUrl, template);
      }

      type HelmetDataLike = {
        title: { toString(): string };
        meta: { toString(): string };
        link: { toString(): string };
      };
      type HelmetContext = { helmet?: HelmetDataLike };

      const helmetContext: HelmetContext = {};

      const element = React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(
          StaticRouter,
          { location: req.url },
          React.createElement(App, null)
        )
      );

      const stream = renderToPipeableStream(
        element,
        {
          bootstrapScripts: isProd
            ? [manifest!["src/main.tsx"].file]
            : ["/src/main.tsx"],
          onShellReady() {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            // inject head from helmet
            const helmet = (helmetContext.helmet as HelmetDataLike);
            const withHead = html.replace(
              "<head>",
              `<head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
            );
            // stream body
            const before = withHead.replace(
              '<div id="root">'
            );
            res.write(before);
            stream.pipe(res);
            res.write("</div>"); // close #root (React will close tags)
          },
          onError(err) {
            console.error(err);
          }
        }
      );
    } catch (e) {
      if (!isProd && (e as any) && vite) vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return app;
}
