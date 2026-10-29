import React from "react";
import styles from "../../styles/quote.module.css";

export default function QuoteFallbackNotice({ hydrated }) {
  return (
    <p id="quote-initialization-notice" className={styles.noScript} hidden={hydrated}>
      This local preview requires JavaScript. The fields stay disabled without it. Use the email or telephone links above instead.
    </p>
  );
}
