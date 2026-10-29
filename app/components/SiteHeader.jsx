import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import Container from "./Container.jsx";
import { navigation, site } from "../content/site.js";
import { navigationMatches } from "../lib/navigation.js";
import styles from "../styles/navigation.module.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const closeReason = useRef("dismiss");
  const focusFrame = useRef(null);
  const location = useLocation();

  function closeDropdowns(except = null) {
    headerRef.current?.querySelectorAll("details[open]").forEach((element) => {
      if (element !== except) element.open = false;
    });
  }

  function closeMobile(reason = "dismiss") {
    closeReason.current = reason;
    setOpen(false);
  }

  useEffect(() => {
    closeDropdowns();
    if (dialogRef.current?.open) closeMobile("navigate");
  }, [location.pathname, location.search]);

  useEffect(() => {
    const outside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) closeDropdowns();
    };
    const breakpoint = window.matchMedia("(min-width: 981px)");
    const resize = () => {
      if (breakpoint.matches && dialogRef.current?.open) closeMobile("resize");
      if (!breakpoint.matches) closeDropdowns();
    };
    document.addEventListener("pointerdown", outside);
    breakpoint.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      breakpoint.removeEventListener("change", resize);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!open) {
      if (dialog.open) dialog.close();
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function handleDialogClose() {
    setOpen(false);
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    const reason = closeReason.current;
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      if (reason === "navigate" || reason === "resize") {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      } else {
        triggerRef.current?.focus({ preventScroll: true });
      }
    });
  }

  function handleEscape(event) {
    if (event.key !== "Escape") return;
    const disclosure = event.target.closest("details[open]");
    if (disclosure) {
      event.preventDefault();
      disclosure.open = false;
      disclosure.querySelector("summary")?.focus();
    }
  }

  return (
    <header ref={headerRef} className={styles.header} onKeyDown={handleEscape}>
      <Container className={styles.inner}>
        <Link className="wordmark" to="/" aria-label={`${site.name} home`}>
          <span className="wordmark__symbol" aria-hidden="true">EC</span>
          <span className="wordmark__text">Easy Code<br />Checks</span>
        </Link>
        <nav className={styles.desktop} aria-label="Primary navigation">
          {navigation.map((item) => item.children ? (
            <details className={styles.disclosure} key={item.href} onToggle={(event) => {
              if (event.currentTarget.open) closeDropdowns(event.currentTarget);
            }}>
              <summary className={navigationMatches(location.pathname, item) ? styles.active : undefined}>{item.label}<span className={styles.chevron} aria-hidden="true">⌄</span></summary>
              <div className={styles.dropdown}>
                <NavLink end to={item.href} className={styles.overviewLink}>{item.label} overview <span aria-hidden="true">↗</span></NavLink>
                {item.children.map((child) => <NavLink key={child.href} end to={child.href} className={({ isActive }) => `${styles.dropdownLink} ${isActive ? styles.active : ""}`}>{child.label}</NavLink>)}
              </div>
            </details>
          ) : <NavLink key={item.href} end to={item.href} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>{item.label}</NavLink>)}
        </nav>
        <Link className={`button button--primary ${styles.desktopQuote}`} to="/request-a-quote">Request a Quote <span aria-hidden="true">↗</span></Link>
        <button ref={triggerRef} className={styles.menuTrigger} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => {
          closeReason.current = "dismiss";
          setOpen(true);
        }}>Menu <span aria-hidden="true">☰</span></button>
      </Container>
      <dialog ref={dialogRef} id="mobile-navigation" className={styles.dialog} aria-labelledby="mobile-menu-title" onClose={handleDialogClose} onCancel={(event) => {
        event.preventDefault(); closeMobile();
      }} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMobile();
      }}>
        <div className={styles.dialogTop}><p id="mobile-menu-title" className="eyebrow">Navigation</p><button type="button" autoFocus className={styles.closeButton} onClick={() => closeMobile()}>Close <span aria-hidden="true">×</span></button></div>
        <nav className={styles.mobile} aria-label="Mobile navigation">
          {navigation.map((item) => <div key={item.href}><NavLink end to={item.href} onClick={() => closeMobile("navigate")} className={({ isActive }) => `${styles.mobileMain} ${isActive || navigationMatches(location.pathname, item) ? styles.active : ""}`}>{item.label}</NavLink>{item.children && <ul className={styles.mobileChildren}>{item.children.map((child) => <li key={child.href}><NavLink end to={child.href} onClick={() => closeMobile("navigate")} className={({ isActive }) => isActive ? styles.active : undefined}>{child.label}</NavLink></li>)}</ul>}</div>)}
          <Link className="button button--primary" to="/request-a-quote" onClick={() => closeMobile("navigate")}>Request a Quote</Link>
        </nav>
        <div className={styles.mobileContact}><a href={site.phone.href}>{site.phone.display}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
      </dialog>
    </header>
  );
}
