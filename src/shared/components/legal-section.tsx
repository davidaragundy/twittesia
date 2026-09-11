type Props = {
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ title, children }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
