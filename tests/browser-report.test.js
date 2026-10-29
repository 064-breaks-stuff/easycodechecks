import { describe, expect, it } from "vitest";
import { summarizeBrowserReport } from "../scripts/lib/browser-report.mjs";

describe("browser report interpretation", () => {
  it("accepts passing executed tests with explicit conditional skips", () => {
    expect(summarizeBrowserReport({ stats: { expected: 5, unexpected: 0, flaky: 0, skipped: 2 } }).passed).toBe(true);
  });
  it("does not accept an empty report as verified", () => {
    expect(summarizeBrowserReport({}).passed).toBe(false);
  });
  it("rejects failures, flakes, and reporter errors", () => {
    expect(summarizeBrowserReport({ stats: { expected: 5, unexpected: 1 } }).passed).toBe(false);
    expect(summarizeBrowserReport({ stats: { expected: 5, flaky: 1 } }).passed).toBe(false);
    expect(summarizeBrowserReport({ stats: { expected: 5 }, errors: [{ message: "browser failed" }] }).passed).toBe(false);
  });
  it("retains useful failed-test details", () => {
    const report = { stats: { expected: 1, unexpected: 1 }, suites: [{ specs: [{ title: "example", tests: [{ projectName: "mobile", status: "unexpected", results: [{ error: { message: "assertion failed" } }] }] }] }] };
    expect(summarizeBrowserReport(report).failedTests[0]).toEqual({ title: "example", project: "mobile", status: "unexpected", message: "assertion failed" });
  });
});
