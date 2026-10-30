import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quotePreviewSchema } from "../../../shared/quote-schema.js";
import { quoteServices, quoteIndustries, createQuoteDefaults } from "../../../shared/quote-options.js";
import { getQuoteContext } from "../../content/interior.js";
import { quoteUi, quoteFieldLabels } from "../../content/quote.js";
import { site } from "../../content/site.js";
import FormField from "./FormField.jsx";
import QuoteReview from "./QuoteReview.jsx";
import QuoteFallbackNotice from "./QuoteFallbackNotice.jsx";
import styles from "../../styles/quote.module.css";

export default function QuoteForm() {
  const [params] = useSearchParams();
  const context = getQuoteContext(params.toString());
  const contextService = context.service?.id ?? "";
  const contextIndustry = context.industry?.id ?? "";
  const [hydrated, setHydrated] = useState(false);
  const [preview, setPreview] = useState(null);
  const [invalidAttempt, setInvalidAttempt] = useState(0);
  const summaryRef = useRef(null);
  const pendingErrorFocus = useRef(false);
  const reviewHeadingRef = useRef(null);
  const { register, handleSubmit, reset, setFocus, setValue, getFieldState, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(quotePreviewSchema),
    defaultValues: createQuoteDefaults(context),
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => {
    if (!getFieldState("service").isDirty) setValue("service", contextService);
    if (!getFieldState("industry").isDirty) setValue("industry", contextIndustry);
    setPreview(null);
  }, [contextService, contextIndustry, getFieldState, setValue]);
  useEffect(() => {
    if (pendingErrorFocus.current && summaryRef.current) {
      summaryRef.current.focus();
      pendingErrorFocus.current = false;
    }
  }, [invalidAttempt, errors]);
  useEffect(() => {
    if (preview) reviewHeadingRef.current?.focus();
  }, [preview]);

  const field = (name, label, input, options = {}) => (
    <FormField name={name} label={label} error={errors[name]?.message} {...options}>{input}</FormField>
  );

  function clearForm() {
    reset(createQuoteDefaults(context));
    setPreview(null);
    setInvalidAttempt(0);
    pendingErrorFocus.current = false;
    setFocus("contactName");
  }

  const validate = handleSubmit(
    (values) => { pendingErrorFocus.current = false; setInvalidAttempt(0); setPreview(values); },
    () => { pendingErrorFocus.current = true; setPreview(null); setInvalidAttempt((value) => value + 1); },
  );

  return (
    <div className={styles.quoteRoot} data-quote-panel>
      <div className={styles.notice} id="quote-preview-notice"><p className={styles.localBadge}>PREVIEW ONLY</p><h2>{quoteUi.noticeTitle}</h2><p>{quoteUi.noticeText}</p><p>To contact the team directly, email <a href={`mailto:${quoteUi.notificationRecipient}`}>{quoteUi.notificationRecipient}</a> or call <a href={site.phone.href}>{site.phone.display}</a>.</p></div>
      <QuoteFallbackNotice hydrated={hydrated} />
      <form noValidate data-ui-only="true" aria-label="Project inquiry preview" aria-describedby="quote-preview-notice" onSubmit={(event) => {
        event.preventDefault();
        if (hydrated) void validate(event);
      }} onChangeCapture={() => { if (preview) setPreview(null); }}>
        <p className={styles.requiredNote}>Fields marked * are required for this local preview.</p>
        {invalidAttempt > 0 && Object.keys(errors).length > 0 && <div ref={summaryRef} tabIndex={-1} className={styles.errorSummary} role="alert"><h2>Check the highlighted fields.</h2><ul>{Object.entries(errors).map(([name, error]) => <li key={name}><a href={`#quote-${name}`} onClick={(event) => { event.preventDefault(); setFocus(name); }}>{quoteFieldLabels[name] ?? name}: {error.message}</a></li>)}</ul></div>}
        <fieldset id="quote-ui-fields" disabled={!hydrated || isSubmitting} className={styles.formFields}>
          <legend className="sr-only">Local project inquiry fields</legend>
          <fieldset className={styles.group}><legend><span>01</span> Your details</legend><div className={styles.grid}>
            {field("contactName", "Your name", <input {...register("contactName")} autoComplete="name" maxLength={100} />, { required: true })}
            {field("company", "Company", <input {...register("company")} autoComplete="organization" maxLength={160} />, { required: true })}
            {field("email", "Work email", <input {...register("email")} type="email" autoComplete="email" maxLength={254} />, { required: true })}
            {field("phone", "Phone", <input {...register("phone")} type="tel" autoComplete="tel" maxLength={50} />)}
          </div></fieldset>
          <fieldset className={styles.group}><legend><span>02</span> Your project</legend><div className={styles.grid}>
            {field("service", "Service needed", <select {...register("service")}><option value="">Choose a service</option>{quoteServices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>, { required: true })}
            {field("industry", "Project type", <select {...register("industry")}><option value="">Choose if applicable</option>{quoteIndustries.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>)}
            {field("country", "Country", <input {...register("country")} autoComplete="country-name" maxLength={100} />, { required: true, hint: "Project location only; service availability must be confirmed." })}
            {field("region", "State or region", <input {...register("region")} autoComplete="address-level1" maxLength={100} />, { required: true })}
            {field("city", "City", <input {...register("city")} autoComplete="address-level2" maxLength={100} />, { required: true })}
            {field("projectAddress", "Project address", <input {...register("projectAddress")} autoComplete="street-address" maxLength={300} />)}
            {field("locations", "Number of locations", <input {...register("locations")} type="text" inputMode="numeric" maxLength={6} />, { hint: "A positive whole number, if known." })}
            {field("targetDate", "Target date", <input {...register("targetDate")} type="date" />, { hint: "A planning date, not a promised turnaround." })}
            {field("summary", "Project summary", <textarea {...register("summary")} rows={6} maxLength={2000} />, { required: true, wide: true, hint: "Describe the signage and support you need. Up to 2,000 characters; do not include confidential documents." })}
          </div></fieldset>
          <div className={styles.acknowledgment}><label htmlFor="quote-previewAcknowledged"><input id="quote-previewAcknowledged" type="checkbox" {...register("previewAcknowledged")} aria-invalid={Boolean(errors.previewAcknowledged)} aria-describedby={errors.previewAcknowledged ? "quote-previewAcknowledged-error" : undefined} required /><span>{quoteUi.acknowledgment} *</span></label>{errors.previewAcknowledged && <p id="quote-previewAcknowledged-error" className={styles.error}>{errors.previewAcknowledged.message}</p>}</div>
          <div className={styles.actions}><button className="button button--primary" type="submit" disabled={!hydrated || isSubmitting}>{isSubmitting ? "Checking…" : "Validate & preview"}</button><button className="button button--secondary" type="button" onClick={clearForm}>Reset form</button></div>
        </fieldset>
      </form>
      {preview && <QuoteReview values={preview} headingRef={reviewHeadingRef} />}
    </div>
  );
}
