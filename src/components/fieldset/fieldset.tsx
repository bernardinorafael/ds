import React from "react"

import { cn } from "@/utils/cn"

type FieldsetProps = Pick<
  React.ComponentProps<"fieldset">,
  "id" | "aria-label" | "className" | "children"
> & {
  /**
   * Fieldset heading rendered as a `<legend>`
   */
  legend: string
  /**
   * Explanatory text below the legend — a single string or multiple paragraphs
   */
  description?: string | string[]
}

export const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, legend, description, children, ...props }, forwardedRef) => (
    <fieldset
      ref={forwardedRef}
      className={cn(
        // layout
        "relative",
        "grid",
        "grid-cols-2",
        "gap-x-16",
        // custom property
        "[--fieldset-checkbox-offset:1.625rem]",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <legend className="text-word-primary text-base font-medium">{legend}</legend>

        {description && (
          <div className="text-word-secondary flex flex-col gap-1 text-sm font-normal">
            {(Array.isArray(description) ? description : [description]).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">{children}</div>
    </fieldset>
  )
)

Fieldset.displayName = "Fieldset"
