type Props = {
  title: string;
  effectiveDate: string;
  intro: React.ReactNode;
  children: React.ReactNode;
};

/**
 * A document: its title, when it took effect, and its sections.
 *
 * Everything inside reads the way typeset says a document reads — headings, paragraphs, lists,
 * links and bold — so nothing here says it again. The effective date is the exception: it is
 * about the page rather than part of it, and keeps the size of a caption.
 */
export function LegalPage({ title, effectiveDate, intro, children }: Props) {
  return (
    <article className="typeset typeset-docs mx-auto w-full max-w-[37em] py-20 sm:py-28">
      <h1>{title}</h1>

      <p className="not-typeset text-sm text-muted-foreground">Effective {effectiveDate}</p>

      <p>{intro}</p>

      {children}
    </article>
  );
}
