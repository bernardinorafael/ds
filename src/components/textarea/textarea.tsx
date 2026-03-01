import React from "react"

import { cva } from "class-variance-authority"
import TextareaAutosize from "react-textarea-autosize"

import { useFieldControl } from "@/components/field"
import { cn } from "@/utils/cn"

const rootVariants = cva(
  [
    // layout
    "flex",
    "relative",
    "w-full",

    // visual
    "rounded-sm",
    "bg-white",
    "shadow-sm",
    "transition",

    // ring border
    "ring-1",
    "ring-(--textarea-border-color)",

    // focus-within ring
    "focus-within:ring-[3px]",
    "focus-within:ring-(--textarea-ring-color)",
    "focus-within:ring-offset-1",
    "focus-within:ring-offset-(--textarea-border-color-focus)",

    // read-only state
    "has-[textarea:read-only]:bg-surface-100",
  ],
  {
    variants: {
      validity: {
        initial: [
          "[--textarea-border-color:color-mix(in_srgb,black_10%,transparent)]",
          "[--textarea-border-color-focus:color-mix(in_srgb,black_15%,transparent)]",
          "[--textarea-ring-color:color-mix(in_srgb,black_13%,transparent)]",
        ],
        error: [
          "[--textarea-border-color:var(--color-destructive)]",
          "[--textarea-border-color-focus:var(--color-destructive)]",
          "[--textarea-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
        ],
        warning: [
          "[--textarea-border-color:var(--color-orange-900)]",
          "[--textarea-border-color-focus:var(--color-orange-900)]",
          "[--textarea-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
        ],
        success: [
          "[--textarea-border-color:var(--color-green-900)]",
          "[--textarea-border-color-focus:var(--color-green-900)]",
          "[--textarea-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
        ],
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: null,
      },
    },
    defaultVariants: {
      validity: "initial",
      disabled: false,
    },
  }
)

const textareaVariants = cva(
  [
    // layout
    "w-full",

    // visual
    "bg-transparent",
    "text-word-primary",
    "outline-none",
    "resize-none",
    "rounded-[inherit]",

    // placeholder
    "placeholder:text-word-placeholder",

    // disabled
    "disabled:cursor-not-allowed",

    // read-only
    "read-only:cursor-default",
  ],
  {
    variants: {
      size: {
        sm: ["px-2", "py-1", "text-sm", "placeholder:text-sm"],
        md: ["px-3", "py-2", "text-base", "placeholder:text-base"],
        lg: ["px-4", "py-2.5", "text-base", "placeholder:text-base"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export type TextareaProps = Pick<
  React.ComponentProps<"textarea">,
  | "id"
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onKeyDown"
  | "onFocus"
  | "onBlur"
  | "aria-label"
  | "aria-describedby"
  | "aria-invalid"
  | "placeholder"
  | "required"
  | "disabled"
  | "autoFocus"
  | "autoComplete"
  | "spellCheck"
  | "readOnly"
  | "maxLength"
  | "className"
> & {
  /** Height variant @default "md" */
  size?: "sm" | "md" | "lg"
  /** Minimum number of visible rows @default 3 */
  minRows?: number
  /** Maximum number of rows before scrolling */
  maxRows?: number
  /**
   * Visual validity state. Overrides the `aria-invalid`-based detection.
   * Use for warning and success states beyond error.
   */
  validity?: "initial" | "error" | "warning" | "success"
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      className,
      size = "md",
      disabled = false,
      minRows = 3,
      maxRows,
      validity: validityProp,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      ...props
    },
    forwardedRef
  ) => {
    const field = useFieldControl({ props: { id } })

    const ariaInvalid = ariaInvalidProp ?? field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")

    return (
      <div className={cn(rootVariants({ disabled, validity }), className)}>
        <TextareaAutosize
          ref={forwardedRef}
          id={field.id}
          disabled={disabled}
          minRows={minRows}
          maxRows={maxRows}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedByProp ?? field["aria-describedby"]}
          className={textareaVariants({ size })}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
