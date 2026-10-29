import React from "react";
import { Link } from "react-router";
import Container from "../components/Container.jsx";

export function meta() {
  return [
    { title: "Page Not Found | Easy Code Checks" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function NotFoundPage() {
  return (
    <section className="error-page">
      <Container>
        <p className="eyebrow">404 / Page not found</p>
        <h1>That page is not here.</h1>
        <p className="lead">
          Use the navigation to find a service or return to the homepage.
        </p>
        <Link className="button button--primary" to="/">Back to home</Link>
      </Container>
    </section>
  );
}

export function ErrorBoundary() {
  return <NotFoundPage />;
}
