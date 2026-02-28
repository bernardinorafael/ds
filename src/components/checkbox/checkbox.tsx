import React from "react"

import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { motion } from "motion/react"

import { useFieldControl } from "@/components/field"
import { cn } from "@/utils/cn"

const checkboxVariants = cva(
  [
    // layout
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",

    // sizing — overridden by size variant

    // visual
    "border",
    "border-(--checkbox-border-color)",
    "bg-white",
    "text-white",
    "shadow-sm",

    // checked
    "data-[state=checked]:border-primary/75",
    "data-[state=checked]:bg-primary",
    "data-[state=checked]:[--checkbox-ring-color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
    "data-[state=checked]:[--checkbox-border-color:var(--color-primary)]",

    // indeterminate
    "data-[state=indeterminate]:border-primary/75",
    "data-[state=indeterminate]:bg-primary",
    "data-[state=indeterminate]:[--checkbox-ring-color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
    "data-[state=indeterminate]:[--checkbox-border-color:var(--color-primary)]",

    // transitions
    "transition-colors",
    "duration-150",

    // focus — ring width set per size variant
    "outline-none",
    "focus-visible:ring-(--checkbox-ring-color)",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-(--checkbox-border-color)",
  ],
  {
    variants: {
      size: {
        sm: ["size-4", "rounded-xs", "focus-visible:ring-1"],
        md: ["size-5", "rounded-sm", "focus-visible:ring-[1.5px]"],
        lg: ["size-6", "rounded-md", "focus-visible:ring-2"],
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "cursor-pointer",
      },
      validity: {
        initial: [
          "[--checkbox-border-color:var(--color-border)]",
          "[--checkbox-ring-color:color-mix(in_srgb,black_13%,transparent)]",
        ],
        error: [
          "[--checkbox-border-color:var(--color-destructive)]",
          "[--checkbox-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
        ],
        warning: [
          "[--checkbox-border-color:var(--color-orange-900)]",
          "[--checkbox-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
        ],
        success: [
          "[--checkbox-border-color:var(--color-green-900)]",
          "[--checkbox-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
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

export type CheckboxProps = Pick<
  RadixCheckbox.CheckboxProps,
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
  | "aria-invalid"
  | "className"
> &
  VariantProps<typeof checkboxVariants> & {
    /**
     * Visual validity state. Overrides Field context detection.
     */
    validity?: "initial" | "error" | "warning" | "success"
  }

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      disabled = false,
      size,
      checked,
      validity: validityProp,
      "aria-invalid": ariaInvalidProp,
      ...props
    },
    forwardedRef
  ) => {
    const field = useFieldControl({ props: { id: props.id } })
    const ariaInvalid = ariaInvalidProp ?? field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")

    return (
      <RadixCheckbox.Root
        ref={forwardedRef}
        className={cn(checkboxVariants({ size, disabled, validity }), className)}
        disabled={disabled}
        checked={checked}
        aria-invalid={ariaInvalid}
        {...props}
      >
        <RadixCheckbox.Indicator className="z-1" asChild>
          <motion.span
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.1,
            }}
          >
            {checked === "indeterminate" ? (
              <svg
                width={size === "lg" ? 12 : size === "md" ? 10 : 8}
                height="2"
                viewBox={
                  size === "lg" ? "0 0 12 2" : size === "md" ? "0 0 10 2" : "0 0 8 2"
                }
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={size === "lg" ? "M1 1H11" : size === "md" ? "M1 1H9" : "M1 1H7"}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <Check
                className={
                  size === "lg"
                    ? "size-4 stroke-[2.5px]"
                    : size === "md"
                      ? "size-3.5 stroke-[3px]"
                      : "size-3 stroke-[3.5px]"
                }
              />
            )}
          </motion.span>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    )
  }
)

Checkbox.displayName = "Checkbox"
