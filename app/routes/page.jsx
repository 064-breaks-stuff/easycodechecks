import React from "react";
import { useLoaderData } from "react-router";
import InteriorView from "../components/interior/InteriorView.jsx";

export { loader, meta } from "../lib/page-route.js";

export default function InteriorPage() {
  const { page, relatedPages } = useLoaderData();
  return <InteriorView page={page} relatedPages={relatedPages} />;
}
