import React from "react";
import { Link } from "react-router";
import Container from "../Container.jsx";
import Arrow from "../home/Arrow.jsx";
import styles from "../../styles/interior.module.css";

export default function RelatedPages({ pages, title = "Explore the next step." }) {
  if (!pages.length) return null;
  return (
    <section className={`${styles.section} ${styles.paper}`} aria-labelledby="related-title"><Container>
      <p className="eyebrow">Related services & project types</p><h2 id="related-title">{title}</h2>
      <div className={styles.relatedGrid}>{pages.map((page) => <Link className={styles.relatedCard} key={page.id} to={page.path}><p className="technical-label">{page.eyebrow}</p><h3>{page.title}</h3><p>{page.description}</p><span>Explore <Arrow /></span></Link>)}</div>
    </Container></section>
  );
}
