import React from "react"

import { Checkbox, type CheckboxProps } from "@/components/checkbox"
import { cn } from "@/utils/cn"

type CheckboxWithLabelProps = Omit<CheckboxProps, "aria-label" | "aria-labelledby"> & {
  /**
   * Unique identifier, required for label–checkbox association
   */
  id: string
  /**
   * Label text rendered next to the checkbox
   */
  children: React.ReactNode
  /**
   * Optional helper text below the label
   */
  description?: string
}

const descriptionPaddingMap = {
  sm: "pl-6",
  md: "pl-7",
  lg: "pl-8",
} as const

export const CheckboxWithLabel = React.forwardRef<
  HTMLButtonElement,
  CheckboxWithLabelProps
>(({ id, children, description, className, disabled, size, ...props }, forwardedRef) => (
  <label
    htmlFor={id}
    className={cn(
      "group",
      "flex",
      "flex-col",
      "gap-0.5",
      "[&_[aria-checked=true]+span]:text-word-primary",
      disabled ? "cursor-not-allowed" : "cursor-pointer",
      className
    )}
  >
    <div className="flex items-center gap-2">
      <Checkbox
        ref={forwardedRef}
        id={id}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        size={size}
        {...props}
      />

      <span
        id={`${id}-label`}
        className={cn(
          "text-word-primary text-base font-medium transition-colors select-none",
          disabled ? "opacity-50" : "opacity-80 group-hover:opacity-100"
        )}
      >
        {children}
      </span>
    </div>

    {description && (
      <p
        className={cn(
          "text-word-secondary text-sm font-normal transition-colors select-none",
          descriptionPaddingMap[size ?? "sm"],
          disabled && "opacity-50"
        )}
      >
        {description}
      </p>
    )}
  </label>
))

CheckboxWithLabel.displayName = "CheckboxWithLabel"
