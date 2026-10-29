import React from "react";
import HomeHero from "../sections/home/HomeHero.jsx";
import ServicesOverview from "../sections/home/ServicesOverview.jsx";
import ProjectPreparation from "../sections/home/ProjectPreparation.jsx";
import IndustriesOverview from "../sections/home/IndustriesOverview.jsx";
import ResearchOverview from "../sections/home/ResearchOverview.jsx";
import CompanyOverview, { CredibilityStrip } from "../sections/home/CompanyOverview.jsx";
import ResourcesPreview from "../sections/home/ResourcesPreview.jsx";
import FinalCTA from "../sections/home/FinalCTA.jsx";
import styles from "../styles/home.module.css";

export { loader, meta } from "./page.jsx";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <HomeHero />
      <CredibilityStrip />
      <ServicesOverview />
      <ProjectPreparation />
      <IndustriesOverview />
      <ResearchOverview />
      <CompanyOverview />
      <ResourcesPreview />
      <FinalCTA />
    </div>
  );
}
