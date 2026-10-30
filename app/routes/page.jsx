import React from "react";
import { useLoaderData } from "react-router";
import InteriorView from "../components/interior/InteriorView.jsx";
import styles from "../styles/presentation.module.css";

export { loader, meta } from "../lib/page-route.js";

export default function InteriorPage() {
  const { page, relatedPages } = useLoaderData();
  return <div className={styles.interiorPage}><InteriorView page={page} relatedPages={relatedPages} /></div>;
}
