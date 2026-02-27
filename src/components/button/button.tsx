import React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { Spinner } from "@/components/spinner"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  [
    // positioning
    "group",
    "isolate",
    "relative",

    // layout
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",

    // visual
    "font-medium",
    "whitespace-nowrap",
    "cursor-pointer",
    "select-none",
    "overflow-hidden",

    // transitions
    "transition-colors",
    "duration-300",

    // focus states
    "outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",

    // disabled states
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-primary", "text-primary-foreground", "hover:bg-primary/90"],
        secondary: [
          "transition",
          "bg-secondary",
          "shadow-black/0.8 shadow",
          "text-secondary-foreground",
          "border border-black/15",
          "hover:border-black/25",
          [
            "before:absolute",
            "before:inset-0",
            "before:from-50%",
            "before:rounded-inherit",
            "before:to-black/2",
            "before:transition-opacity",
            "before:bg-linear-to-b",
            "before:from-black/0",
          ],
        ],
        danger: [
          "bg-destructive",
          "text-destructive-foreground",
          "hover:bg-destructive/90",
        ],
      },
      size: {
        sm: "h-6 rounded-[0.3125rem] px-2 text-sm",
        md: "h-8 rounded-sm px-2.5 text-base",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
)

type ButtonProps = Pick<
  React.ComponentProps<"button">,
  | "id"
  | "form"
  | "aria-label"
  | "className"
  | "disabled"
  | "onBlur"
  | "onClick"
  | "onFocus"
  | "tabIndex"
  | "role"
  | "type"
> &
  VariantProps<typeof buttonVariants> & {
    /**
     * Button content
     */
    children: React.ReactNode
    /**
     * Shows a spinner overlay and disables interaction
     */
    isLoading?: boolean
  }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, intent, size, type = "button", isLoading, disabled, children, ...props },
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(buttonVariants({ intent, size }), className)}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size === "sm" ? "xs" : "sm"} label="Loading" />
          </span>
        )}
        <span className={cn(isLoading && "invisible")}>{children}</span>
      </button>
    )
  }
)

Button.displayName = "Button"
