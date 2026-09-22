import { cn } from "cn";

type Props = React.ComponentProps<"section">;

// The one surface the app draws on: soft, round and borderless, for anything that groups things
// or can be acted on as a whole
export function Panel({ className, ...props }: Props) {
  return (
    <section
      className={cn("flex flex-col gap-4 rounded-3xl bg-muted/30 p-5 sm:p-6", className)}
      {...props}
    />
  );
}
