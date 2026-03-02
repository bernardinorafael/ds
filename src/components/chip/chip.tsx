import React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { Icon, type IconName } from "@/components/icon"
import { cn } from "@/utils/cn"

const chipVariants = cva(
  [
    // layout
    "group/chip",
    "isolate",
    "relative",
    "inline-flex",
    "items-center",
    "overflow-hidden",

    // visual
    "rounded-sm",
    "font-normal",
    "text-sm",
    "select-none",
    "cursor-pointer",

    // internal spacing vars
    "[--chip-px:0.375rem]",
    "[--chip-gap:0.25rem]",
    "[--chip-icon-size:1.25rem]",
    "[--chip-shadow-active:0_2px_3px_-1px_rgb(0_0_0/0.08),0_2px_0_-1px_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.08)]",

    // spacing
    "gap-(--chip-gap)",
    "px-(--chip-px)",

    // shadow border (3 layers to match hover/focus structure for smooth transition)
    "shadow-[0_2px_3px_-1px_transparent,0_2px_0_-1px_rgb(0_0_0/0.04),0_0_0_1px_rgb(0_0_0/0.08)]",

    // children min-width
    "*:min-w-0",

    // icon sizing via data-icon
    "*:data-icon:size-(--chip-icon-size)",

    // transitions
    "transition-[shadow,color]",
    "duration-150",

    // hover shadow
    "not-disabled:hover:shadow-(--chip-shadow-active)",

    // focus states
    "outline-none",
    "focus-visible:shadow-(--chip-shadow-active)",
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
        secondary: [
          "bg-gray-200",
          "text-gray-1000",
          "*:data-icon:text-gray-500",
          "not-disabled:hover:text-gray-1200",
          "not-disabled:hover:*:data-icon:text-gray-700",
          "focus-visible:text-gray-1200",
          "focus-visible:*:data-icon:text-gray-700",
          "[--focus-ring-color:color-mix(in_srgb,black_13%,transparent)]",
          "[--focus-offset-color:color-mix(in_srgb,black_15%,transparent)]",
        ],
      },
      size: {
        sm: "h-(--chip-icon-size)",
        md: ["h-6", "[--chip-px:0.5rem]", "[--chip-gap:0.375rem]"],
      },
      font: {
        sans: "font-sans",
        mono: "font-mono [--chip-label-translate-y:0.03125rem]",
      },
    },
    defaultVariants: {
      intent: "secondary",
      size: "sm",
      font: "sans",
    },
  }
)

export type ChipProps = Pick<
  React.ComponentProps<"button">,
  | "id"
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
  VariantProps<typeof chipVariants> & {
    /**
     * Chip label
     */
    children: React.ReactNode
    /**
     * Icon rendered before the label
     */
    icon?: IconName
    /**
     * Callback when the remove button is clicked.
     * When provided, a remove (×) button is rendered.
     */
    onRemove?: () => void
    /**
     * Accessible label for the remove button
     * @default "Remove"
     */
    removeLabel?: string
  }

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      intent,
      children,
      icon,
      size,
      font,
      disabled = false,
      removeLabel = "Remove",
      type = "button",
      onRemove,
      onClick,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(chipVariants({ intent, size, font }), className)}
        {...props}
      >
        {icon && (
          <span>
            <Icon name={icon} size="sm" />
          </span>
        )}

        <span
          className={cn(
            "-my-2 truncate py-2",
            "-translate-y-(--chip-label-translate-y,0)"
          )}
        >
          {children}
        </span>

        {onRemove && (
          <span
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={removeLabel}
            aria-disabled={disabled || undefined}
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled) onRemove()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                e.stopPropagation()
                if (!disabled) onRemove()
              }
            }}
            className={cn(
              "-mr-0.5 flex size-4 shrink-0 items-center justify-center rounded-xs transition-colors duration-150 outline-none",
              !disabled && "hover:bg-black/10 focus-visible:bg-black/10"
            )}
          >
            <Icon name="x-outline" size="sm" />
          </span>
        )}
      </button>
    )
  }
)

Chip.displayName = "Chip"
