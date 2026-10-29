import { describe, expect, it } from "vitest";
import path from "node:path";
import { createNpmInvocation, resolveNpmCli } from "../scripts/lib/npm-command.mjs";

const fakeCli = path.resolve("fixture with spaces/npm-cli.js");
const options = {
  env: { NPM_CLI_PATH: fakeCli, PATH: "" },
  execPath: process.execPath,
  exists: (candidate) => candidate === fakeCli,
  realpath: () => { throw new Error("not found"); },
};

describe("shell-free npm invocation", () => {
  it("keeps paths with spaces in a single argument", () => {
    expect(createNpmInvocation("test", options)).toEqual({ command: process.execPath, args: [fakeCli, "run", "test"] });
  });
  it("rejects unexpected tasks", () => {
    expect(() => createNpmInvocation("test & unexpected", options)).toThrow("Unsupported verification task");
  });
  it("fails explicitly when npm's JavaScript CLI cannot be found", () => {
    expect(() => resolveNpmCli({ ...options, env: { PATH: "" }, exists: () => false })).toThrow("Cannot locate npm-cli.js");
  });
});
