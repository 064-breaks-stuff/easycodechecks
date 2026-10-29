import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import SectionHeading from "../../components/home/SectionHeading.jsx";
import SignIllustration from "../../components/home/SignIllustration.jsx";
import { homeIndustries } from "../../content/home.js";
import styles from "../../styles/home.module.css";

export default function IndustriesOverview() {
  return (
    <section className={styles.section} aria-labelledby="industries-title">
      <Container>
        <SectionHeading id="industries-title" eyebrow="03 / Industries & project types" title="Different signs. Different settings. One clear focus." description="Signage requirements depend on the project. Explore support relevant to your location type and scope.">
          <Link className={styles.textLink} to="/industries">Explore project types <Arrow /></Link>
        </SectionHeading>
        <div className={styles.industryGrid}>
          {homeIndustries.map((industry) => (
            <Link className={styles.industryCard} key={industry.href} to={industry.href}>
              <div className={styles.industryVisual}><span className={styles.visualNumber}>{industry.number} / SITE TYPE</span><SignIllustration type={industry.type} /><span className={styles.visualCaption}>Concept illustration</span></div>
              <div className={styles.industryBody}><div className={styles.industryHeading}><h3>{industry.title}</h3><Arrow diagonal /></div><p>{industry.description}</p></div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
