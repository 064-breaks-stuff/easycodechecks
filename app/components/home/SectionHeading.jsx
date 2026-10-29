import React from "react";
import styles from "../../styles/home.module.css";

export default function SectionHeading({ id, eyebrow, title, description, children }) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <p className={styles.kicker}>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </div>
      {children && <div className={styles.headingAction}>{children}</div>}
    </div>
  );
}
