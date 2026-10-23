import { spawn } from "node:child_process";
let stopping = false;
process.on("SIGTERM", () => {
  stopping = true;
});
process.on("SIGINT", () => {
  stopping = true;
});
while (!stopping) {
  await new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ["local-data/tool-build/scripts/worker.js"],
      { stdio: "inherit" },
    );
    child.on("exit", resolve);
    child.on("error", resolve);
  });
  if (!stopping) await new Promise((resolve) => setTimeout(resolve, 30000));
}
