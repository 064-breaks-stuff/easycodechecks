const serviceIds = new Set(["code-checks", "sign-permitting", "variances-appeals"]);
const industryIds = new Set(["drive-thru", "building-signs", "banking", "subdivision"]);
const serviceBreadcrumbNames = {
  "code-checks": "Code Checks",
  "sign-permitting": "Sign Permitting",
  "variances-appeals": "Variances & Appeals",
};

export function canonicalUrl(page, site) {
  const base = site.url.replace(/\/+$/, "");
  return page.path === "/" ? base : `${base}${page.path}`;
}

export function breadcrumbItems(page, site) {
  if (page.path === "/") return [];
  const base = site.url.replace(/\/+$/, "");
  const items = [{ name: "Home", item: base }];
  if (serviceIds.has(page.id)) items.push({ name: "Services", item: `${base}/services` });
  if (industryIds.has(page.id)) items.push({ name: "Industries", item: `${base}/industries` });
  const name = page.eyebrow === "Industries & project types"
    ? page.title
    : serviceBreadcrumbNames[page.id] ?? page.eyebrow;
  items.push({ name, item: canonicalUrl(page, site) });
  return items.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item }));
}

export function structuredData(page, site) {
  const base = site.url.replace(/\/+$/, "");
  const canonical = canonicalUrl(page, site);
  const organizationId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const pageId = `${canonical}#webpage`;
  const breadcrumbs = breadcrumbItems(page, site);
  const graph = [
    {
      "@type": "Organization", "@id": organizationId,
      name: site.name, url: base,
      ...(site.email ? { email: site.email } : {}),
      ...(site.phone?.display ? { telephone: site.phone.display } : {}),
      ...(site.location ? { location: { "@type": "Place", name: site.location } } : {}),
      ...(site.linkedin ? { sameAs: [site.linkedin] } : {}),
    },
    {
      "@type": "WebSite", "@id": websiteId,
      name: site.name, url: base,
      publisher: { "@id": organizationId }, inLanguage: "en",
    },
    {
      "@type": "WebPage", "@id": pageId,
      name: page.title, url: canonical, description: page.description,
      isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId }, inLanguage: "en",
      ...(breadcrumbs.length ? { breadcrumb: { "@id": `${canonical}#breadcrumb` } } : {}),
      ...(serviceIds.has(page.id) ? { mainEntity: { "@id": `${canonical}#service` } } : {}),
    },
  ];
  if (breadcrumbs.length) graph.push({
    "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: breadcrumbs,
  });
  if (serviceIds.has(page.id)) graph.push({
    "@type": "Service", "@id": `${canonical}#service`,
    name: page.title, serviceType: page.title,
    description: page.description, url: canonical, provider: { "@id": organizationId },
  });
  return { "@context": "https://schema.org", "@graph": graph };
}

export function pageMetadata(page, site) {
  const canonical = canonicalUrl(page, site);
  return [
    { title: page.seoTitle },
    { name: "description", content: page.description },
    { name: "robots", content: "noindex, nofollow" },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:title", content: page.seoTitle },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: site.name },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: page.seoTitle },
    { name: "twitter:description", content: page.description },
    { "script:ld+json": structuredData(page, site) },
  ];
}
