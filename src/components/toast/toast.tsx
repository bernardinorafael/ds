import React, { forwardRef, useEffect, useMemo, useState } from "react"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { Check, X } from "lucide-react"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react"
import { create } from "zustand"

import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BasicEvent = {
  preventDefault: () => void
  stopPropagation: () => void
}

export type ToastIntent = "info" | "success" | "warning" | "error"

export type ToastAction = {
  label: string
  onClick?: (event: BasicEvent) => void
  form?: string
}

export type ToastOptions = {
  action?: ToastAction
  confirm?: ToastAction
  deny?: ToastAction
  confirmIcon?: ToastAction
  denyIcon?: ToastAction
  mutedAction?: ToastAction
  duration?: number
  disableCloseAction?: boolean
  jiggle?: boolean
  disabled?: boolean
  intent?: ToastIntent
}

interface ToastItem extends ToastOptions {
  id: string
  message: string
  intent: ToastIntent
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_TOASTS = 3

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface ToastStore {
  toasts: ToastItem[]
  addToast: (toast: ToastItem) => void
  removeToast: (id: string) => void
  updateToast: (id: string, opts: Partial<ToastOptions & { message?: string }>) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => {
      const next = [...state.toasts, toast]
      if (next.length > MAX_TOASTS) next.shift()
      return { toasts: next }
    }),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  updateToast: (id, opts) =>
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...opts, id } : t)),
    })),
}))

// ---------------------------------------------------------------------------
// Imperative API
// ---------------------------------------------------------------------------

function createToast(message: string, intent: ToastIntent, opts?: ToastOptions): string {
  const id = crypto.randomUUID()
  useToastStore.getState().addToast({ ...opts, id, message, intent })
  return id
}

export const toast = Object.assign(
  (message: string, opts?: ToastOptions) =>
    createToast(message, opts?.intent ?? "info", opts),
  {
    success: (message: string, opts?: ToastOptions) =>
      createToast(message, "success", opts),
    error: (message: string, opts?: ToastOptions) => createToast(message, "error", opts),
    warning: (message: string, opts?: ToastOptions) =>
      createToast(message, "warning", opts),
    dismiss: (id: string) => useToastStore.getState().removeToast(id),
    update: (id: string, opts?: Partial<ToastOptions & { message?: string }>) =>
      useToastStore.getState().updateToast(id, opts ?? {}),
  }
)

// ---------------------------------------------------------------------------
// Testing utilities (not exported from barrel)
// ---------------------------------------------------------------------------

