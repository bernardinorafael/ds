import React, { useState } from "react"

import { cva } from "class-variance-authority"

import { useFieldControl } from "@/components/field"
import { Icon } from "@/components/icon"
import { Spinner } from "@/components/spinner"
import { cn } from "@/utils/cn"

const rootVariants = cva(
  [
    // layout
    "flex",
    "relative",
    "w-full",
    "flex-row",

    // visual
    "rounded-sm",
    "bg-white",
    "shadow-sm",
    "transition",

    // internal spacing var (overridden per size)
    "[--input-px:0.75rem]",

    // ring border
    "ring-1",
    "ring-(--input-border-color)",

    // focus-within ring
    "focus-within:ring-[3px]",
    "focus-within:ring-(--input-ring-color)",
    "focus-within:ring-offset-1",
    "focus-within:ring-offset-(--input-border-color-focus)",

    // read-only state
    "has-[input:read-only]:bg-surface-100",
  ],
  {
    variants: {
      type: {
        text: null,
        email: null,
        number: null,
        tel: null,
        url: null,
        // --input-pl overrides the left padding to make room for the search icon
        search: ["[--input-pl:2rem]"],
        password: null,
      },
      validity: {
        initial: [
          "[--input-border-color:color-mix(in_srgb,black_10%,transparent)]",
          "[--input-border-color-focus:color-mix(in_srgb,black_15%,transparent)]",
          "[--input-ring-color:color-mix(in_srgb,black_13%,transparent)]",
        ],
        error: [
          "[--input-border-color:var(--color-destructive)]",
          "[--input-border-color-focus:var(--color-destructive)]",
          "[--input-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
        ],
        warning: [
          "[--input-border-color:var(--color-orange-900)]",
          "[--input-border-color-focus:var(--color-orange-900)]",
          "[--input-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
        ],
        success: [
          "[--input-border-color:var(--color-green-900)]",
          "[--input-border-color-focus:var(--color-green-900)]",
          "[--input-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
        ],
      },
      size: {
        sm: ["h-6", "[--input-px:0.5rem]"],
        md: ["h-8"],
        lg: ["h-10", "[--input-px:1rem]"],
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: null,
      },
    },
    compoundVariants: [
      { type: "password", size: "sm", className: "[--input-pr:1.5rem]" },
      { type: "password", size: "md", className: "[--input-pr:2rem]" },
      { type: "password", size: "lg", className: "[--input-pr:2rem]" },
    ],
    defaultVariants: {
      validity: "initial",
      size: "md",
      disabled: false,
    },
  }
)

const inputVariants = cva(
  [
    // layout
    "flex-1",
    "min-w-0",

    // visual
    "bg-transparent",
    "text-word-primary",
    "outline-none",
    "appearance-none",
    "truncate",
    "rounded-[inherit]",

    // padding — right uses --input-px; left falls back to --input-px unless overridden (e.g. search sets --input-pl)
    "pr-(--input-pr,var(--input-px))",
    "pl-(--input-pl,var(--input-px))",

    // placeholder color — size set per variant
    "placeholder:text-word-placeholder",

    // disabled
    "disabled:cursor-not-allowed",

    // read-only
    "read-only:cursor-default",

    // hide number arrows (webkit)
    "[&::-webkit-outer-spin-button]:appearance-none",
    "[&::-webkit-inner-spin-button]:appearance-none",

    // hide search clear button (webkit)
    "[&::-webkit-search-cancel-button]:appearance-none",
  ],
  {
    variants: {
      size: {
        sm: ["text-sm", "placeholder:text-sm"],
        md: ["text-base", "placeholder:text-base"],
        lg: ["text-base", "placeholder:text-base"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export type InputProps = Pick<
  React.ComponentProps<"input">,
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
  | "autoCorrect"
  | "spellCheck"
  | "min"
  | "max"
  | "readOnly"
  | "maxLength"
  | "className"
> & {
  /** Input type @default "text" */
  type?: "text" | "search" | "email" | "number" | "url" | "password" | "tel"
  /** Height variant @default "md" */
  size?: "sm" | "md" | "lg"
  /** Shows a spinner replacing the search icon — only applies to type="search" */
  loading?: boolean
  /** Static text displayed before the input (e.g. "http://") */
  prefix?: string
  /** Static text displayed after the input (e.g. "@domain.com") */
  suffix?: string
  /**
   * Visual validity state. Overrides the `aria-invalid`-based detection.
   * Use for warning and success states beyond error.
   */
  validity?: "initial" | "error" | "warning" | "success"
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      className,
      type = "text",
      size = "md",
      disabled = false,
      loading = false,
      prefix,
      suffix,
      validity: validityProp,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      ...props
    },
    forwardedRef
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const field = useFieldControl({ props: { id } })

    const ariaInvalid = ariaInvalidProp ?? field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")
    const effectiveType = type === "password" && isPasswordVisible ? "text" : type

    return (
      <div className={cn(rootVariants({ type, size, disabled, validity }), className)}>
        {prefix && (
          <span
            className={cn(
              "flex items-center whitespace-nowrap select-none",
              "rounded-l-[inherit] border-r border-(--input-border-color)",
              "text-word-secondary/70 bg-surface-100/80 px-2",
              size === "sm" ? "text-sm" : "text-base"
            )}
          >
            {prefix}
          </span>
        )}

        <input
          ref={forwardedRef}
          id={field.id}
          type={effectiveType}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedByProp ?? field["aria-describedby"]}
          className={inputVariants({ size })}
          {...props}
        />

        {suffix && (
          <span
            className={cn(
              "flex items-center whitespace-nowrap select-none",
              "rounded-r-[inherit] border-l border-(--input-border-color)",
              "text-word-secondary/70 bg-surface-100/80 px-2",
              size === "sm" ? "text-sm" : "text-base"
            )}
          >
            {suffix}
          </span>
        )}

        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setIsPasswordVisible((v) => !v)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className={cn(
              "absolute top-1/2 right-2 flex -translate-y-1/2",
              "cursor-pointer items-center justify-center transition-colors",
              "text-word-placeholder hover:text-word-secondary"
            )}
          >
            <Icon
              name={isPasswordVisible ? "eye-open-fill" : "eye-closed-fill"}
              size={size === "sm" ? "sm" : "md"}
            />
          </button>
        )}

        {type === "search" && (
          <div
            className={cn(
              "top-1/2 left-2 flex -translate-y-1/2 items-center justify-center",
              "text-word-placeholder pointer-events-none absolute"
            )}
          >
            {loading ? (
              <Spinner size="sm" label="Loading" />
            ) : (
              <span className="text-word-secondary">
                <Icon name="search-outline" size="md" />
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
