import { create } from "zustand"

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
// Toaster (placeholder — filled in Task 3)
// ---------------------------------------------------------------------------

export function Toaster() {
  return null
}
