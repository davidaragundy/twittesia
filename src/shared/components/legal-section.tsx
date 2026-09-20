type Props = {
  title: string;
  children: React.ReactNode;
};

// One part of a document. What is inside it is written as headings, paragraphs and lists, and
// typeset decides how they read.
export function LegalSection({ title, children }: Props) {
  return (
    <section>
      <h2>{title}</h2>

      {children}
    </section>
  );
}
