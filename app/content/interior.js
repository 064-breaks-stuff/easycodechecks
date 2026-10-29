import { homeServices, homeIndustries } from "./home.js";

export const serviceOptions = homeServices.map((item) => ({
  id: item.href.split("/").pop(), label: item.title,
}));
export const industryOptions = homeIndustries.map((item) => ({
  id: item.href.slice(1), label: item.title,
}));

export const interiorDetails = {
  "code-checks": {
    kind: "service", illustration: "research",
    introTitle: "Start with the requirements around your sign.",
    intro: "A location and a sign concept are the starting point for municipal code research. Easy Code Checks provides research tailored to the project's location and scope.",
    groups: [
      { title: "Project-specific research", text: "Frame the research around the proposed signage, the property, and the relevant municipality.", items: ["Project location and jurisdiction", "Proposed sign types", "Project scope and timeframe"] },
      { title: "Useful information to share", text: "Bring the details already available. The team can confirm what else is needed for the engagement.", items: ["Site address and company contact", "Sign concept or existing drawings", "Known property signage standards"] },
    ],
    faqs: [
      { question: "Is this software source-code review?", answer: "No. Easy Code Checks researches municipal requirements for physical signage projects." },
      { question: "What should I send to start the conversation?", answer: "Share the project location, proposed sign types, and the support you need. Mention any drawings or property-specific signage standards already available." },
      { question: "What does a code-check engagement include?", answer: "Ask the team to confirm the research scope, report format, fees, and timing for your specific project before proceeding." },
    ],
  },
  "sign-permitting": {
    kind: "service", illustration: "permit",
    introTitle: "Support for the municipal side of your signage project.",
    intro: "Easy Code Checks offers sign permitting support for permanent signage, promotional signs, and special events. Start with your project location and the type of signage involved.",
    groups: [
      { title: "Permanent signage", text: "Permitting support spans a range of installed sign types.", items: ["Wall, awning, and marquee signs", "Pole, pylon, ground, and monument signs", "Directional, gas-price, LED, and large-display signs"] },
      { title: "Promotional signs & events", text: "The existing service offering also includes temporary promotions and special events.", items: ["Banners and sandwich boards", "Grand openings and special offers", "One-off and recurring special events"] },
    ],
    faqs: [
      { question: "Can I ask about a temporary sign?", answer: "Yes. Promotional signage such as banners and sandwich boards is included in the company's published permitting offering. Share the intended location and promotion details." },
      { question: "Can I get help with a drive-thru or bank project?", answer: "The company has dedicated project categories for drive-thru locations and banks, including building signs and directionals. Describe the complete scope when getting in touch." },
      { question: "Are fees or approval dates guaranteed here?", answer: "No. This website does not quote a fixed fee, promise an approval, or guarantee a municipal review date. Confirm project-specific terms with the team." },
    ],
  },
  "variances-appeals": {
    kind: "service", illustration: "variance",
    introTitle: "When the proposal needs another path.",
    intro: "A proposed sign may not fit the applicable municipal requirements. Easy Code Checks offers assistance navigating signage variance and appeals processes.",
    groups: [
      { title: "Describe the proposed sign", text: "Explain what the project is trying to achieve and which requirement has become an issue.", items: ["Location and proposed signage", "The requirement or review comment in question", "Drawings and correspondence already available"] },
      { title: "Confirm the engagement", text: "The precise service scope should be agreed for the project, rather than inferred from a general website description.", items: ["Support needed for the variance or appeal", "Submission and communication responsibilities", "Any hearing or representation requirements"] },
    ],
    faqs: [
      { question: "Does assistance guarantee approval?", answer: "No. The company can assist with the process, but this website makes no promise that a municipality will approve a proposal." },
      { question: "Should I share existing review comments?", answer: "Include any relevant municipal comments or correspondence when describing the project so the team can understand the issue." },
      { question: "Is hearing attendance or representation included?", answer: "Do not assume it is included. Ask the team to confirm whether those activities are available and part of the proposed engagement." },
    ],
  },
  "drive-thru": {
    kind: "industry", illustration: "drive",
    introTitle: "A signage scope with more than one touchpoint.",
    intro: "Drive-thru and fast-casual projects can involve menu boards, canopies, directional signs, and building identification. Easy Code Checks' published project scope covers these signage categories.",
    groups: [
      { title: "Signage types", items: ["Digital menu boards and electronic message centers", "Canopy signs, directionals, and window vinyls", "Freestanding pylon, monument, and building signs"] },
      { title: "Frame the project", text: "Share the site information and describe whether the work involves a new location or changes to an existing layout.", items: ["Site address and proposed signage", "Available sign drawings or site plan", "Any canopy additions or lane changes in the scope"] },
    ],
    faqs: [
      { question: "Can I include multiple sign types in an inquiry?", answer: "Yes. Describe the menu boards, directionals, canopy signs, and other signage involved so the intended scope is clear." },
      { question: "Does this page promise engineering services?", answer: "No. Canopy or lane-related work should be described in the inquiry, but engineering, stamped drawings, and other professional services must be separately confirmed." },
    ],
  },
  "building-signs": {
    kind: "industry", illustration: "building",
    introTitle: "Signage that belongs to the building—and its context.",
    intro: "Easy Code Checks provides code research and permitting support for a range of building signs, from facade identification to projecting signs and marquees.",
    groups: [
      { title: "Building-sign categories", items: ["Facade signs and murals", "Projecting, directional, and under-canopy signs", "Roof signs, marquees, and religious insignias"] },
      { title: "Useful starting information", items: ["Building address and sign location", "Proposed sign type and available drawings", "Any known property signage requirements"] },
    ],
    faqs: [
      { question: "Is the service limited to wall signs?", answer: "No. The published building-sign scope includes murals, projecting signs, roof signs, marquees, directionals, and other listed categories." },
      { question: "Can I ask for research before permitting?", answer: "Municipal code research and sign permitting are separate published services. Describe which support you need, or ask the team to help identify the appropriate engagement." },
    ],
  },
  banking: {
    kind: "industry", illustration: "bank",
    introTitle: "A closer look at bank and ATM project details.",
    intro: "The company's banking project scope includes drive-up and pedestrian ATMs, standard building signs, and directionals, with attention to additional site details depending on the engagement.",
    groups: [
      { title: "Signage & identification", items: ["Drive-up and pedestrian ATMs", "Building signs", "Directional signage"] },
      { title: "Describe the wider scope", text: "The existing banking page references additional research details. Confirm which are relevant to your project.", items: ["Bollard counts and covers", "Lane-lighting details", "Available site plans and bank-specific requirements"] },
    ],
    faqs: [
      { question: "Can the inquiry include an ATM project?", answer: "Yes. The published banking scope specifically includes drive-up and pedestrian ATMs." },
      { question: "Are all site-related checks automatically included?", answer: "No. Describe any bollard, cover, lighting, or other site details and ask the team to confirm the research scope for the engagement." },
    ],
  },
  subdivision: {
    kind: "industry", illustration: "community",
    introTitle: "Clear identification across a residential community.",
    intro: "Easy Code Checks' residential project scope covers apartment complexes, subdivision entrances, on-site directionals, and building-identification signage.",
    groups: [
      { title: "Community signage", items: ["Apartment and subdivision entrance signs", "On-site directional signs", "Building-identification signs"] },
      { title: "Share the site context", items: ["Community address and project location", "Proposed sign types and placement", "Available plans and known signage standards"] },
    ],
    faqs: [
      { question: "Does the scope cover both apartments and subdivisions?", answer: "Yes. Both are included in the company's published residential project category." },
      { question: "Can I ask about directional and building-ID signs?", answer: "Yes. Those sign types are specifically included alongside entrance signage." },
    ],
  },
};

export function getInteriorDetail(id) {
  return interiorDetails[id] ?? null;
}

export function quoteHref(page) {
  const detail = getInteriorDetail(page.id);
  if (!detail) return "/request-a-quote";
  const key = detail.kind === "service" ? "service" : "industry";
  return `/request-a-quote?${key}=${encodeURIComponent(page.id)}`;
}

export function getQuoteContext(search) {
  const params = new URLSearchParams(search);
  return {
    service: serviceOptions.find((item) => item.id === params.get("service")) ?? null,
    industry: industryOptions.find((item) => item.id === params.get("industry")) ?? null,
  };
}
