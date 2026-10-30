import React from "react";
import { Link } from "react-router";
import Container from "../../components/Container.jsx";
import Arrow from "../../components/home/Arrow.jsx";
import SignIllustration from "../../components/home/SignIllustration.jsx";
import { homeServices, homeIndustries, homeResources } from "../../content/home.js";
import styles from "../../styles/presentation.module.css";

export function ServiceRows() {
  return (
    <section id="home-services" className={styles.section} aria-labelledby="services-title">
      <Container>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Our services</p><h2 id="services-title">Support for the municipal side of your signage project.</h2></div><Link className={styles.textLink} to="/services">All services <Arrow /></Link></div>
        <div className={styles.services}>{homeServices.map((service) => (
          <Link className={styles.serviceRow} key={service.href} to={service.href}>
            <span className={styles.number}>{service.number}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <Arrow diagonal />
          </Link>
        ))}</div>
      </Container>
    </section>
  );
}

export function IndustryDirectory() {
  return (
    <section className={`${styles.section} ${styles.paper}`} aria-labelledby="industries-title">
      <Container>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Industries &amp; project types</p><h2 id="industries-title">Find the support relevant to your project.</h2></div><Link className={styles.textLink} to="/industries">Explore project types <Arrow /></Link></div>
        <div className={styles.directory}>{homeIndustries.map((industry) => (
          <Link className={styles.industryItem} key={industry.href} to={industry.href}>
            <div className={styles.industryArt}><SignIllustration type={industry.type} /></div>
            <div><h3>{industry.title}</h3><p>{industry.description}</p></div>
            <Arrow diagonal />
          </Link>
        ))}</div>
        <p className={styles.artNote}>Illustrations are conceptual.</p>
      </Container>
    </section>
  );
}

export function CompanyResources() {
  return (
    <section className={styles.section} aria-labelledby="approach-title">
      <Container className={styles.companyResources}>
        <div className={styles.companyIntro}><p className={styles.eyebrow}>Easy Code Checks</p><h2 id="approach-title">A signage-specific approach.</h2><p>Municipal code research, permitting, and variance support with a collaborative focus.</p><p className={styles.values}>Patient. Resolute. Respectful. Honest.</p><Link className={styles.textLink} to="/about">About Easy Code Checks <Arrow /></Link></div>
        <div className={styles.resources}><h3>From the resource library</h3>{homeResources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer"><span>{resource.category}</span><h4>{resource.title}</h4><Arrow diagonal /><span className="sr-only"> Opens on the existing Easy Code Checks website in a new tab.</span></a>)}<Link className={styles.textLink} to="/blog">Resources overview <Arrow /></Link></div>
      </Container>
    </section>
  );
}
