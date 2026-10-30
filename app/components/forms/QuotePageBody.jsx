import React from "react";
import Container from "../Container.jsx";
import QuoteForm from "./QuoteForm.jsx";
import { projectInputs } from "../../content/home.js";
import styles from "../../styles/quote.module.css";

export default function QuotePageBody() {
  return <section className={styles.section}><Container className={styles.layout}>
    <QuoteForm />
    <aside className={styles.aside}><p className="eyebrow">Useful starting points</p><h2>Bring the project into focus.</h2><ol>{projectInputs.map((item) => <li key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol><p className={styles.asideNote}>The team will confirm project-specific scope and terms.</p></aside>
  </Container></section>;
}
