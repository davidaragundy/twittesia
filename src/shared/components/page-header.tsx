type Props = {
  title: string;
  // A small label above the title, such as the date
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  // What the page's one action is, beside its title
  action?: React.ReactNode;
};

// The top of a page, the way Apple's apps do it: a small label, a large title with its action
// beside it, and a line on what the page is for
export function PageHeader({ title, eyebrow, description, action }: Props) {
  return (
    <header className="flex flex-col gap-1.5">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {eyebrow}
        </p>
      )}
      <div className="flex min-h-11 items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {action}
      </div>
      {description && (
        <p className="max-w-md pt-0.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}
