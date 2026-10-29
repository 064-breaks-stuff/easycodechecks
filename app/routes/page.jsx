import { Link, useLoaderData } from "react-router";

import Container from "../components/Container.jsx";
import { site } from "../content/site.js";
import {
  getPageByPath,
  getRelatedPages,
} from "../lib/content.js";

export function loader({ request }) {
  const pathname = new URL(request.url).pathname;
  const page = getPageByPath(pathname);

  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    page,
    relatedPages: getRelatedPages(page),
  };
}

export function meta({ data }) {
  if (!data) {
    return [{ title: "Page Not Found | Easy Code Checks" }];
  }

  const { page } = data;
  const canonical =
    page.path === "/" ? site.url : `${site.url}${page.path}`;

  return [
    { title: page.seoTitle },
    {
      name: "description",
      content: page.description,
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: canonical,
    },
    {
      property: "og:title",
      content: page.seoTitle,
    },
    {
      property: "og:description",
      content: page.description,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: canonical,
    },
  ];
}

export default function FoundationPage() {
  const { page, relatedPages } = useLoaderData();
  const isContactPage =
    page.id === "contact" || page.id === "request-a-quote";

  return (
    <>
      <section className="foundation-hero">
        <Container>
          <div className="foundation-notice">
            <span
              className="foundation-notice__dot"
              aria-hidden="true"
            />
            Development build · Batch 1 foundation
          </div>

          <div className="foundation-hero__grid">
            <div>
              <p className="eyebrow">{page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p className="lead">{page.description}</p>

              <div className="button-row">
                {isContactPage ? (
                  <>
                    <a
                      className="button button--primary"
                      href={`mailto:${site.email}`}
                    >
                      Email the team
                    </a>
                    <a
                      className="button button--secondary"
                      href={site.phone.href}
                    >
                      {site.phone.display}
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      className="button button--primary"
                      to="/request-a-quote"
                    >
                      Request a Project Quote
                      <span aria-hidden="true">↗</span>
                    </Link>
                    <Link
                      className="button button--secondary"
                      to="/services"
                    >
                      Explore Services
                    </Link>
                  </>
                )}
              </div>
            </div>

            <aside
              className="foundation-panel"
              aria-labelledby="foundation-panel-title"
            >
              <span className="technical-label">
                PROJECT / FOUNDATION
              </span>

              <div
                className="foundation-diagram"
                aria-hidden="true"
              >
                <div className="foundation-diagram__building" />
                <div className="foundation-diagram__sign" />
                <div className="foundation-diagram__ground" />
              </div>

              <h2 id="foundation-panel-title">
                Structure before motion.
              </h2>
              <p>
                Routing, content, layout, and build-time page
                rendering are in place. Finished page layouts
                and the interactive scene follow in the next
                batches.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      {relatedPages.length > 0 && (
        <section className="section section--paper">
          <Container>
            <div className="section-heading">
              <p className="eyebrow">Explore</p>
              <h2>Related services and project types.</h2>
            </div>

            <div className="card-grid">
              {relatedPages.map((relatedPage) => (
                <Link
                  to={relatedPage.path}
                  className="content-card"
                  key={relatedPage.id}
                >
                  <p className="technical-label">
                    {relatedPage.eyebrow}
                  </p>
                  <h3>{relatedPage.title}</h3>
                  <p>{relatedPage.description}</p>
                  <span className="content-card__link">
                    Explore
                    <span aria-hidden="true">↗</span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {isContactPage && (
        <section className="section">
          <Container>
            <div className="development-note">
              <h2>Submission service not connected yet.</h2>
              <p>
                This foundation does not collect or submit
                project details. The production quote form will
                be implemented and tested in a later batch.
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}