import React from "react"

import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge, type BadgeProps } from "@/components/badge"
import { useFieldControl } from "@/components/field"
import { Tooltip } from "@/components/tooltip"
import { cn } from "@/utils/cn"

const radioItemVariants = cva(
  [
    // positioning
    "relative",

    // layout
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",

    // visual
    "overflow-hidden",
    "rounded-full",
    "bg-white",
    "shadow-[inset_0_0_0_1px_var(--radio-border-color)]",

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
  }
)

const indicatorInsetMap = {
  sm: "before:inset-1",
  md: "before:inset-[5px]",
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
  /** Tooltip shown on hover (useful for explaining why an option is disabled) */
  tooltip?: React.ReactNode
}

export type RadioGroupProps = Pick<
  React.ComponentProps<"div">,
  | "id"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
  | "className"
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
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      options,
      ...props
    },
    forwardedRef
  ) => {
    const autoId = React.useId()
    const field = useFieldControl({ props: { id: props.id } })
    const baseId = field.id ?? props.id ?? autoId
    const ariaInvalid = ariaInvalidProp ?? field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")

    return (
      <RadixRadioGroup.Root
        ref={forwardedRef}
        className={cn("flex flex-col gap-3", className)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedByProp ?? field["aria-describedby"]}
        aria-invalid={ariaInvalid}
        {...props}
      >
        {options.map((option) => {
          const itemId = `${baseId}-${option.value}`

          const content = (
            <label
              key={option.value}
              htmlFor={itemId}
              className={cn(
                "group flex w-fit flex-col gap-0.5",
                disabled || option.disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <div className="flex items-center gap-2">
                <RadixRadioGroup.Item
                  id={itemId}
                  value={option.value}
                  disabled={option.disabled}
                  className={radioItemVariants({
                    size,
                    disabled: disabled || option.disabled,
                    validity,
                  })}
                >
                  <RadixRadioGroup.Indicator asChild forceMount>
                    <span
                      className={cn(
                        "absolute inset-0 scale-0 rounded-full",
                        "bg-word-primary bg-linear-to-b from-white/12 to-white/0",
                        "transition-transform duration-300",
                        "ease-[cubic-bezier(.4,.36,0,1)]",
                        "data-[state=checked]:scale-100",
                        "before:absolute before:rounded-full before:bg-white",
                        indicatorInsetMap[size ?? "sm"],
                      )}
                    />
                  </RadixRadioGroup.Indicator>
                </RadixRadioGroup.Item>

                <span
                  className={cn(
                    "text-word-primary text-base font-medium transition-colors select-none",
                    disabled || option.disabled
                      ? "opacity-50"
                      : "opacity-80 group-hover:opacity-100"
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
                    (disabled || option.disabled) && "opacity-50"
                  )}
                >
                  {option.description}
                </p>
              )}
            </label>
          )

          if (option.tooltip) {
            return (
              <Tooltip key={option.value} label={option.tooltip}>
                {content}
              </Tooltip>
            )
          }

          return content
        })}
      </RadixRadioGroup.Root>
    )
  }
)

RadioGroup.displayName = "RadioGroup"
