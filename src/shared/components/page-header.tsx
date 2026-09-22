type Props = {
  title: string;
  description?: React.ReactNode;
  // What the page's one action is, beside its title
  action?: React.ReactNode;
};

// The top of a page: a large title, its action beside it, and a line on what the page is for
export function PageHeader({ title, description, action }: Props) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex min-h-10 items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {action}
      </div>
      {description && (
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
