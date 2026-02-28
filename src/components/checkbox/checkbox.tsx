import React from "react"

import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { motion } from "motion/react"

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
    "border-border",
    "bg-white",
    "text-white",
    "shadow-sm",

    // checked
    "data-[state=checked]:border-primary/75",
    "data-[state=checked]:bg-primary",

    // indeterminate
    "data-[state=indeterminate]:border-primary/75",
    "data-[state=indeterminate]:bg-primary",

    // transitions
    "transition-colors",
    "duration-150",

    // focus
    "outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary/50",
    "focus-visible:ring-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "size-4 rounded-xs",
        md: "size-5 rounded-sm",
        lg: "size-6 rounded-md",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      size: "sm",
      disabled: false,
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
  | "className"
> &
  VariantProps<typeof checkboxVariants>

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, disabled = false, size, checked, ...props }, forwardedRef) => (
    <RadixCheckbox.Root
      ref={forwardedRef}
      className={cn(checkboxVariants({ size, disabled }), className)}
      disabled={disabled}
      checked={checked}
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
)

Checkbox.displayName = "Checkbox"
