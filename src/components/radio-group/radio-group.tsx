import React from "react"

import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"

import { Badge, type BadgeProps } from "@/components/badge"
import { useFieldControl } from "@/components/field"
import { cn } from "@/utils/cn"

const radioItemVariants = cva(
  [
    // layout
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",

    // visual
    "rounded-full",
    "border",
    "border-(--radio-border-color)",
    "bg-white",
    "text-word-primary",
    "shadow-sm",

    // checked
    "data-[state=checked]:border-word-primary",
    "data-[state=checked]:[--radio-border-color:var(--color-word-primary)]",
    "data-[state=checked]:[--radio-ring-color:color-mix(in_srgb,var(--color-word-primary)_20%,transparent)]",

    // transitions
    "transition-colors",
    "duration-150",

    // focus
    "outline-none",
    "focus-visible:ring-(--radio-ring-color)",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-(--radio-border-color)",
  ],
  {
    variants: {
      size: {
        sm: ["size-4", "focus-visible:ring-1"],
        md: ["size-5", "focus-visible:ring-[1.5px]"],
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "cursor-pointer",
      },
      validity: {
        initial: [
          "[--radio-border-color:var(--color-border)]",
          "[--radio-ring-color:color-mix(in_srgb,black_13%,transparent)]",
        ],
        error: [
          "[--radio-border-color:var(--color-destructive)]",
          "[--radio-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
        ],
        warning: [
          "[--radio-border-color:var(--color-orange-900)]",
          "[--radio-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
        ],
        success: [
          "[--radio-border-color:var(--color-green-900)]",
          "[--radio-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
        ],
      },
    },
    defaultVariants: {
      size: "sm",
      disabled: false,
      validity: "initial",
    },
  },
)

const dotSizeMap = {
  sm: "size-1.5",
  md: "size-2",
} as const

const descriptionPaddingMap = {
  sm: "pl-6",
  md: "pl-7",
} as const

export type RadioGroupOption = {
  /** Option value */
  value: string
  /** Label text */
  label: string
  /** Helper text below the label */
  description?: string
  /** Disable this individual option */
  disabled?: boolean
  /** Badge rendered inline after the label */
  badgeProps?: BadgeProps
}

export type RadioGroupProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className"
> &
  VariantProps<typeof radioItemVariants> & {
    /** Form field name */
    name?: string
    /** Controlled value */
    value?: string
    /** Initial value (uncontrolled) */
    defaultValue?: string
    /** Called when selection changes */
    onValueChange?: (value: string) => void
    /** Disable all options */
    disabled?: boolean
    /** Mark as required */
    required?: boolean
    /** Radio options to render */
    options: RadioGroupOption[]
    /** Visual validity state. Overrides Field context detection. */
    validity?: "initial" | "error" | "warning" | "success"
  }

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      disabled = false,
      size = "sm",
      validity: validityProp,
      "aria-label": ariaLabel,
      options,
      ...props
    },
    forwardedRef,
  ) => {
    const field = useFieldControl({ props: { id: props.id } })
    const ariaInvalid = field["aria-invalid"]
    const validity =
      validityProp ??
      field.messageIntent ??
      (ariaInvalid === true ? "error" : "initial")

    return (
      <RadixRadioGroup.Root
        ref={forwardedRef}
        className={cn("flex flex-col gap-3", className)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={ariaInvalid}
        {...props}
      >
        {options.map((option) => {
          const itemId = `${field.id ?? props.id ?? ""}-${option.value}`

          return (
            <label
              key={option.value}
              htmlFor={itemId}
              className={cn(
                "group flex flex-col gap-0.5",
                disabled || option.disabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer",
              )}
            >
              <div className="flex items-center gap-2">
                <RadixRadioGroup.Item
                  id={itemId}
                  value={option.value}
                  disabled={option.disabled}
                  className={radioItemVariants({
                    size,
                    disabled: disabled || option.disabled || false,
                    validity,
                  })}
                >
                  <RadixRadioGroup.Indicator asChild>
                    <motion.span
                      className={cn(
                        "rounded-full bg-current",
                        dotSizeMap[size ?? "sm"],
                      )}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  </RadixRadioGroup.Indicator>
                </RadixRadioGroup.Item>

                <span
                  className={cn(
                    "text-word-primary text-base font-medium transition-colors select-none",
                    disabled || option.disabled
                      ? "opacity-50"
                      : "opacity-80 group-hover:opacity-100",
                  )}
                >
                  {option.label}
                </span>

                {option.badgeProps && <Badge {...option.badgeProps} />}
              </div>

              {option.description && (
                <p
                  className={cn(
                    "text-word-secondary text-sm font-normal transition-colors select-none",
                    descriptionPaddingMap[size ?? "sm"],
                    (disabled || option.disabled) && "opacity-50",
                  )}
                >
                  {option.description}
                </p>
              )}
            </label>
          )
        })}
      </RadixRadioGroup.Root>
    )
  },
)

RadioGroup.displayName = "RadioGroup"
