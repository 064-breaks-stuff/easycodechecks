import React from "react";
import { useLoaderData } from "react-router";
import QuotePageView from "../components/forms/QuotePageView.jsx";

export { loader, meta } from "../lib/page-route.js";

export default function QuotePage() {
  const { page } = useLoaderData();
  return <QuotePageView page={page} />;
}
