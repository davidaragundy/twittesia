interface Props {
  id: string;
  // The small label that names the section
  label: string;
  // The large line that says what it means
  title: React.ReactNode;
}

// How every section of the landing opens: a small label, then a large line
export const LandingSectionHeading = ({ id, label, title }: Props) => (
  <div className="flex flex-col gap-3">
    <h2 id={id} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {label}
    </h2>
    <p className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</p>
  </div>
);
