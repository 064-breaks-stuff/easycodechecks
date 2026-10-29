import { Link } from "react-router";

import Container from "./Container.jsx";
import { navigation, site } from "../content/site.js";

export default function SiteFooter() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__grid">
          <div className="site-footer__intro">
            <Link to="/" className="footer-wordmark">
              {site.name}
            </Link>
            <p>{site.description}</p>
            <p className="site-footer__location">
              {site.location}
            </p>
          </div>

          {navigation
            .filter((group) => group.children)
            .map((group) => (
              <div key={group.href}>
                <h2 className="footer-heading">
                  {group.label}
                </h2>
                <ul className="footer-links">
                  {group.children.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <div>
            <h2 className="footer-heading">Get in touch</h2>
            <ul className="footer-links">
              <li>
                <a href={site.phone.href}>
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                  <span className="sr-only">
                    {" "}
                    (opens in a new tab)
                  </span>
                </a>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} Easy Code Checks.</p>
          <p>Municipal signage research & permitting.</p>
        </div>
      </Container>
    </footer>
  );
}