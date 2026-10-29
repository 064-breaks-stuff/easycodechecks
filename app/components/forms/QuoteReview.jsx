import React from "react";
import { quoteServices, quoteIndustries, quoteOptionLabel } from "../../../shared/quote-options.js";
import styles from "../../styles/quote.module.css";

export default function QuoteReview({ values, headingRef }) {
  const rows = [
    ["Name", values.contactName], ["Company", values.company], ["Email", values.email],
    ["Phone", values.phone || "Not specified"],
    ["Service", quoteOptionLabel(quoteServices, values.service)],
    ["Project type", quoteOptionLabel(quoteIndustries, values.industry)],
    ["Location", [values.city, values.region, values.country].join(", ")],
    ["Project address", values.projectAddress || "Not specified"],
    ["Locations", values.locations || "Not specified"],
    ["Target date", values.targetDate || "Not specified"],
  ];
  return (
    <section className={styles.review} aria-labelledby="quote-review-title">
      <p className={styles.localBadge}>LOCAL PREVIEW / NOT SENT</p>
      <h2 ref={headingRef} id="quote-review-title" tabIndex={-1}>Preview ready — nothing has been sent.</h2>
      <p className={styles.reviewIntro}>Validation passed in your browser. This is not an inquiry confirmation. Edit any field to update the draft and validate again.</p>
      <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <h3>Project summary</h3><p className={styles.summaryText}>{values.summary}</p>
    </section>
  );
}
