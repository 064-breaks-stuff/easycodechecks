import React from "react";
import Container from "../../components/Container.jsx";
import SectionHeading from "../../components/home/SectionHeading.jsx";
import { projectInputs } from "../../content/home.js";
import styles from "../../styles/home.module.css";

export default function ProjectPreparation() {
  return (
    <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="preparation-title">
      <Container>
        <SectionHeading id="preparation-title" eyebrow="02 / Start with the essentials" title="A clearer project starts with the right information." description="A few useful details help frame the conversation. You do not need every answer before getting in touch." />
        <ol className={styles.steps}>
          {projectInputs.map((step) => (
            <li key={step.number}><span className={styles.stepNumber}>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
