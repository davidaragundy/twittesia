import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const skeletonVariants = cva("animate-pulse bg-muted", {
  variants: {
    shape: {
      default: "rounded-2xl",
      // A placeholder stands in for something, so it is the shape of that thing: a picture,
      // a card, or a field someone writes in
      round: "rounded-full",
      card: "rounded-3xl",
      field: "rounded-4xl",
    },
  },
  defaultVariants: {
    shape: "default",
  },
})

function Skeleton({
  className,
  shape = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ shape, className }))}
      {...props}
    />
  )
}

export { Skeleton }
