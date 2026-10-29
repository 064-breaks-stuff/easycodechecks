import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import { researchConsiderations } from "../../content/home.js";
import styles from "../../styles/home.module.css";

export default function ResearchOverview() {
  return (
    <section className={`${styles.section} ${styles.researchSection}`} aria-labelledby="research-title">
      <Container className={styles.researchGrid}>
        <div className={styles.researchCopy}>
          <p className={styles.kicker}>04 / Research with context</p>
          <h2 id="research-title">The sign is only part of the picture.</h2>
          <p className={styles.sectionDescription}>A signage project sits within a location, a property, and a set of municipal requirements. Understanding that context helps frame the next questions.</p>
          <Link className={styles.textLink} to="/services/code-checks">Explore municipal code checks <Arrow /></Link>
          <div className={styles.researchNote}>Illustrative research considerations.<br />Not a sample report or a statement of contracted deliverables.</div>
        </div>
        <div className={styles.researchBoard}>
          <div className={styles.boardHeader}><span>PROJECT CONTEXT</span><span>RESEARCH NOTES</span></div>
          <ol>{researchConsiderations.map((item, index) => (
            <li key={item.title}><span className={styles.boardNumber}>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><span className={styles.boardMark} aria-hidden="true">+</span></li>
          ))}</ol>
          <div className={styles.boardFooter}>LOCATION → SCOPE → REQUIREMENTS → NEXT QUESTIONS</div>
        </div>
      </Container>
    </section>
  );
}
