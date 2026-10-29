import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import HeroVisual from "../../components/home/HeroVisual.jsx";
import styles from "../../styles/home.module.css";

export default function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Container>
        <div className={styles.heroTopline}>
          <span>MUNICIPAL SIGNAGE / RESEARCH & PERMITTING</span>
          <span>CLARITY, BUILT IN.</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-hero-reveal>Less uncertainty. A clearer next step.</p>
            <h1 id="home-title" data-hero-reveal>Sign Code Research & Permitting.<span>A Clearer Path Forward.</span></h1>
            <p className={styles.heroDescription} data-hero-reveal>Navigate municipal signage requirements with project-specific research, permit coordination, and experienced support.</p>
            <div className={`button-row ${styles.heroButtons}`} data-hero-reveal>
              <Link className={`button ${styles.limeButton}`} to="/request-a-quote">Request a Project Quote <Arrow diagonal /></Link>
              <Link className={`button ${styles.outlineButton}`} to="/services">Explore Services <Arrow /></Link>
            </div>
            <p className={styles.heroFootnote} data-hero-reveal>For sign companies, project managers, and signage project teams.</p>
          </div>
          <div className={styles.heroScene} data-scene-slot="home-hero"><HeroVisual /></div>
        </div>
        <div className={styles.heroBottomline}>
          <span>01 / UNDERSTAND THE REQUIREMENTS</span>
          <a href="#home-services">Explore the approach <span aria-hidden="true">↓</span></a>
        </div>
      </Container>
    </section>
  );
}
