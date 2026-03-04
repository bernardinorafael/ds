import React from "react"

import { Input } from "@/components/input"

type Currency = "BRL" | "EUR" | "USD"

const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string }> = {
  BRL: {
    symbol: "R$",
    locale: "pt-BR",
  },
  USD: {
    symbol: "$",
    locale: "en-US",
  },
  EUR: {
    symbol: "\u20AC",
    locale: "de-DE",
  },
}

function formatCents(cents: number, currency: Currency): string {
  if (cents === 0) return ""

  const { locale } = CURRENCY_CONFIG[currency]

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

function getPlaceholder(currency: Currency): string {
  const { locale } = CURRENCY_CONFIG[currency]

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(0)
}

export type CurrencyInputProps = Pick<
  React.ComponentProps<"input">,
  | "id"
  | "name"
  | "aria-label"
  | "aria-describedby"
  | "aria-invalid"
  | "required"
  | "disabled"
  | "autoFocus"
  | "readOnly"
  | "className"
  | "onFocus"
  | "onBlur"
> & {
  /** Currency code */
  currency: Currency
  /** Value in cents (integer). Ex: 1234 = R$ 12,34 */
  value: number
  /** Called with the new value in cents */
  onChange: (cents: number) => void
  /** Height variant @default "md" */
  size?: "sm" | "md" | "lg"
  /** Visual validity state */
  validity?: "initial" | "error" | "warning" | "success"
  /** Maximum value in cents @default 999_999_999_99 */
  max?: number
  /** Placeholder text. Defaults to locale-formatted zero (e.g. "0,00") */
  placeholder?: string
}

const MAX_DEFAULT = 999_999_999_99

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      currency,
      value,
      onChange,
      size,
      validity,
      max = MAX_DEFAULT,
      placeholder,
      ...props
    },
    forwardedRef
  ) => {
    const { symbol } = CURRENCY_CONFIG[currency]
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const setRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "")
        const newCents = parseInt(digits || "0", 10)

        if (newCents > max) return

        onChange(newCents)

        requestAnimationFrame(() => {
          const input = inputRef.current
          if (input) {
            const len = input.value.length
            input.setSelectionRange(len, len)
          }
        })
      },
      [max, onChange]
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault()
      },
      []
    )

    return (
      <Input
        ref={setRef}
        type="text"
        inputMode="numeric"
        prefix={symbol}
        value={formatCents(value, currency)}
        placeholder={placeholder ?? getPlaceholder(currency)}
        size={size}
        validity={validity}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"
