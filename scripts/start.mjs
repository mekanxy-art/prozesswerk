import "dotenv/config";
import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
const buildDir = process.env.PROZESSWERK_BUILD_DIR || ".next";
const standalone = process.env.BUILD_STANDALONE === "true";
if (
  !existsSync(
    standalone ? `${buildDir}/standalone/server.js` : `${buildDir}/BUILD_ID`,
  )
)
  throw new Error("Zuerst npm run build ausführen.");
if (standalone) {
  cpSync(`${buildDir}/static`, `${buildDir}/standalone/${buildDir}/static`, {
    recursive: true,
  });
  cpSync("public", `${buildDir}/standalone/public`, { recursive: true });
}
const child = spawn(
  process.execPath,
  standalone
    ? [`${buildDir}/standalone/server.js`]
    : [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        process.env.APP_BIND_HOST || "127.0.0.1",
        "--port",
        process.env.PORT || "3000",
      ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      HOSTNAME: process.env.APP_BIND_HOST || "127.0.0.1",
      PORT: process.env.PORT || "3000",
    },
  },
);
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
child.on("exit", (code) => process.exit(code || 0));
