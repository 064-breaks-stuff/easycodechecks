import path from "node:path";
import { existsSync, realpathSync } from "node:fs";

export function resolveNpmCli({
  env = process.env,
  execPath = process.execPath,
  exists = existsSync,
  realpath = realpathSync,
} = {}) {
  const directories = (env.PATH ?? env.Path ?? "").split(path.delimiter).filter(Boolean);
  const candidates = [
    env.NPM_CLI_PATH,
    env.npm_execpath,
    path.join(path.dirname(execPath), "node_modules", "npm", "bin", "npm-cli.js"),
    env.APPDATA ? path.join(env.APPDATA, "npm", "node_modules", "npm", "bin", "npm-cli.js") : null,
  ];

  for (const directory of directories) {
    candidates.push(path.join(directory, "node_modules", "npm", "bin", "npm-cli.js"));
    candidates.push(path.resolve(directory, "../lib/node_modules/npm/bin/npm-cli.js"));
    try {
      const resolved = realpath(path.join(directory, "npm"));
      if (resolved.endsWith("npm-cli.js")) candidates.push(resolved);
    } catch {
      // Other PATH entries may contain npm; keep searching.
    }
  }

  const cli = candidates.find((candidate) =>
    candidate && path.basename(candidate) === "npm-cli.js" && exists(candidate),
  );
  if (!cli) {
    throw new Error("Cannot locate npm-cli.js. Set NPM_CLI_PATH to the full path of your npm/bin/npm-cli.js and rerun verification.");
  }
  return cli;
}

export function createNpmInvocation(task, options = {}) {
  if (!["test", "build"].includes(task)) throw new Error(`Unsupported verification task: ${task}`);
  return {
    command: options.execPath ?? process.execPath,
    args: [resolveNpmCli(options), "run", task],
  };
}
