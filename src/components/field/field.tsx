import React, { createContext, useContext, useId, useState } from "react"

import { cva } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Label } from "@/components/label"
import { cn } from "@/utils/cn"

export type FieldMessageIntent = "error" | "warning" | "success"

interface FieldMessage {
  id: string
  content?: React.ReactNode
  intent: FieldMessageIntent
}

interface FieldContextType {
  id: { root: string; control: string; description: string; message: string }
  hasDescription: boolean
  messages: FieldMessage[]
}

const FieldContext = createContext<FieldContextType | null>(null)

/**
 * Returns ARIA props to wire a form control inside a Field.
 * Spread the result onto your input/select/textarea.
 * Safe to call outside a Field — returns neutral defaults.
 */
export const useFieldControl = ({ props = {} }: { props?: { id?: string } } = {}) => {
  const context = useContext(FieldContext)

  if (!context) {
    return {
      id: props.id,
      "aria-describedby": undefined,
      "aria-invalid": undefined,
      messageIntent: null,
    }
  }

  const { id, hasDescription, messages } = context

  const hasMessage = messages.length > 0
  const hasError = messages.some((m) => m.intent === "error")
  const messageIntent = messages.length > 0 ? messages[0].intent : null

  const describedBy = [
    hasDescription ? id.description : null,
    hasMessage ? id.message : null,
  ]
    .filter(Boolean)
    .join(" ")

  return {
    id: props.id ?? id.control,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": hasError ? (true as const) : undefined,
    messageIntent,
  }
}

const messageVariants = cva(
  [
    // layout
    "flex",
    "gap-1",

    // typography
    "text-sm",
    "font-medium",

    // icon alignment
    "[&>svg]:mt-xs",
  ],
  {
    variants: {
      intent: {
        error: "text-destructive",
        warning: "text-orange-900",
        success: "text-green-900",
      },
    },
    defaultVariants: {
      intent: "error",
    },
  }
)

export type FieldProps = {
  /**
   * Unique ID for ARIA wiring. Auto-generated if omitted.
   */
  id?: string
  /**
   * Label text
   */
  label: string
  /**
   * Hides label visually while keeping it accessible
   */
  omitLabel?: boolean
  /**
   * Appends "Opcional" badge to label
   */
  optional?: boolean
  /**
   * Description text below the label
   */
  description?: React.ReactNode
  /**
   * Validation message
   */
  message?: React.ReactNode
  /**
   * Intent of the message
   * @default "error"
   */
  messageIntent?: FieldMessageIntent
  className?: string
  children?: React.ReactNode
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      id: idProp,
      label,
      omitLabel,
      optional,
      description,
      message,
      messageIntent: messageIntentProp = "error",
      className,
      children,
    },
    forwardedRef
  ) => {
    const autoId = useId()
    const rootId = idProp ?? autoId
    const prefersReducedMotion = useReducedMotion()

    const id = {
      root: rootId,
      control: `${rootId}-control`,
      description: `${rootId}-description`,
      message: `${rootId}-message`,
    }

    const [messageKey, setMessageKey] = useState<string | null>(null)
    const [prevMessage, setPrevMessage] = useState<React.ReactNode>(undefined)

    if (message !== prevMessage) {
      setPrevMessage(message)
      if (!message) {
        setMessageKey(null)
      } else if (!messageKey) {
        setMessageKey(crypto.randomUUID())
      }
    }

    const messages: FieldMessage[] =
      message && messageKey
        ? [{ id: messageKey, content: message, intent: messageIntentProp }]
        : []

    const transition = prefersReducedMotion ? { type: false as const } : { duration: 0.2 }

    return (
      <FieldContext.Provider value={{ id, hasDescription: !!description, messages }}>
        <div
          ref={forwardedRef}
          data-field=""
          className={cn("flex flex-col [--field-gap:0.5rem]", className)}
        >
          <div
            data-field-label=""
            className={cn(
              omitLabel &&
                "sr-only [&+[data-field-control]]:[--field-gap:0] [&+[data-field-description]]:[--field-gap:0]"
            )}
          >
            <Label htmlFor={id.control} optional={optional}>
              {label}
            </Label>

            {description && (
              <p
                id={id.description}
                data-field-description=""
                className="text-word-secondary text-sm"
              >
                {description}
              </p>
            )}
          </div>

          <div data-field-control="" className="mt-(--field-gap)">
            {children}
          </div>

          <div
            id={id.message}
            data-field-message=""
            aria-live="polite"
            className="[&>svg]:will-change-[filter]"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.p
                  key={msg.id}
                  initial={{ opacity: 0, filter: "blur(4px)", height: 0, marginTop: 0 }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    height: "auto",
                    marginTop: "var(--field-gap)",
                  }}
                  exit={{ opacity: 0, filter: "blur(4px)", height: 0, marginTop: 0 }}
                  transition={transition}
                  className={cn(messageVariants({ intent: msg.intent }))}
                >
                  {msg.content}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </FieldContext.Provider>
    )
  }
)

Field.displayName = "Field"
