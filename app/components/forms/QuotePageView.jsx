import React from "react";
import Container from "../Container.jsx";
import Breadcrumbs from "../interior/Breadcrumbs.jsx";
import QuotePageBody from "./QuotePageBody.jsx";
import styles from "../../styles/presentation.module.css";

export default function QuotePageView({ page }) {
  return (
    <div className={styles.quotePage}>
      <section className={styles.quoteHeader} aria-labelledby="quote-title">
        <Container><Breadcrumbs page={page} /><p className={styles.eyebrow}>Project inquiry</p><h1 id="quote-title">{page.title}</h1><p>Describe your location, signage, and required support, then review the details locally.</p></Container>
      </section>
      <QuotePageBody />
    </div>
  );
}