export function __resetStore() {
  useToastStore.setState({ toasts: [] })
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function getIcon(intent: ToastIntent) {
  switch (intent) {
    case "info":
      return (
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="8"
            cy="8.0002"
            r="5.8"
            fill="#D9D9DE"
            fillOpacity="0.1"
            stroke="#D9D9DE"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 6.3998C8.44182 6.3998 8.8 6.04163 8.8 5.5998C8.8 5.15798 8.44182 4.7998 8 4.7998C7.55817 4.7998 7.2 5.15798 7.2 5.5998C7.2 6.04163 7.55817 6.3998 8 6.3998ZM8 7.9998C7.55817 7.9998 7.2 8.35798 7.2 8.7998V10.3998C7.2 10.8416 7.55817 11.1998 8 11.1998C8.44182 11.1998 8.8 10.8416 8.8 10.3998V8.7998C8.8 8.35798 8.44182 7.9998 8 7.9998Z"
            fill="#D9D9DE"
          />
        </svg>
      )
    case "success":
      return (
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.88">
            <path
              d="M13.8 8.0002C13.8 8.76186 13.65 9.51607 13.3585 10.2198C13.067 10.9234 12.6398 11.5628 12.1012 12.1014C11.5626 12.64 10.9232 13.0672 10.2196 13.3587C9.51587 13.6502 8.76166 13.8002 8 13.8002C7.23833 13.8002 6.48412 13.6502 5.78043 13.3587C5.07674 13.0672 4.43736 12.64 3.89878 12.1014C3.3602 11.5628 2.93297 10.9234 2.6415 10.2198C2.35002 9.51607 2.2 8.76186 2.2 8.0002C2.2 6.46194 2.81107 4.98669 3.89878 3.89898C4.98649 2.81127 6.46174 2.2002 8 2.2002C9.53825 2.2002 11.0135 2.81127 12.1012 3.89898C13.1889 4.98669 13.8 6.46194 13.8 8.0002Z"
              fill="#22C543"
              fillOpacity="0.16"
            />
            <path
              d="M6.06666 8.48353L7.51666 9.93353L9.93333 6.5502M13.8 8.0002C13.8 8.76186 13.65 9.51607 13.3585 10.2198C13.067 10.9234 12.6398 11.5628 12.1012 12.1014C11.5626 12.64 10.9232 13.0672 10.2196 13.3587C9.51587 13.6502 8.76166 13.8002 8 13.8002C7.23833 13.8002 6.48412 13.6502 5.78043 13.3587C5.07674 13.0672 4.43736 12.64 3.89878 12.1014C3.3602 11.5628 2.93297 10.9234 2.6415 10.2198C2.35002 9.51607 2.2 8.76186 2.2 8.0002C2.2 6.46194 2.81107 4.98669 3.89878 3.89898C4.98649 2.81127 6.46174 2.2002 8 2.2002C9.53825 2.2002 11.0135 2.81127 12.1012 3.89898C13.1889 4.98669 13.8 6.46194 13.8 8.0002Z"
              stroke="#22C543"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )
    case "warning":
      return (
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="7.99999"
            cy="7.9998"
            r="5.8"
            transform="rotate(-180 7.99999 7.9998)"
            fill="#F36B16"
            fillOpacity="0.12"
            stroke="#F36B16"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99999 9.6002C7.55816 9.6002 7.19999 9.95837 7.19999 10.4002C7.19999 10.842 7.55816 11.2002 7.99999 11.2002C8.44182 11.2002 8.79999 10.842 8.79999 10.4002C8.79999 9.95837 8.44182 9.6002 7.99999 9.6002ZM7.99999 8.0002C8.44182 8.0002 8.79999 7.64202 8.79999 7.2002L8.79999 5.6002C8.79999 5.15837 8.44182 4.8002 7.99999 4.8002C7.55816 4.8002 7.19999 5.15837 7.19999 5.6002L7.19999 7.2002C7.19999 7.64202 7.55816 8.0002 7.99999 8.0002Z"
            fill="#F36B16"
          />
        </svg>
      )
    case "error":
      return (
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.88">
            <path
              d="M9.82299 2.2002H6.17704C5.75269 2.2002 5.34573 2.36877 5.04567 2.66882L2.66864 5.04585C2.36858 5.34591 2.20001 5.75288 2.20001 6.17722V9.82317C2.20001 10.2475 2.36858 10.6545 2.66864 10.9545L5.04567 13.3316C5.34573 13.6316 5.75269 13.8002 6.17704 13.8002H9.82298C10.2473 13.8002 10.6543 13.6316 10.9544 13.3316L13.3314 10.9545C13.6314 10.6545 13.8 10.2475 13.8 9.82317V6.17722C13.8 5.75288 13.6314 5.34591 13.3314 5.04585L10.9544 2.66882C10.6543 2.36877 10.2473 2.2002 9.82299 2.2002Z"
              fill="#EF4444"
              fillOpacity="0.16"
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.00001 9.6002C8.44184 9.6002 8.80001 9.95837 8.80001 10.4002C8.80001 10.842 8.44184 11.2002 8.00001 11.2002C7.55818 11.2002 7.20001 10.842 7.20001 10.4002C7.20001 9.95837 7.55818 9.6002 8.00001 9.6002ZM8.00001 8.0002C7.55818 8.0002 7.20001 7.64202 7.20001 7.2002V5.6002C7.20001 5.15837 7.55818 4.8002 8.00001 4.8002C8.44184 4.8002 8.80001 5.15837 8.80001 5.6002V7.2002C8.80001 7.64202 8.44184 8.0002 8.00001 8.0002Z"
              fill="#EF4444"
            />
          </g>
        </svg>
      )
  }
}

// ---------------------------------------------------------------------------
// ToastButton
// ---------------------------------------------------------------------------

const toastButtonVariants = cva(
  [
    // layout
    "group",
    "relative",
    "inline-flex",
    "h-[1.75rem]",
    "select-none",
    "items-center",
    "justify-center",
    "rounded-full",
    "overflow-hidden",

    // visual
    "border",
    "border-[--button-color-border]",
    "bg-[--button-color-bg]",
    "text-sm",
    "font-medium",
    "shadow-[0_1.5px_2px_0_rgba(0,0,0,0.48)]",

    // transitions
    "transition",

    // focus
    "outline-none",
    "focus-visible:ring-[0.1875rem]",
    "focus-visible:ring-[--button-color-ring]",
  ],
  {
    variants: {
      intent: {
        action: [
          "[--button-color-bg:var(--color-gray-700)]",
          "[--button-color-text:var(--color-white)]",
          "[--button-text-shadow:0px_1px_1px_rgba(0,0,0,0.6)]",
          "[--button-color-border:rgba(255,255,255,0.1)]",
          "[--button-color-ring:rgba(0,0,0,0.4)]",
        ],
        confirm: [
          "[--button-color-bg:var(--color-green-900)]",
          "[--button-color-text:var(--color-white)]",
          "[--button-text-shadow:0px_1px_1px_rgba(0,0,0,0.6)]",
          "[--button-color-border:rgba(255,255,255,0.1)]",
          "[--button-color-ring:rgba(34,197,67,0.4)]",
        ],
        deny: [
          "[--button-color-bg:var(--color-red-900)]",
          "[--button-color-text:var(--color-white)]",
          "[--button-text-shadow:0px_1px_1px_rgba(0,0,0,0.6)]",
          "[--button-color-border:rgba(255,255,255,0.1)]",
          "[--button-color-ring:rgba(239,68,68,0.4)]",
        ],
        mutedAction: [
          "[--button-color-bg:transparent]",
          "[--button-color-text:var(--color-gray-500)]",
          "[--button-text-shadow:0px_1px_1px_rgba(0,0,0,0.6)]",
          "[--button-color-border:transparent]",
          "[--button-color-ring:rgba(0,0,0,0.4)]",
          "hover:[--button-color-text:var(--color-gray-100)]",
          "shadow-none",
        ],
      },
      contentType: {
        text: "px-2",
        icon: "w-[1.75rem] p-0 [&_svg]:mx-auto",
      },
      disabled: {
        true: "cursor-not-allowed opacity-75",
        false: "",
      },
    },
    compoundVariants: [
      {
        contentType: "text",
        intent: ["action", "mutedAction", "confirm", "deny"],
        className: "min-w-[3.25rem]",
      },
    ],
    defaultVariants: {
      intent: "action",
      contentType: "text",
      disabled: false,
    },
  }
)

function ToastButton({
  onClick,
  children,
  intent,
  className,
  disabled,
  form,
  contentType = "text",
}: {
  onClick?: (event: BasicEvent) => void
  children: React.ReactNode
  intent: "action" | "confirm" | "deny" | "mutedAction"
  className?: string
  disabled?: boolean
  form?: string
  contentType?: "text" | "icon"
}) {
  return (
    <button
      className={cn(
        toastButtonVariants({ intent, contentType, disabled: !!disabled }),
        className
      )}
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
      form={form}
      type={form ? "submit" : "button"}
    >
      <span className="flex text-[--button-color-text] drop-shadow-[--button-text-shadow] transition-colors">
        {children}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

const jiggleAnimation = {
  rotate: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
  transition: { duration: 1, type: "tween" as const },
}

const Toast = forwardRef<HTMLLIElement, { toast: ToastItem }>(function Toast(
  { toast: t },
  ref
) {
  const [jiggle, setJiggle] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    return useToastStore.subscribe((state, prev) => {
      const curr = state.toasts.find((item) => item.id === t.id)
      const prevItem = prev.toasts.find((item) => item.id === t.id)
      if (curr?.jiggle && !curr.disabled && !prevItem?.jiggle) {
        setJiggle((j) => j + 1)
      }
    })
  }, [t.id])

  useEffect(() => {
    if (t.duration === Infinity || isHovering) return

    const timeout = setTimeout(() => {
      useToastStore.getState().removeToast(t.id)
    }, t.duration || 3000)

    return () => clearTimeout(timeout)
  }, [t.id, t.duration, isHovering])

  const resolvedActionCallback = useMemo(() => {
    if (t.action) return t.action.onClick
    if (t.confirmIcon) return t.confirmIcon.onClick
    if (t.confirm) return t.confirm.onClick
    return undefined
  }, [t.action, t.confirmIcon, t.confirm])

  const { cancel, action } = useMemo(() => {
    const buttons: { action?: React.ReactNode; cancel?: React.ReactNode } = {}

    if (t.confirm) {
      buttons.action = (
        <ToastButton
          intent="confirm"
          onClick={t.confirm.onClick}
          form={t.confirm.form}
          disabled={t.disabled}
        >
          {t.confirm.label}
        </ToastButton>
      )
    }

    if (t.deny) {
      buttons.cancel = (
        <ToastButton
          intent="deny"
          onClick={t.deny.onClick}
          form={t.deny.form}
          disabled={t.disabled}
        >
          {t.deny.label}
        </ToastButton>
      )
    }

    if (t.confirmIcon) {
      buttons.action = (
        <ToastButton
          intent="confirm"
          onClick={t.confirmIcon.onClick}
          contentType="icon"
          form={t.confirmIcon.form}
          disabled={t.disabled}
        >
          <Check aria-label={t.confirmIcon.label} size={16} />
        </ToastButton>
      )
    }

    if (t.denyIcon) {
      buttons.cancel = (
        <ToastButton
          intent="deny"
          onClick={t.denyIcon.onClick}
          contentType="icon"
          form={t.denyIcon.form}
          disabled={t.disabled}
        >
          <X aria-label={t.denyIcon.label} size={16} />
        </ToastButton>
      )
    }

    if (t.action) {
      buttons.action = (
        <ToastButton
          intent="action"
          disabled={t.disabled}
          form={t.action.form}
          onClick={t.action.onClick}
        >
          {t.action.label}
        </ToastButton>
      )
    }

    if (t.mutedAction) {
      buttons.cancel = (
        <ToastButton
          intent="mutedAction"
          disabled={t.disabled}
          onClick={t.mutedAction.onClick}
          form={t.mutedAction.form}
        >
          {t.mutedAction.label}
        </ToastButton>
      )
    }

    return buttons
  }, [t])

  useEffect(() => {
    if (!resolvedActionCallback) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        resolvedActionCallback(event)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [resolvedActionCallback])

  const enterAnimation = prefersReducedMotion
    ? { opacity: 0 }
    : { filter: "blur(3px)", opacity: 0, scale: 0.9, y: 64 }

  const animateAnimation = prefersReducedMotion
    ? { opacity: 1 }
    : { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 }

  const exitAnimation = prefersReducedMotion
    ? { opacity: 0, transition: { duration: 0.2 } }
    : { filter: "blur(3px)", opacity: 0, transition: { duration: 0.2 }, zIndex: -1 }

  return (
    <ToastPrimitive.Root forceMount asChild>
      <motion.li
        ref={ref}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        initial={enterAnimation}
        animate={animateAnimation}
        exit={exitAnimation}
        transition={{ bounce: 0, duration: 0.5, type: "spring" }}
        layout
        className="pointer-events-auto relative mx-auto w-fit rounded-full"
      >
        <motion.div
          key={jiggle}
          onAnimationComplete={() => {
            setJiggle(0)
            useToastStore.getState().updateToast(t.id, { jiggle: false })
          }}
          animate={jiggle && !prefersReducedMotion ? jiggleAnimation : {}}
          className={cn(
            "mx-auto flex min-h-10 w-fit min-w-[21.25rem] items-center rounded-[20px]",
            "from-gray-1100 to-gray-1200 bg-gradient-to-b pr-2 pl-3 text-white",
            "shadow-xl shadow-black/25",
            "before:pointer-events-none before:absolute before:inset-px before:rounded-full",
            "before:shadow-[inset_0_1px_0] before:shadow-white/6"
          )}
        >
          <div className="mr-2 flex items-center">{getIcon(t.intent)}</div>
          <ToastPrimitive.Description className="my-2 pr-2.5 font-light">
            {t.message}
          </ToastPrimitive.Description>
          {(action || cancel) && (
            <div className="ml-auto flex items-center gap-1.5 whitespace-nowrap">
              {cancel && (
                <ToastPrimitive.Close
                  onClick={() => {
                    if (!t.disableCloseAction) {
                      useToastStore.getState().removeToast(t.id)
                    }
                  }}
                  asChild
                >
                  {cancel}
                </ToastPrimitive.Close>
              )}
              {action && (
                <ToastPrimitive.Action
                  altText="Press cmd + enter or ctrl + enter to trigger this action"
                  asChild
                >
                  {action}
                </ToastPrimitive.Action>
              )}
            </div>
          )}
        </motion.div>
      </motion.li>
    </ToastPrimitive.Root>
  )
})

// ---------------------------------------------------------------------------
// BlurOverlay
// ---------------------------------------------------------------------------

function BlurOverlay() {
  return (
    <div className="pointer-events-none fixed bottom-0 left-1/2 isolate z-1 h-64 w-[800px] -translate-x-1/2 translate-y-24">
      {Array.from({ length: 5 }, (_, i) => {
        const blur = `blur(${Math.pow(2, i - 1)}px)`
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              WebkitBackdropFilter: blur,
              backdropFilter: blur,
            }}
            transition={{ bounce: 0, duration: 0.5, type: "spring" }}
            className="absolute inset-0 rotate-180 [mask-image:radial-gradient(closest-side,black,transparent)] [mask-position:bottom,center] [mask-repeat:no-repeat]"
          />
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toaster
// ---------------------------------------------------------------------------

export const Toaster = forwardRef<HTMLOListElement, Record<string, never>>(
  function Toaster(_, forwardedRef) {
    const toasts = useToastStore((s) => s.toasts)
    const hasToasts = toasts.length > 0
    const prefersReducedMotion = useReducedMotion()

    return (
      <ToastPrimitive.Provider>
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <Toast key={t.id} toast={t} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {hasToasts && !prefersReducedMotion ? <BlurOverlay /> : null}
          </AnimatePresence>
        </LayoutGroup>

        <ToastPrimitive.Viewport
          ref={forwardedRef}
          className={cn(
            "pointer-events-none fixed bottom-8 left-1/2 z-1",
            "flex w-full -translate-x-1/2 flex-col gap-3"
          )}
        />
      </ToastPrimitive.Provider>
    )
  }
)

Toaster.displayName = "Toaster"
