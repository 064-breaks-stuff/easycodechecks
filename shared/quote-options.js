export const quoteServices = [
  { id: "code-checks", label: "Municipal Code Checks" },
  { id: "sign-permitting", label: "Sign Permitting" },
  { id: "variances-appeals", label: "Variances & Appeals" },
  { id: "not-sure", label: "Not sure yet" },
];

export const quoteIndustries = [
  { id: "drive-thru", label: "Drive-Thru & Fast-Casual" },
  { id: "building-signs", label: "Building Signs" },
  { id: "banking", label: "Banks & Financial Institutions" },
  { id: "subdivision", label: "Apartments & Subdivisions" },
];

export function createQuoteDefaults(context = {}) {
  return {
    contactName: "", company: "", email: "", phone: "",
    service: quoteServices.some((item) => item.id === context.service?.id) ? context.service.id : "",
    industry: quoteIndustries.some((item) => item.id === context.industry?.id) ? context.industry.id : "",
    country: "", region: "", city: "", projectAddress: "",
    locations: "", targetDate: "", summary: "", previewAcknowledged: false,
  };
}

export function quoteOptionLabel(options, id) {
  return options.find((item) => item.id === id)?.label ?? "Not specified";
}

export function isValidTargetDate(value) {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
