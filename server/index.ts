import express from "express";
import path from "node:path";
import fs from "node:fs";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import type { ViteDevServer } from "vite";
import type { HelmetServerState } from "react-helmet-async";

const isProd = process.env.NODE_ENV === "production";

export async function createServer() {
  const app = express();

  let vite: ViteDevServer | undefined;
  let template: string;
  let manifest: Record<string, { file: string }> | null = null;

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
  } else {
    app.use(
      "/assets",
      express.static(path.resolve(process.cwd(), "dist/client"), {
        immutable: true,
        maxAge: "1y"
      })
    );
    template = fs.readFileSync(path.resolve(process.cwd(), "dist/client/index.html"), "utf-8");
    manifest = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "dist/client/manifest.json"), "utf-8")
    );
  }

  app.get("/robots.txt", (_req, res) => {
    res
      .type("text/plain")
      .send("User-agent: *\nAllow: /\nSitemap: https://yoursite.com/sitemap.xml");
  });

  // ⬇️ Express 5: use a param with * modifier (or a regex) instead of bare "*"
  app.get("/:path*", async (req, res, next) => {
    try {
      let html = template;

      if (!isProd && vite) {
        html = await vite.transformIndexHtml(req.originalUrl, template);
      }

      type CreateApp = (
        url: string,
        helmetContext: { helmet?: HelmetServerState }
      ) => React.ReactNode;

      let createApp: CreateApp;
      if (!isProd && vite) {
        const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
        createApp = mod.createApp;
      } else {
        const mod = await import(path.resolve(process.cwd(), "dist/ssr/entry-server.js"));
        createApp = mod.createApp;
      }

      const helmetContext: { helmet?: HelmetServerState } = {};
      const element = createApp(req.url, helmetContext);

      let didError = false;

      const stream = renderToPipeableStream(element, {
        bootstrapScripts: isProd ? [manifest!["src/main.tsx"].file] : ["/src/main.tsx"],
        onShellReady() {
          res.statusCode = didError ? 500 : 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");

          const helmet = helmetContext.helmet;
          const withHead = html.replace(
            "<head>",
            `<head>${helmet?.title?.toString?.() ?? ""}${helmet?.meta?.toString?.() ?? ""}${
              helmet?.link?.toString?.() ?? ""
            }`
          );

          const before = withHead.replace(
            '<div id="root"><!-- SSR output goes here --></div>',
            '<div id="root">'
          );

          res.write(before);
          stream.pipe(res);
        },
        onAllReady() {
          res.write("</div>");
          res.end();
        },
        onError(err) {
          didError = true;
          console.error(err);
        }
      });

      res.on("close", () => {
        try {
          stream.abort?.();
        } catch {
          /* noop */
        }
      });
    } catch (e) {
      if (!isProd && e && vite) vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return app;
}
