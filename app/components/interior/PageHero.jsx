import React from "react";
import { Link } from "react-router";
import Container from "../Container.jsx";
import Breadcrumbs from "./Breadcrumbs.jsx";
import Arrow from "../home/Arrow.jsx";
import SignIllustration from "../home/SignIllustration.jsx";
import { quoteHref } from "../../content/interior.js";
import styles from "../../styles/interior.module.css";

export default function PageHero({ page, detail }) {
  return (
    <section className={styles.hero} aria-labelledby="interior-title">
      <Container>
        <Breadcrumbs page={page} kind={detail?.kind} />
        <div className={detail ? styles.heroGrid : styles.heroSingle}>
          <div><p className="eyebrow">{page.eyebrow}</p><h1 id="interior-title">{page.title}</h1><p className="lead">{page.description}</p>
            {detail && <Link className={`button button--primary ${styles.heroButton}`} to={quoteHref(page)}>Discuss this project <Arrow diagonal /></Link>}
          </div>
          {detail && <figure className={styles.heroVisual}><div className="technical-label">SIGNAGE STUDY / {detail.kind.toUpperCase()}</div><SignIllustration type={detail.illustration} /><figcaption>Concept illustration · Not a project drawing</figcaption></figure>}
        </div>
      </Container>
    </section>
  );
}
