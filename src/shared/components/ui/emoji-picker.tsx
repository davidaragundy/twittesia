"use client"

import * as React from "react"
import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from "frimousse"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"

import { Spinner } from "@/shared/components/ui/spinner"

function EmojiPicker({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      data-slot="emoji-picker"
      className={cn(
        "isolate flex h-full w-fit flex-col overflow-hidden bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <div
      data-slot="emoji-picker-search-wrapper"
      className={cn(
        "mx-2 mt-2 mb-1 flex h-9 items-center gap-2 rounded-4xl bg-input/50 px-3 focus-within:ring-3 focus-within:ring-ring/30",
        className
      )}
    >
      <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0 text-muted-foreground" />
      <EmojiPickerPrimitive.Search
        data-slot="emoji-picker-search"
        className="h-full w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
        {...props}
      />
    </div>
  )
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} data-slot="emoji-picker-row" className="scroll-my-1.5 px-2">
      {children}
    </div>
  )
}

function EmojiPickerEmoji({ emoji, className, ...props }: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      data-slot="emoji-picker-emoji"
      className={cn(
        "flex h-9 min-w-9 flex-1 items-center justify-center rounded-2xl text-xl transition-colors data-active:bg-muted",
        className
      )}
    >
      {emoji.emoji}
    </button>
  )
}

function EmojiPickerCategoryHeader({ category, ...props }: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      data-slot="emoji-picker-category-header"
      className="bg-popover px-3.5 pt-3 pb-2 text-xs font-medium text-muted-foreground"
    >
      {category.label}
    </div>
  )
}

function EmojiPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      data-slot="emoji-picker-viewport"
      className={cn("relative flex-1 outline-hidden", className)}
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        data-slot="emoji-picker-loading"
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
      >
        <Spinner />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        data-slot="emoji-picker-empty"
        className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground"
      >
        No emoji found
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List
        data-slot="emoji-picker-list"
        className="pb-2 select-none"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
      />
    </EmojiPickerPrimitive.Viewport>
  )
}

function EmojiPickerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="emoji-picker-footer"
      className={cn(
        "flex w-full max-w-(--frimousse-viewport-width) min-w-0 items-center gap-2 border-t border-border/60 p-2",
        className
      )}
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <div className="flex size-9 flex-none items-center justify-center text-2xl">
                {emoji.emoji}
              </div>
              <span className="truncate text-xs text-muted-foreground">{emoji.label}</span>
            </>
          ) : (
            <span className="ml-2 flex h-9 items-center truncate text-xs text-muted-foreground">
              Pick an emoji
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
      <EmojiPickerPrimitive.SkinToneSelector
        data-slot="emoji-picker-skin-tone"
        aria-label="Change skin tone"
        className="ml-auto flex size-9 flex-none items-center justify-center rounded-2xl text-xl transition-colors hover:bg-muted"
      />
    </div>
  )
}

export { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter }
