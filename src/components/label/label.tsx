import React from "react"

import { Badge } from "@/components/badge"
import { cn } from "@/utils/cn"

export type LabelProps = {
  htmlFor: string
  optional?: boolean
  /**
   * Text shown in the optional badge @default "Optional"
   */
  optionalLabel?: string
  disabled?: boolean
  omitLabel?: boolean
  id?: string
  children: React.ReactNode
  className?: string
}

export function Label({
  children,
  htmlFor,
  className,
  omitLabel,
  disabled = false,
  optional = false,
  optionalLabel = "Optional",
}: LabelProps) {
  return (
    <div className="group flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className={cn(
          "flex items-center gap-2 pl-(--label-padding) text-base font-medium select-none",
          disabled && "text-gray-400",
          omitLabel && "sr-only",
          className
        )}
      >
        {children}
      </label>
      {optional && <Badge intent="secondary">{optionalLabel}</Badge>}
    </div>
  )
}
