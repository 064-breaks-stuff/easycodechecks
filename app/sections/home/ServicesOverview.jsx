import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import SectionHeading from "../../components/home/SectionHeading.jsx";
import SignIllustration from "../../components/home/SignIllustration.jsx";
import { homeServices } from "../../content/home.js";
import styles from "../../styles/home.module.css";

export default function ServicesOverview() {
  return (
    <section id="home-services" className={styles.section} aria-labelledby="services-title">
      <Container>
        <SectionHeading id="services-title" eyebrow="01 / What we handle" title="The right support for the next step." description="Start with the question your project needs to answer. We help navigate the municipal side of signage.">
          <Link className={styles.textLink} to="/services">All services <Arrow /></Link>
        </SectionHeading>
        <div className={styles.serviceGrid}>
          {homeServices.map((service) => (
            <Link className={styles.serviceCard} key={service.href} to={service.href}>
              <div className={styles.cardTop}><span>{service.number}</span><Arrow diagonal /></div>
              <SignIllustration type={service.type} className={styles.serviceDrawing} />
              <h3>{service.title}</h3><p>{service.description}</p>
              <div className={styles.cardFoot}>{service.detail}<Arrow /></div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
