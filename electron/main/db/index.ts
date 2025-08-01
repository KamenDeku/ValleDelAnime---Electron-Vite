import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const routesDir = path.join(__dirname, "db", "routes");

function registerRoutesFrom(dirPath: string, baseRoute = "") {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const routePath = baseRoute + "/" + item.name.replace(/\.ts$/, "");

    if (item.isDirectory()) {
      registerRoutesFrom(fullPath, routePath);
    } else if (item.isFile() && item.name === "route.ts") {
      const importPath = path.resolve(fullPath);
      import(importPath).then((module) => {
        if (typeof module.default === "function") {
          console.log(`Cargando endpoint: ${routePath}`);
          app.use(routePath.replace("/[id]", "/:id"), module.default);
        }
      });
    }
  }
}

registerRoutesFrom(routesDir);

const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
