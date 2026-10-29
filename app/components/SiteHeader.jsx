import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import Container from "./Container.jsx";
import { navigation, site } from "../content/site.js";

function NavigationGroups({ mobile = false, onNavigate }) {
  return navigation.map((item) => (
    <div className="nav-group" key={item.href}>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `nav-link${isActive ? " is-active" : ""}`
        }
        onClick={onNavigate}
      >
        {item.label}
      </NavLink>

      {mobile && item.children && (
        <div className="mobile-subnav">
          {item.children.map((child) => (
            <NavLink
              key={child.href}
              to={child.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                `mobile-subnav__link${
                  isActive ? " is-active" : ""
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  ));
}

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    if (!isOpen) {
      if (dialog.open) {
        dialog.close();
      }

      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleCancel(event) {
    event.preventDefault();
    closeMenu();
  }

  function handleDialogClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link
          className="wordmark"
          to="/"
          aria-label={`${site.name} home`}
        >
          <span className="wordmark__symbol" aria-hidden="true">
            EC
          </span>
          <span className="wordmark__text">
            Easy Code
            <br />
            Checks
          </span>
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          <NavigationGroups />
        </nav>

        <Link
          to="/request-a-quote"
          className="button button--primary header-quote"
        >
          Request a Quote
          <span aria-hidden="true">↗</span>
        </Link>

        <button
          ref={triggerRef}
          className="menu-toggle"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen(true)}
        >
          Menu
          <span aria-hidden="true">☰</span>
        </button>
      </Container>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onCancel={handleCancel}
        onClose={handleDialogClose}
      >
        <div className="mobile-menu__top">
          <p id="mobile-menu-title" className="eyebrow">
            Navigation
          </p>
          <button
            className="menu-close"
            type="button"
            onClick={closeMenu}
            autoFocus
          >
            Close
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <NavigationGroups
            mobile
            onNavigate={closeMenu}
          />

          <Link
            to="/request-a-quote"
            className="button button--primary"
            onClick={closeMenu}
          >
            Request a Quote
          </Link>
        </nav>

        <div className="mobile-menu__contact">
          <a href={site.phone.href}>{site.phone.display}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </dialog>
    </header>
  );
}