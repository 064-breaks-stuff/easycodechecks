import React from "react";
import { Link } from "react-router";
import styles from "../../styles/interior.module.css";

export default function Breadcrumbs({ page, kind }) {
  const parent = kind === "service" ? { label: "Services", href: "/services" }
    : kind === "industry" ? { label: "Industries", href: "/industries" } : null;
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol><li><Link to="/">Home</Link></li>{parent && <li><Link to={parent.href}>{parent.label}</Link></li>}<li aria-current="page">{page.eyebrow === "Industries & project types" ? page.title : page.id === "code-checks" ? "Code Checks" : page.id === "variances-appeals" ? "Variances & Appeals" : page.id === "sign-permitting" ? "Sign Permitting" : page.eyebrow}</li></ol>
    </nav>
  );
}
