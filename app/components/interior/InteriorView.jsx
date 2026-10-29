import React from "react";
import { Link, useSearchParams } from "react-router";
import Container from "../Container.jsx";
import PageHero from "./PageHero.jsx";
import RelatedPages from "./RelatedPages.jsx";
import FAQList from "./FAQList.jsx";
import Arrow from "../home/Arrow.jsx";
import { homeServices, homeIndustries, homeResources, projectInputs } from "../../content/home.js";
import { getInteriorDetail, getQuoteContext, quoteHref } from "../../content/interior.js";
import { site } from "../../content/site.js";
import styles from "../../styles/interior.module.css";

function PageCTA({ page }) {
  return <section className={styles.cta}><Container className={styles.ctaInner}><div><p className="eyebrow">Your project</p><h2>Let's make the next step clearer.</h2><p>Share the location, the signage scope, and the support you need.</p></div><Link className="button button--primary" to={quoteHref(page)}>Request a Project Quote <Arrow diagonal /></Link></Container></section>;
}

function Overview({ kind }) {
  const records = kind === "services" ? homeServices : homeIndustries;
  return <section className={styles.section}><Container><div className={styles.overviewGrid}>{records.map((item) => <Link className={styles.overviewCard} key={item.href} to={item.href}><span className="technical-label">{item.number} / {kind === "services" ? "SERVICE" : "PROJECT TYPE"}</span><h2>{item.title}</h2><p>{item.description}</p><span className={styles.cardLink}>Explore <Arrow diagonal /></span></Link>)}</div></Container></section>;
}

function DetailBody({ detail }) {
  return <section className={styles.section}><Container>
    <div className={styles.intro}><p className="eyebrow">{detail.kind === "service" ? "The service" : "The project context"}</p><h2>{detail.introTitle}</h2><p>{detail.intro}</p></div>
    <div className={styles.scopeGrid}>{detail.groups.map((group) => <article className={styles.scopeCard} key={group.title}><h3>{group.title}</h3>{group.text && <p>{group.text}</p>}<ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
  </Container></section>;
}

function AboutBody() {
  const values = [
    ["Patient", "A considered approach to project questions and municipal requirements."],
    ["Resolute", "A focus on understanding the next question that needs to be addressed."],
    ["Respectful", "Collaborative communication with project teams and municipal contacts."],
    ["Honest", "Clear conversations about the project and the support being requested."],
  ];
  return <section className={styles.section}><Container>
    <div className={styles.aboutGrid}><div><p className="eyebrow">Providing municipal services worthy of repeating.</p><h2>A signage-specific focus.</h2></div><div><p>Easy Code Checks was founded in 2019 and is based in Greenville, South Carolina.</p><p>The company supports municipal sign code research, sign permitting, and variance and appeals assistance. Its published project categories include drive-thru and fast-casual locations, building signs, banks, apartments, and subdivisions.</p><p>The work starts with understanding the signage proposal and its location—not software source code.</p></div></div>
    <div className={styles.valueGrid}>{values.map(([title, text]) => <article key={title}><h3>{title}.</h3><p>{text}</p></article>)}</div>
  </Container></section>;
}

function ResourcesBody() {
  return <section className={styles.section}><Container>
    <div className={styles.resourceNote}><p>Articles below open on the current Easy Code Checks website. Original article content has not yet been migrated into this build.</p></div>
    <div className={styles.resourceGrid}>{homeResources.map((item) => <a key={item.href} className={styles.resourceCard} href={item.href} target="_blank" rel="noopener noreferrer"><p className="eyebrow">{item.category}</p><h2>{item.title}</h2><p>{item.description}</p><span className={styles.cardLink}>Read the original article <Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span></span></a>)}</div>
  </Container></section>;
}

function ContactBody({ quote = false }) {
  const [params] = useSearchParams();
  const context = getQuoteContext(params.toString());
  const selected = [context.service?.label, context.industry?.label].filter(Boolean);
  const subject = selected.length ? `Project inquiry: ${selected.join(" / ")}` : "Project inquiry — Easy Code Checks";
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
  return <section className={styles.section}><Container className={styles.contactGrid}>
    <div className={styles.contactPanel}><p className="eyebrow">Contact the team</p><h2>{quote ? "Start the conversation directly." : "Choose the best way to reach us."}</h2>
      {quote && <div className={styles.integrationNotice}><h3>Online submission is not connected yet.</h3><p>No project details are collected or submitted through this page. Use email or telephone to contact the team directly.</p></div>}
      {quote && selected.length > 0 && <p className={styles.selection}>Selected interest: {selected.join(" · ")}</p>}
      <div className={styles.contactLinks}><a href={mailto}><span>Email</span><strong>{site.email}</strong><Arrow diagonal /></a><a href={site.phone.href}><span>Telephone</span><strong>{site.phone.display}</strong><Arrow diagonal /></a><div><span>Headquarters</span><strong>{site.location}</strong></div></div>
      <p className={styles.contactFootnote}>Email links open your configured mail application. If one is not configured, use the address shown above.</p>
    </div>
    <aside className={styles.preparation}><p className="eyebrow">Useful details to have ready</p><h2>Bring the project into focus.</h2><ol>{projectInputs.map((item) => <li key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol><p className={styles.smallNote}>The team will need to confirm project-specific scope and terms. This page does not quote fees or promise a review date.</p></aside>
  </Container></section>;
}

export default function InteriorView({ page, relatedPages = [] }) {
  const detail = getInteriorDetail(page.id);
  const isContact = page.id === "contact" || page.id === "request-a-quote";
  return <div className={styles.interior}>
    <PageHero page={page} detail={detail} />
    {detail && <><DetailBody detail={detail} /><FAQList items={detail.faqs} /></>}
    {(page.id === "services" || page.id === "industries") && <Overview kind={page.id} />}
    {page.id === "about" && <AboutBody />}
    {page.id === "blog" && <ResourcesBody />}
    {page.id === "contact" && <ContactBody />}
    {!isContact && page.id !== "services" && page.id !== "industries" && <RelatedPages pages={relatedPages} />}
    {!isContact && <PageCTA page={page} />}
  </div>;
}
