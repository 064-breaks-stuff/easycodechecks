export function summarizeBrowserReport(report) {
  const stats = report?.stats ?? {};
  const counts = {
    passed: Number(stats.expected ?? 0),
    failed: Number(stats.unexpected ?? 0),
    flaky: Number(stats.flaky ?? 0),
    skipped: Number(stats.skipped ?? 0),
  };
  const errors = (report?.errors ?? []).map((error) => String(error.message ?? error).slice(0, 1200));
  const failedTests = [];
  const projects = new Set();
  function visit(suite) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        if (test.projectName) projects.add(test.projectName);
        if (!["unexpected", "flaky"].includes(test.status)) continue;
        const results = test.results ?? [];
        failedTests.push({
          title: spec.title,
          project: test.projectName,
          status: test.status,
          message: String(results.at(-1)?.error?.message ?? "See local HTML report").slice(0, 1200),
        });
      }
    }
    (suite.suites ?? []).forEach(visit);
  }
  (report?.suites ?? []).forEach(visit);
  const validCounts = Object.values(counts).every((count) => Number.isFinite(count) && count >= 0);
  return {
    passed: validCounts && counts.passed > 0 && counts.failed === 0 && counts.flaky === 0 && errors.length === 0,
    counts,
    projects: [...projects],
    durationMs: Number(stats.duration ?? 0),
    errors,
    failedTests: failedTests.slice(0, 30),
  };
}
