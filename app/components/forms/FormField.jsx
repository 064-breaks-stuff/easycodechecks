import React, { cloneElement } from "react";
import styles from "../../styles/quote.module.css";

export default function FormField({ name, label, required = false, hint, error, wide = false, children }) {
  const id = `quote-${name}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return (
    <div className={`${styles.field} ${wide ? styles.wideField : ""}`}>
      <label htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : <span className={styles.optional}> optional</span>}</label>
      {cloneElement(children, { id, required, "aria-required": required || undefined, "aria-invalid": Boolean(error), "aria-describedby": describedBy || undefined })}
      {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
    </div>
  );
}
