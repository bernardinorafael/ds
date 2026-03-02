import React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const kbdVariants = cva(
  [
    // layout
    "inline-flex",
    "items-center",
    "justify-center",

    // visual
    "rounded-[0.3125rem]",
    "border",
    "border-b-2",
    "font-mono",
    "lowercase",
  ],
  {
    variants: {
      intent: {
        neutral: [
          "border-gray-500",
          "border-b-gray-600",
          "bg-gray-200",
          "text-gray-1000",
        ],
        danger: ["border-red-500", "border-b-red-600", "bg-red-200", "text-red-1000"],
        primary: [
          "border-purple-500",
          "border-b-purple-600",
          "bg-purple-200",
          "text-purple-1000",
        ],
      },
      size: {
        sm: "text-2xs h-4 min-w-4 px-0.5",
        base: "h-5 min-w-5 px-1 text-xs",
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "base",
    },
  }
)

type KbdProps = Pick<
  React.ComponentProps<"kbd">,
  "id" | "aria-label" | "className" | "title"
> &
  VariantProps<typeof kbdVariants> & {
    /**
     * Key label content
     */
    children: React.ReactNode
  }

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, intent, size, children, ...props }, forwardedRef) => {
    return (
      <kbd
        ref={forwardedRef}
        className={cn(kbdVariants({ intent, size }), className)}
        {...props}
      >
        {children}
      </kbd>
    )
  }
)

Kbd.displayName = "Kbd"
