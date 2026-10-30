import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import HeroVisual from "../../components/home/HeroVisual.jsx";
import styles from "../../styles/presentation.module.css";

export default function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Container className={styles.heroGrid}>
        <div>
          <p className={styles.eyebrow} data-hero-reveal>Municipal signage services</p>
          <h1 id="home-title" data-hero-reveal>Sign Code Research &amp; Permitting.</h1>
          <p className={styles.heroDescription} data-hero-reveal>Project-specific municipal research, sign permitting, and variance support for sign companies and project teams.</p>
          <div className={styles.heroActions} data-hero-reveal>
            <Link className={`button ${styles.primary}`} to="/request-a-quote">Request a Project Quote <Arrow diagonal /></Link>
            <Link className={`button ${styles.outline}`} to="/services">Explore Services <Arrow /></Link>
          </div>
        </div>
        <div className={styles.heroVisual} data-scene-slot="home-hero"><HeroVisual /></div>
      </Container>
    </section>
  );
}
