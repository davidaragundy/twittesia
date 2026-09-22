"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

type Props = {
  isActive?: boolean;
} & useRender.ComponentProps<"button">;

/**
 * One look for every navigation item: large, like the rows of a settings app, with a soft
 * background on hover and a solid one for the page you are on. A button by default; a link, or
 * a menu's trigger, through `render`.
 */
export function NavButton({ isActive = false, className, render, ...props }: Props) {
  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        "aria-current": isActive ? "page" : undefined,
        className: cn(
          "flex min-h-12 w-full items-center gap-4 rounded-full px-4 text-left text-base font-medium text-muted-foreground transition-colors outline-none select-none",
          "hover:bg-muted/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:opacity-50 aria-[current=page]:bg-muted aria-[current=page]:text-foreground",
          "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
          className,
        ),
      },
      props,
    ),
  });
}
