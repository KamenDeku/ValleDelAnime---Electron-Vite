import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const app = express();
app.use(express.json());

const routesDir = path.join(__dirname, "db", "routes");

async function registerRoutesFrom(dirPath: string, baseRoute = "") {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const routePath = baseRoute + "/" + item.name.replace(/\.ts$/, "").replace(/\\/g, "/");

    if (item.isDirectory()) {
      await registerRoutesFrom(fullPath, routePath);
    } else if (item.isFile() && item.name === "route.ts") {
      try {
        const importUrl = pathToFileURL(fullPath).href;
        const module = await import(importUrl);

        if (typeof module.default === "function") {
          console.log(`Cargando endpoint: ${routePath}`);
          app.use(routePath.replace("/[id]", "/:id"), module.default);
        }
      } catch (error) {
        console.error(`Error cargando ruta ${fullPath}:`, error);
      }
    }
  }
}

async function initializeServer() {
  try {
    await registerRoutesFrom(routesDir);

    const PORT = process.env.APP_PORT || 5000;
    app.listen(PORT, () => {
      console.log("Server listening on http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("Error at server initialization:", error);
  }
}

initializeServer();
