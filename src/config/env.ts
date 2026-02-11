// @ts-nocheck

import dotenv from "dotenv";
import { fileURLToPath } from "url";

import path from "path";

if (!global.envLoaded) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

  dotenv.config({
    path: path.resolve(process.cwd(), envPath),
  });

  global.envLoaded = true;
}
