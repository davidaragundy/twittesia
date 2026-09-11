type Props = {
  title: string;
  description: string;
};

export function AuthHeading({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-balance text-muted-foreground">{description}</p>
    </div>
  );
}
