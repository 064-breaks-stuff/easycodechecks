import React from "react";
import PageHero from "../interior/PageHero.jsx";
import QuotePageBody from "./QuotePageBody.jsx";
import styles from "../../styles/interior.module.css";

export default function QuotePageView({ page }) {
  return (
    <div className={styles.interior}>
      <PageHero page={page} detail={null} />
      <QuotePageBody />
    </div>
  );
}
