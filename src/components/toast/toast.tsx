import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"
import { create } from "zustand"

import { cn } from "@/utils/cn"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastIntent = "error" | "success" | "warning" | "info"

export type ToastAction = {
  label: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  form?: string
  disabled?: boolean
}

export type ToastOptions = {
  duration?: number
  action?: ToastAction
  cancel?: ToastAction
}

type ToastItem = ToastOptions & {
  id: string
  intent: ToastIntent
  message: string
  jingle?: number
}

// ─── Store ────────────────────────────────────────────────────────────────────

const TOAST_LIMIT = 3

const useToastStore = create<{
  toasts: ToastItem[]
  add: (toast: ToastItem) => void
  remove: (id: string) => void
  update: (id: string, updates: Partial<ToastItem>) => void
  dismissAll: () => void
}>((set) => ({
  toasts: [],
  add: (toast) =>
    set(({ toasts }) => {
      const next = [...toasts, toast]
      return { toasts: next.slice(-TOAST_LIMIT) }
    }),
  remove: (id) => set(({ toasts }) => ({ toasts: toasts.filter((t) => t.id !== id) })),
  update: (id, updates) =>
    set(({ toasts }) => ({
      toasts: toasts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  dismissAll: () => set({ toasts: [] }),
}))

const { add, remove, update } = useToastStore.getState()

// ─── Intent Icons ─────────────────────────────────────────────────────────────

function ToastIcon({ intent }: { intent: ToastIntent }) {
  const props = {
    "aria-hidden": true as const,
    width: 20,
    height: 20,
    viewBox: "0 0 16 16",
    fill: "none",
  }

  switch (intent) {
    case "info":
      return (
        <svg {...props}>
          <circle
            cx="8"
            cy="8"
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
            d="M8 6.4a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Zm0 1.6a.8.8 0 0 0-.8.8v1.6a.8.8 0 0 0 1.6 0V8.8A.8.8 0 0 0 8 8Z"
            fill="#D9D9DE"
          />
        </svg>
      )
    case "success":
      return (
        <svg {...props}>
          <g opacity="0.88">
            <path
              d="M13.8 8a5.8 5.8 0 1 1-11.6 0 5.8 5.8 0 0 1 11.6 0Z"
              fill="#22C543"
              fillOpacity="0.16"
            />
            <path
              d="M6.067 8.484l1.45 1.45 2.416-3.384M13.8 8a5.8 5.8 0 1 1-11.6 0 5.8 5.8 0 0 1 11.6 0Z"
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
        <svg {...props}>
          <circle
            cx="8"
            cy="8"
            r="5.8"
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
            d="M8 9.6a.8.8 0 0 0-.8.8.8.8 0 0 0 1.6 0 .8.8 0 0 0-.8-.8Zm0-1.6a.8.8 0 0 0 .8-.8V5.6a.8.8 0 0 0-1.6 0v1.6a.8.8 0 0 0 .8.8Z"
            fill="#F36B16"
          />
        </svg>
      )
    case "error":
      return (
        <svg {...props}>
          <g opacity="0.88">
            <path
              d="M9.823 2.2H6.177a1.6 1.6 0 0 0-1.131.469L2.669 5.046A1.6 1.6 0 0 0 2.2 6.177v3.646a1.6 1.6 0 0 0 .469 1.131l2.377 2.377a1.6 1.6 0 0 0 1.131.469h3.646a1.6 1.6 0 0 0 1.131-.469l2.377-2.377a1.6 1.6 0 0 0 .469-1.131V6.177a1.6 1.6 0 0 0-.469-1.131l-2.377-2.377a1.6 1.6 0 0 0-1.131-.469Z"
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
              d="M8 9.6a.8.8 0 0 0-.8.8.8.8 0 0 0 1.6 0 .8.8 0 0 0-.8-.8Zm0-1.6a.8.8 0 0 0 .8-.8V5.6a.8.8 0 0 0-1.6 0v1.6a.8.8 0 0 0 .8.8Z"
              fill="#EF4444"
            />
          </g>
        </svg>
      )
  }
}

// ─── Toast Button ─────────────────────────────────────────────────────────────

const toastButtonVariants = cva(
  [
    // layout
    "inline-flex",
    "items-center",
    "justify-center",

    // visual
    "rounded-full",
    "text-sm",
    "font-medium",
    "h-7",
    "px-3",
    "cursor-pointer",
    "select-none",

    // transitions
    "transition-colors",
    "duration-150",

    // focus states
    "outline-none",
    "focus-visible:ring-[3px]",
    "focus-visible:ring-(--focus-ring-color)",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-(--focus-offset-color)",

    // disabled states
    "disabled:cursor-not-allowed",
    "disabled:opacity-75",
  ],
  {
    variants: {
      intent: {
        action: [
          "bg-primary",
          "text-primary-foreground",
          "not-disabled:hover:bg-primary/90",
          "[--focus-ring-color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
          "[--focus-offset-color:var(--color-primary)]",
        ],
        cancel: [
          "bg-white/15",
          "text-white/80",
          "not-disabled:hover:bg-white/20",
          "not-disabled:hover:text-white",
          "[--focus-ring-color:rgb(255_255_255/0.2)]",
          "[--focus-offset-color:rgb(255_255_255/0.15)]",
        ],
      },
    },
    defaultVariants: {
      intent: "action",
    },
  }
)

function ToastButton({
  onClick,
  children,
  intent,
  disabled,
  form,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  intent: "action" | "cancel"
  disabled?: boolean
  form?: string
}) {
  return (
    <button
      form={form}
      disabled={disabled}
      type={form ? "submit" : "button"}
      className={toastButtonVariants({ intent })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toast: t }: { toast: ToastItem }) {
  const [isPaused, setIsPaused] = useState(false)
  const remainingRef = useRef(t.duration ?? 2000)
  const startRef = useRef(0)

  useEffect(() => {
    remainingRef.current = t.duration ?? 2000
  }, [t.duration])

  useEffect(() => {
    if (t.duration === Infinity || isPaused) return

    startRef.current = Date.now()
    const timeout = setTimeout(() => remove(t.id), remainingRef.current)

    return () => {
      clearTimeout(timeout)
      const elapsed = Date.now() - startRef.current
      remainingRef.current = Math.max(0, remainingRef.current - elapsed)
    }
  }, [t.id, t.duration, isPaused])

  return (
    <ToastPrimitive.Root forceMount asChild duration={Infinity}>
      <motion.li
        tabIndex={-1}
        layout
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 64,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.5,
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          y: 64,
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.3,
          },
        }}
        className="pointer-events-auto relative mx-auto w-fit"
      >
        <motion.div
          key={t.jingle}
          animate={
            t.jingle
              ? {
                  rotate: [0, -5, 5, -4, 4, -3, 3, -2, 2, 0],
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut",
                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                  },
                }
              : {}
          }
          onAnimationComplete={() => {
            if (t.jingle) update(t.id, { jingle: 0 })
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={cn(
            "mx-auto flex h-11 w-fit items-center rounded-full pr-2.5 pl-3 text-base text-white",
            "bg-gray-1200 shadow-xl shadow-black/25",
            "before:pointer-events-none before:absolute before:inset-px before:rounded-full",
            "before:shadow-[inset_0_1px_0_rgb(255_255_255/0.1)]"
          )}
        >
          <span className="mr-2 flex items-center">
            <ToastIcon intent={t.intent} />
          </span>

          <ToastPrimitive.Description className="my-2 pr-2.5 font-medium">
            {t.message}
          </ToastPrimitive.Description>

          {(t.action || t.cancel) && (
            <div className="ml-auto flex items-center gap-1.5 whitespace-nowrap">
              {t.cancel && (
                <ToastButton
                  intent="cancel"
                  disabled={t.cancel.disabled}
                  form={t.cancel.form}
                  onClick={(e) => {
                    t.cancel?.onClick?.(e)
                    remove(t.id)
                  }}
                >
                  {t.cancel.label}
                </ToastButton>
              )}

              {t.action && (
                <ToastPrimitive.Action altText={t.action.label} asChild>
                  <ToastButton
                    intent="action"
                    disabled={t.action.disabled}
                    form={t.action.form}
                    onClick={(e) => {
                      t.action?.onClick?.(e)
                      remove(t.id)
                    }}
                  >
                    {t.action.label}
                  </ToastButton>
                </ToastPrimitive.Action>
              )}
            </div>
          )}
        </motion.div>
      </motion.li>
    </ToastPrimitive.Root>
  )
}

// ─── Toaster ──────────────────────────────────────────────────────────────────

let activeToasterId: string | null = null

export function Toaster() {
  const [id] = useState(() => crypto.randomUUID())
  const [isOwner, setIsOwner] = useState(false)
  const toasts = useToastStore((s) => s.toasts)
  const { dismissAll } = useToastStore.getState()

  useEffect(() => {
    if (activeToasterId === null) {
      activeToasterId = id
      setIsOwner(true)
    }
    return () => {
      if (activeToasterId === id) {
        activeToasterId = null
        dismissAll()
      }
    }
  }, [id, dismissAll])

  if (!isOwner) return null

  return createPortal(
    <ToastPrimitive.Provider>
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </AnimatePresence>

      <ToastPrimitive.Viewport
        className={cn(
          "pointer-events-none fixed bottom-8 left-1/2 z-50",
          "flex w-full -translate-x-1/2 flex-col gap-3"
        )}
      />
    </ToastPrimitive.Provider>,
    document.body
  )
}

// ─── Public API ───────────────────────────────────────────────────────────────

function createToast(
  message: string,
  intent: ToastIntent,
  options: ToastOptions & { id?: string } = {}
): string {
  const { id = crypto.randomUUID(), ...rest } = options

  const existing = useToastStore.getState().toasts.find((t) => t.id === id)
  if (existing) {
    update(id, { ...rest, message, intent })
    update(id, { jingle: (existing.jingle ?? 0) + 1 })
    return id
  }

  add({ ...rest, message, id, intent })
  return id
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions & { id?: string }) =>
    createToast(message, "info", options),
  {
    success: (message: string, options?: ToastOptions & { id?: string }) =>
      createToast(message, "success", options),
    error: (message: string, options?: ToastOptions & { id?: string }) =>
      createToast(message, "error", options),
    warning: (message: string, options?: ToastOptions & { id?: string }) =>
      createToast(message, "warning", options),
    info: (message: string, options?: ToastOptions & { id?: string }) =>
      createToast(message, "info", options),
    jingle: (id: string) =>
      update(id, {
        jingle:
          (useToastStore.getState().toasts.find((t) => t.id === id)?.jingle ?? 0) + 1,
      }),
    dismiss: (id: string) => remove(id),
    dismissAll: () => useToastStore.getState().dismissAll(),
    get: (id: string) => useToastStore.getState().toasts.find((t) => t.id === id),
  }
)
