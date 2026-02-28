import React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { Icon, type IconName } from "@/components/icon"
import { Tooltip } from "@/components/tooltip"
import { cn } from "@/utils/cn"

const iconButtonVariants = cva(
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
          "[--focus-ring-color:color-mix(in_srgb,black_13%,transparent)]",
          "[--focus-offset-color:color-mix(in_srgb,black_15%,transparent)]",
        ],
      },
      size: {
        sm: "size-6 rounded-[0.3125rem]",
        md: "size-8 rounded-sm",
      },
      shape: {
        square: "",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      intent: "ghost",
      size: "md",
      shape: "square",
    },
  }
)

const ICON_SIZE: Record<
  NonNullable<VariantProps<typeof iconButtonVariants>["size"]>,
  "sm" | "md"
> = {
  sm: "sm",
  md: "md",
}

export type IconButtonProps = Pick<
  React.ComponentProps<"button">,
  | "id"
  | "className"
  | "disabled"
  | "onBlur"
  | "onClick"
  | "onFocus"
  | "tabIndex"
  | "type"
  | "form"
> &
  VariantProps<typeof iconButtonVariants> & {
    /**
     * Icon to render
     */
    icon: IconName
    /**
     * Accessible label for screen readers.
     * Optional when `tooltip` is a string — derived from it automatically.
     * Required otherwise.
     */
    "aria-label"?: string
    /**
     * Tooltip label shown on hover. When a string, also serves as the accessible
     * label if `aria-label` is omitted.
     */
    tooltip?: React.ReactNode
    /**
     * Tooltip placement relative to the button @default "top"
     */
    tooltipSide?: "top" | "right" | "bottom" | "left"
  }

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = "md",
      intent,
      shape,
      className,
      tooltip,
      tooltipSide,
      "aria-label": ariaLabel,
      ...props
    },
    forwardedRef
  ) => {
    const resolvedAriaLabel =
      ariaLabel ?? (typeof tooltip === "string" ? tooltip : undefined)

    const button = (
      <button
        ref={forwardedRef}
        type="button"
        aria-label={resolvedAriaLabel}
        className={cn(iconButtonVariants({ intent, size, shape }), className)}
        {...props}
      >
        <Icon name={icon} size={ICON_SIZE[size ?? "md"]} />
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

IconButton.displayName = "IconButton"
