import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import { site } from "../../content/site.js";
import styles from "../../styles/home.module.css";

export default function FinalCTA() {
  return (
    <section className={`${styles.section} ${styles.finalSection}`} aria-labelledby="final-cta-title">
      <Container>
        <div className={styles.finalBox}>
          <div><p className={styles.kicker}>Your next project</p><h2 id="final-cta-title">Let's make the next step clearer.</h2><p>Have a location, a sign concept, or a permitting question? Start the conversation.</p></div>
          <div className={styles.finalActions}>
            <Link className={`button ${styles.limeButton}`} to="/request-a-quote">Request a Project Quote <Arrow diagonal /></Link>
            <a className={styles.phoneLink} href={site.phone.href}>Or call {site.phone.display}</a>
            <a className={styles.emailLink} href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </Container>
    </section>
  );
}
