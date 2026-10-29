import React from "react";
import Container from "../Container.jsx";
import styles from "../../styles/interior.module.css";

export default function FAQList({ items }) {
  if (!items?.length) return null;
  return (
    <section className={styles.section} aria-labelledby="faq-title"><Container className={styles.faqGrid}>
      <div><p className="eyebrow">Useful questions</p><h2 id="faq-title">Before the next step.</h2></div>
      <div>{items.map((item) => <details key={item.question} className={styles.faq}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
    </Container></section>
  );
}
