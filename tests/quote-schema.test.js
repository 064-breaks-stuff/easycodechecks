import { describe, expect, it } from "vitest";
import { quotePreviewSchema } from "../shared/quote-schema.js";
import { createQuoteDefaults, quoteServices, quoteIndustries, isValidTargetDate } from "../shared/quote-options.js";
import { serviceOptions, industryOptions, getQuoteContext } from "../app/content/interior.js";

const valid = {
  ...createQuoteDefaults(), contactName: "Example Person", company: "Example Sign Company",
  email: "person@example.com", service: "code-checks", country: "Example country",
  region: "Example region", city: "Example city", summary: "Research for proposed building signage.",
  previewAcknowledged: true,
};

describe("quote preview validation", () => {
  it("accepts a valid draft with optional fields empty", () => {
    expect(quotePreviewSchema.safeParse(valid).success).toBe(true);
  });
  it("does not accept an empty form", () => {
    expect(quotePreviewSchema.safeParse(createQuoteDefaults()).success).toBe(false);
  });
  it("requires the preview acknowledgment", () => {
    expect(quotePreviewSchema.safeParse({ ...valid, previewAcknowledged: false }).success).toBe(false);
  });
  it("trims input without changing the email's case", () => {
    const result = quotePreviewSchema.parse({ ...valid, company: "  Example Sign Company  ", email: "  Person@example.com  " });
    expect(result.company).toBe("Example Sign Company");
    expect(result.email).toBe("Person@example.com");
  });
  it("rejects invalid emails and unsupported services", () => {
    expect(quotePreviewSchema.safeParse({ ...valid, email: "bad-address" }).success).toBe(false);
    expect(quotePreviewSchema.safeParse({ ...valid, service: "unknown" }).success).toBe(false);
  });
  it("allows Not sure yet without inventing a new service", () => {
    expect(quotePreviewSchema.safeParse({ ...valid, service: "not-sure" }).success).toBe(true);
  });
  it("rejects zero, fractional, negative, and excessive location counts", () => {
    for (const locations of ["0", "-2", "1.5", "1000000", "many"]) {
      expect(quotePreviewSchema.safeParse({ ...valid, locations }).success).toBe(false);
    }
    expect(quotePreviewSchema.safeParse({ ...valid, locations: "12" }).success).toBe(true);
  });
  it("validates calendar dates without assuming a target timezone", () => {
    expect(isValidTargetDate("")).toBe(true);
    expect(isValidTargetDate("2024-02-29")).toBe(true);
    expect(isValidTargetDate("2026-02-31")).toBe(false);
  });
  it("retains only known URL context", () => {
    expect(createQuoteDefaults(getQuoteContext("service=code-checks&industry=banking")).industry).toBe("banking");
    expect(createQuoteDefaults({ service: { id: "unknown" } }).service).toBe("");
  });
  it("matches the established service and industry registries", () => {
    expect(quoteServices.filter((item) => item.id !== "not-sure")).toEqual(serviceOptions);
    expect(quoteIndustries).toEqual(industryOptions);
  });
  it("limits the project summary and strips unrelated properties", () => {
    expect(quotePreviewSchema.safeParse({ ...valid, summary: "x".repeat(2001) }).success).toBe(false);
    expect(quotePreviewSchema.parse({ ...valid, unexpected: "discard" })).not.toHaveProperty("unexpected");
  });
});
