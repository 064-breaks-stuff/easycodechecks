import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect, useRef } from "react";

import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import { site } from "./content/site.js";

import "./styles/tokens.css";
import "./styles/globals.css";

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="theme-color" content="#142523" />
        <Meta />
        <Links />
      </head>

      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const mainRef = useRef(null);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <SiteFooter />
    </>
  );
}

export function ErrorBoundary({ error }) {
  const isRouteError = isRouteErrorResponse(error);
  const title = isRouteError
    ? `${error.status} — Something went wrong`
    : "Something went wrong";

  return (
    <main className="error-page">
      <div className="container">
        <p className="eyebrow">Easy Code Checks</p>
        <h1>{title}</h1>
        <p>
          Please reload the page or contact the team if the
          problem continues.
        </p>

        <div className="button-row">
          <a className="button button--primary" href="/">
            Back to home
          </a>
          <a
            className="button button--secondary"
            href={`mailto:${site.email}`}
          >
            Contact the team
          </a>
        </div>
      </div>
    </main>
  );
}