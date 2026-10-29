import React from "react";
import { useLoaderData } from "react-router";
import InteriorView from "../components/interior/InteriorView.jsx";
import { site } from "../content/site.js";
import { getPageByPath, getRelatedPages } from "../lib/content.js";

export function loader({ request }) {
  const page = getPageByPath(new URL(request.url).pathname);
  if (!page) throw new Response("Not Found", { status: 404 });
  return { page, relatedPages: getRelatedPages(page) };
}

export function meta({ data }) {
  if (!data) return [{ title: "Page Not Found | Easy Code Checks" }];
  const { page } = data;
  const canonical = page.path === "/" ? site.url : `${site.url}${page.path}`;
  return [
    { title: page.seoTitle },
    { name: "description", content: page.description },
    { name: "robots", content: "noindex, nofollow" },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:title", content: page.seoTitle },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
  ];
}

export default function InteriorPage() {
  const { page, relatedPages } = useLoaderData();
  return <InteriorView page={page} relatedPages={relatedPages} />;
}
