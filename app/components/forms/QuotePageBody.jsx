import React from "react";
import Container from "../Container.jsx";
import QuoteForm from "./QuoteForm.jsx";
import { projectInputs } from "../../content/home.js";
import styles from "../../styles/quote.module.css";

export default function QuotePageBody() {
  return <section className={styles.section}><Container className={styles.layout}>
    <QuoteForm />
    <aside className={styles.aside}><p className="eyebrow">Useful starting points</p><h2>Bring the project into focus.</h2><ol>{projectInputs.map((item) => <li key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol><p className={styles.asideNote}>Use the form to review your draft locally. Drafts are not saved by this website. Browser autofill and page restoration are controlled by your browser.</p></aside>
  </Container></section>;
}
