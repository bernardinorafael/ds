import React from "react"

import { Switch, type SwitchProps } from "@/components/switch"
import { cn } from "@/utils/cn"

type SwitchWithLabelProps = Omit<SwitchProps, "aria-label" | "aria-labelledby"> & {
  /**
   * Unique identifier, required for label–switch association
   */
  id: string
  /**
   * Label text rendered next to the switch
   */
  children: React.ReactNode
  /**
   * Optional helper text below the label
   */
  description?: string
}

export const SwitchWithLabel = React.forwardRef<HTMLButtonElement, SwitchWithLabelProps>(
  ({ id, children, description, className, disabled, size, ...props }, forwardedRef) => (
    <label
      htmlFor={id}
      className={cn(
        "group flex items-start gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <Switch
        ref={forwardedRef}
        id={id}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        size={size}
        {...props}
      />

      <div className="flex flex-col gap-0.5">
        <span
          id={`${id}-label`}
          className={cn(
            "text-word-primary text-base font-medium transition-colors select-none",
            disabled ? "opacity-50" : "opacity-80 group-hover:opacity-100"
          )}
        >
          {children}
        </span>

        {description && (
          <p
            className={cn(
              "text-word-secondary text-sm font-normal transition-colors select-none",
              disabled && "opacity-50"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </label>
  )
)

SwitchWithLabel.displayName = "SwitchWithLabel"
