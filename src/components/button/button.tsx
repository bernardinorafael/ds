import React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { Icon, type IconName } from "@/components/icon"
import { Spinner } from "@/components/spinner"
import { Tooltip } from "@/components/tooltip"
import { cn } from "@/utils/cn"

export const buttonVariants = cva(
  [
    // positioning
    "group",
    "isolate",
    "relative",

    // layout
    "inline-flex",
    "items-center",
    "justify-center",

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
    "focus-visible:ring-[3px]",
    "focus-visible:ring-(--focus-ring-color)",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-(--focus-offset-color)",

    // disabled states
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-primary",
          "text-primary-foreground",
          "not-disabled:hover:bg-primary/90",
          "[--focus-ring-color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
          "[--focus-offset-color:var(--color-primary)]",
        ],
        secondary: [
          "transition",
          "bg-secondary",
          "shadow-black/0.8 shadow",
          "text-secondary-foreground",
          "border border-black/15",
          "not-disabled:hover:border-black/25",
          "[--btn-icon-color:var(--color-word-secondary)]",
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
          "[--focus-ring-color:color-mix(in_srgb,black_13%,transparent)]",
          "[--focus-offset-color:color-mix(in_srgb,black_15%,transparent)]",
        ],
        danger: [
          "bg-destructive",
          "text-destructive-foreground",
          "not-disabled:hover:bg-destructive/90",
          "[--focus-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
          "[--focus-offset-color:var(--color-destructive)]",
        ],
        ghost: [
          "bg-transparent",
          "text-foreground",
          "not-disabled:hover:bg-black/6",
          "[--btn-icon-color:var(--color-word-secondary)]",
          "[--focus-ring-color:color-mix(in_srgb,black_13%,transparent)]",
          "[--focus-offset-color:color-mix(in_srgb,black_15%,transparent)]",
        ],
      },
      size: {
        sm: "h-6 gap-1.5 rounded-[0.3125rem] px-2 text-sm",
        md: "h-8 gap-2 rounded-sm px-2.5 text-base",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
)

const ICON_SIZE: Record<
  NonNullable<VariantProps<typeof buttonVariants>["size"]>,
  "sm" | "md" | "lg"
> = {
  sm: "sm",
  md: "sm",
}

export type ButtonProps = Pick<
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
    /**
     * Icon rendered before the button text
     */
    leftIcon?: IconName
    /**
     * Icon rendered after the button text
     */
    rightIcon?: IconName
    /**
     * Tooltip label shown on hover. When provided, wraps the button in a Tooltip.
     */
    tooltip?: React.ReactNode
    /**
     * Tooltip placement relative to the button @default "top"
     */
    tooltipSide?: "top" | "right" | "bottom" | "left"
  }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      intent,
      size,
      type = "button",
      isLoading,
      disabled,
      leftIcon,
      rightIcon,
      tooltip,
      tooltipSide,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const button = (
      <button
        ref={forwardedRef}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(buttonVariants({ intent, size }), className)}
        {...props}
      >
        <AnimatePresence>
          {isLoading && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center overflow-hidden"
            >
              <Spinner size={size === "sm" ? "xs" : "sm"} label="Loading" />
            </motion.span>
          )}
        </AnimatePresence>

        {leftIcon && (
          <span className="shrink-0 text-(--btn-icon-color)">
            <Icon name={leftIcon} size={ICON_SIZE[size ?? "md"]} />
          </span>
        )}

        {children}

        {rightIcon && (
          <span className="shrink-0 text-(--btn-icon-color)">
            <Icon name={rightIcon} size={ICON_SIZE[size ?? "md"]} />
          </span>
        )}
      </button>
    )

    if (!tooltip) return button

    return (
      <Tooltip label={tooltip} side={tooltipSide}>
        {button}
      </Tooltip>
    )
  }
)

Button.displayName = "Button"
