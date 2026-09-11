type Props = {
  title: string;
  effectiveDate: string;
  intro: React.ReactNode;
  children: React.ReactNode;
};

export function LegalPage({ title, effectiveDate, intro, children }: Props) {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-16 py-20 sm:py-28">
      <header className="flex flex-col gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="text-sm text-muted-foreground">Effective {effectiveDate}</p>
        <p className="text-lg leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
          {intro}
        </p>
      </header>
      <div className="flex flex-col gap-14">{children}</div>
    </article>
  );
}
