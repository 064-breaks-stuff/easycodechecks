import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import styles from "../../styles/home.module.css";

export function CredibilityStrip() {
  return (
    <section className={styles.credibility} aria-label="Company at a glance">
      <Container className={styles.credibilityGrid}>
        <div><span className={styles.credibilityValue}>Since 2019</span><span>Focused on municipal signage</span></div>
        <div><span className={styles.credibilityValue}>Greenville, SC</span><span>Company headquarters</span></div>
        <div><span className={styles.credibilityValue}>Research to permitting</span><span>Support for the municipal side</span></div>
      </Container>
    </section>
  );
}

export default function CompanyOverview() {
  return (
    <section className={styles.section} aria-labelledby="company-title">
      <Container className={styles.companyGrid}>
        <div><p className={styles.kicker}>05 / Easy Code Checks</p><h2 id="company-title">A collaborative approach to the municipal side of signage.</h2></div>
        <div className={styles.companyCopy}>
          <p className={styles.companyLead}>Patient. Resolute. Respectful. Honest.</p>
          <p>Easy Code Checks brings a signage-specific focus to municipal research, permitting, and variance support.</p>
          <p>From building identification to drive-thru signage, the starting point is the same: understanding the project and the requirements around it.</p>
          <Link className={styles.textLink} to="/about">About Easy Code Checks <Arrow /></Link>
        </div>
      </Container>
    </section>
  );
}
