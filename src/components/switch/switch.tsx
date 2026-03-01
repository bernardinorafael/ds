import React from "react"

import * as RadixSwitch from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { useFieldControl } from "@/components/field"
import { cn } from "@/utils/cn"

const switchVariants = cva(
  [
    // layout
    "group",
    "inline-flex",
    "shrink-0",
    "items-center",

    // visual
    "rounded-full",
    "border",
    "border-(--switch-border-color)",
    "bg-surface-100",
    "shadow-sm",

    // checked
    "data-[state=checked]:border-primary/75",
    "data-[state=checked]:bg-primary",
    "data-[state=checked]:[--switch-ring-color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
    "data-[state=checked]:[--switch-border-color:var(--color-primary)]",

    // transitions
    "transition-colors",
    "duration-150",

    // focus
    "outline-none",
    "focus-visible:ring-(--switch-ring-color)",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-(--switch-border-color)",
  ],
  {
    variants: {
      size: {
        sm: [
          "h-5 w-9",
          "[--sw-gap:2px]",
          "[--sw-thumb:1rem]",
          "[--sw-wider:1.625rem]",
          "[--sw-x:1rem]",
          "[--sw-x-active:0.375rem]",
          "focus-visible:ring-1",
        ],
        md: [
          "h-6 w-11",
          "[--sw-gap:2px]",
          "[--sw-thumb:1.25rem]",
          "[--sw-wider:1.875rem]",
          "[--sw-x:1.25rem]",
          "[--sw-x-active:0.625rem]",
          "focus-visible:ring-[1.5px]",
        ],
        lg: [
          "h-7 w-13",
          "[--sw-gap:2px]",
          "[--sw-thumb:1.5rem]",
          "[--sw-wider:2.125rem]",
          "[--sw-x:1.5rem]",
          "[--sw-x-active:0.875rem]",
          "focus-visible:ring-2",
        ],
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "cursor-pointer",
      },
      validity: {
        initial: [
          "[--switch-border-color:var(--color-border)]",
          "[--switch-ring-color:color-mix(in_srgb,black_13%,transparent)]",
        ],
        error: [
          "[--switch-border-color:var(--color-destructive)]",
          "[--switch-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
        ],
        warning: [
          "[--switch-border-color:var(--color-orange-900)]",
          "[--switch-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
        ],
        success: [
          "[--switch-border-color:var(--color-green-900)]",
          "[--switch-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
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

export type SwitchProps = Pick<
  RadixSwitch.SwitchProps,
  | "id"
  | "name"
  | "value"
  | "checked"
  | "defaultChecked"
  | "onCheckedChange"
  | "disabled"
  | "required"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
  | "className"
> &
  Omit<VariantProps<typeof switchVariants>, "size"> & {
    /** Height variant @default "sm" */
    size?: "sm" | "md" | "lg"
    /**
     * Visual validity state. Overrides Field context detection.
     */
    validity?: "initial" | "error" | "warning" | "success"
  }

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      disabled = false,
      size = "sm",
      validity: validityProp,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      ...props
    },
    forwardedRef
  ) => {
    const field = useFieldControl({ props: { id: props.id } })
    const ariaInvalid = ariaInvalidProp ?? field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")

    return (
      <RadixSwitch.Root
        ref={forwardedRef}
        className={cn(switchVariants({ size, disabled, validity }), className)}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedByProp ?? field["aria-describedby"]}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            // shape
            "pointer-events-none block rounded-full bg-white shadow-sm",
            "h-(--sw-thumb) w-(--sw-thumb)",

            // position — unchecked: gap from left, checked: gap from right
            "translate-x-(--sw-gap)",
            "data-[state=checked]:translate-x-(--sw-x)",

            // active press — thumb widens, checked adjusts translate (disabled excluded)
            "group-[:not(:disabled):active]:w-(--sw-wider)",
            "data-[state=checked]:group-[:not(:disabled):active]:translate-x-(--sw-x-active)",

            // transition
            "transition-all duration-300 ease-in-out"
          )}
        />
      </RadixSwitch.Root>
    )
  }
)

Switch.displayName = "Switch"
