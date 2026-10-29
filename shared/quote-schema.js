import { z } from "zod";
import { quoteServices, quoteIndustries, isValidTargetDate } from "./quote-options.js";

const text = (limit) => z.string().trim().max(limit, `Use ${limit} characters or fewer.`);
const requiredText = (label, limit) => text(limit).min(1, `${label} is required.`);

export const quoteProjectSchema = z.object({
  contactName: requiredText("Your name", 100),
  company: requiredText("Company", 160),
  email: requiredText("Email", 254).email("Enter a valid email address."),
  phone: text(50),
  service: z.enum(quoteServices.map((item) => item.id), { error: "Choose a service or select Not sure yet." }),
  industry: z.union([z.literal(""), z.enum(quoteIndustries.map((item) => item.id))]),
  country: requiredText("Country", 100),
  region: requiredText("State or region", 100),
  city: requiredText("City", 100),
  projectAddress: text(300),
  locations: text(6).refine((value) => value === "" || /^[1-9]\d{0,5}$/.test(value), "Enter a positive whole number, up to six digits."),
  targetDate: text(10).refine(isValidTargetDate, "Enter a valid date."),
  summary: requiredText("Project summary", 2000),
});

// This is a preview acknowledgment, not production privacy consent.
export const quotePreviewSchema = quoteProjectSchema.extend({
  previewAcknowledged: z.literal(true, { error: "Acknowledge that this preview does not send an inquiry." }),
});
