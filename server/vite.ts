import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";
let viteLogger: any = console;

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    const { createServer: createViteServer, createLogger } = await import("vite");
    const viteConfig = (await import("../vite.config")).default;
    viteLogger = createLogger();
    
    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      server: {
        middlewareMode: true,
        hmr: { server }
      },
      appType: "spa",
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          log(`Vite error: ${msg}`, "vite");
          // Don't exit on Vite errors in development
        },
      }
    });

    app.use(vite.middlewares);
    
    // Handle client-side routing
    app.use("*", async (req, res, next) => {
      // Skip API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }

      const url = req.originalUrl;
      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html",
        );

        // Read and transform the HTML template
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e as Error);
        }
        log(`Error serving ${url}: ${(e as Error).message}`, "vite");
        res.status(500).end('Internal Server Error');
      }
    });

    log("Vite middleware setup complete", "vite");
  } catch (error) {
    log(`Failed to setup Vite: ${(error as Error).message}`, "vite");
    throw error;
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
