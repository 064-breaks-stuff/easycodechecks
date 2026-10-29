import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import SectionHeading from "../../components/home/SectionHeading.jsx";
import { homeResources } from "../../content/home.js";
import styles from "../../styles/home.module.css";

export default function ResourcesPreview() {
  return (
    <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="resources-title">
      <Container>
        <SectionHeading id="resources-title" eyebrow="06 / Practical insight" title="Understand the questions behind the process." description="Explore articles from the existing Easy Code Checks resource library.">
          <Link className={styles.textLink} to="/blog">Resources overview <Arrow /></Link>
        </SectionHeading>
        <div className={styles.resourceGrid}>
          {homeResources.map((resource) => (
            <a className={styles.resourceCard} key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer">
              <p className={styles.kicker}>{resource.category}</p><h3>{resource.title}</h3><p className={styles.resourceDescription}>{resource.description}</p>
              <span className={styles.resourceLink}>Read on the current site <Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span></span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
