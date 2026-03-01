# Toast Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Toast notification component with Zustand state, Radix primitives, motion/react animations, and an imperative `toast()` API.

**Architecture:** Zustand store manages a max-3 toast queue. `<Toaster />` renders inside the DS `<Provider>`. Each toast is a Radix `Toast.Root` with motion/react entry/exit/jiggle animations. The `toast` object provides `.success()`, `.error()`, `.warning()`, `.update()`, `.dismiss()` methods.

**Tech Stack:** React 19, Zustand 5, @radix-ui/react-toast, motion/react, class-variance-authority, Tailwind CSS v4

**Design doc:** `docs/plans/2026-03-01-toast-design.md`

---

### Task 1: Create barrel export and types

**Files:**

- Create: `src/components/toast/index.ts`
- Create: `src/components/toast/toast.tsx` (types only for now)

**Step 1: Create the barrel export**

```ts
// src/components/toast/index.ts
export {
  Toaster,
  toast,
  type ToastIntent,
  type ToastAction,
  type ToastOptions,
} from "./toast"
```

**Step 2: Create toast.tsx with types and Zustand store skeleton**

```tsx
// src/components/toast/toast.tsx
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
// Toaster (placeholder — Task 2 fills this in)
// ---------------------------------------------------------------------------

export function Toaster() {
  return null
}
```

**Step 3: Verify types compile**

Run: `pnpm exec tsc -b`
Expected: no errors

**Step 4: Commit**

```bash
git add src/components/toast/
git commit -m "feat(toast): add types, Zustand store, and imperative API"
```

---

### Task 2: Write unit tests for the store and imperative API

**Files:**

- Create: `src/components/toast/toast.test.tsx`

**Step 1: Write tests for the Zustand store and toast API**

```tsx
// src/components/toast/toast.test.tsx
import { act } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { toast, Toaster } from "@/components/toast"

// Mock motion/react to avoid animation complexity
vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    li: "li",
    div: "div",
  },
  useReducedMotion: () => false,
}))

// Clear toasts between tests by dismissing all
function clearToasts() {
  // Access store directly
  const { toasts } = require("zustand").default.getState?.() ?? {}
  // Safer: just render nothing and re-render
}

describe("toast API", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  afterEach(() => {
    // Dismiss all toasts after each test
    act(() => {
      // We'll need to clear the store — addressed in Step 2
    })
  })

  it("should render a toast with message", () => {
    render(<Toaster />)
    act(() => {
      toast("Hello world")
    })
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("should render correct icon per intent", () => {
    render(<Toaster />)
    act(() => {
      toast.success("Success msg")
    })
    // Success icon has a specific SVG — check aria-hidden svg is present
    const toastEl = screen.getByText("Success msg").closest("li")
    expect(toastEl?.querySelector("svg")).toBeInTheDocument()
  })

  it("should render action button", () => {
    render(<Toaster />)
    act(() => {
      toast("With action", { action: { label: "Undo" } })
    })
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
  })

  it("should render confirm and deny buttons", () => {
    render(<Toaster />)
    act(() => {
      toast("Confirm?", {
        confirm: { label: "Yes" },
        deny: { label: "No" },
      })
    })
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument()
  })

  it("should render icon buttons", () => {
    render(<Toaster />)
    act(() => {
      toast("Delete?", {
        confirmIcon: { label: "Confirm delete" },
        denyIcon: { label: "Cancel delete" },
      })
    })
    expect(screen.getByLabelText("Confirm delete")).toBeInTheDocument()
    expect(screen.getByLabelText("Cancel delete")).toBeInTheDocument()
  })

  it("should render muted action", () => {
    render(<Toaster />)
    act(() => {
      toast("Done", { mutedAction: { label: "Copy link" } })
    })
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument()
  })

  it("should auto-dismiss after duration", async () => {
    vi.useFakeTimers()
    render(<Toaster />)
    act(() => {
      toast("Bye", { duration: 1000 })
    })
    expect(screen.getByText("Bye")).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(screen.queryByText("Bye")).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it("should not auto-dismiss with Infinity duration", async () => {
    vi.useFakeTimers()
    render(<Toaster />)
    act(() => {
      toast("Stay", { duration: Infinity })
    })
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(screen.getByText("Stay")).toBeInTheDocument()
    vi.useRealTimers()
  })

  it("should dismiss programmatically", () => {
    render(<Toaster />)
    let id: string
    act(() => {
      id = toast("Dismiss me")
    })
    expect(screen.getByText("Dismiss me")).toBeInTheDocument()
    act(() => {
      toast.dismiss(id!)
    })
    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument()
  })

  it("should update existing toast", () => {
    render(<Toaster />)
    let id: string
    act(() => {
      id = toast("Loading...")
    })
    expect(screen.getByText("Loading...")).toBeInTheDocument()
    act(() => {
      toast.update(id!, { message: "Done!" })
    })
    expect(screen.getByText("Done!")).toBeInTheDocument()
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
  })

  it("should limit to 3 toasts", () => {
    render(<Toaster />)
    act(() => {
      toast("First")
      toast("Second")
      toast("Third")
      toast("Fourth")
    })
    expect(screen.queryByText("First")).not.toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
    expect(screen.getByText("Third")).toBeInTheDocument()
    expect(screen.getByText("Fourth")).toBeInTheDocument()
  })

  it("should disable button when disabled", () => {
    render(<Toaster />)
    act(() => {
      toast("Disabled", {
        disabled: true,
        action: { label: "Click" },
      })
    })
    expect(screen.getByRole("button", { name: "Click" })).toBeDisabled()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/components/toast/toast.test.tsx`
Expected: FAIL — `Toaster` renders null, so no toasts appear in DOM

**Step 3: Commit the failing tests**

```bash
git add src/components/toast/toast.test.tsx
git commit -m "test(toast): add unit tests for Toast component"
```

---

### Task 3: Implement the Toaster and Toast components

**Files:**

- Modify: `src/components/toast/toast.tsx`

**Step 1: Add icon functions, Toast component, ToastButton, BlurOverlay, and Toaster**

Replace the `Toaster` placeholder in `toast.tsx` with the full implementation. Port from the prototype with these adaptations:

- Replace `cx()` with `cn()` from `@/utils/cn`
- Replace `cva` import from `cva` to `class-variance-authority`
- Use `useReducedMotion` from `motion/react` for accessibility
- Add `React.forwardRef` + `displayName` on `Toaster`
- Keep `Toast` and `ToastButton` as internal (not exported)
- The icon SVGs are inline (from prototype), not the DS Icon component
- Add icon for `confirmIcon`/`denyIcon` using lucide-react `Check` and `X` icons

Full implementation structure (add below the existing code, replacing the Toaster placeholder):

```tsx
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { Check, X } from "lucide-react"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react"
import { create } from "zustand"

import { cn } from "@/utils/cn"
```

Key implementation details:

- `getIcon(intent)` returns the inline SVGs from the prototype
- `ToastButton` uses `cva` with CSS custom properties per intent (from design doc)
- `Toast` handles: hover pause, auto-dismiss timer, jiggle, Cmd+Enter shortcut
- `Toaster` wraps `ToastPrimitive.Provider` + `LayoutGroup` + `AnimatePresence`
- `BlurOverlay` is the 5-layer progressive backdrop-filter
- `useReducedMotion()` disables blur/scale/jiggle, keeps opacity transitions

The toast animations:

- **Enter**: `{ filter: "blur(3px)", opacity: 0, scale: 0.9, y: 64 }` → `{ filter: "blur(0px)", opacity: 1, scale: 1, y: 0 }` with `{ type: "spring", bounce: 0, duration: 0.5 }`
- **Exit**: `{ filter: "blur(3px)", opacity: 0, zIndex: -1 }` with `{ duration: 0.2 }`
- **Jiggle**: `rotate: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0]` with `{ duration: 1, type: "tween" }`
- **Reduced motion**: enter/exit use opacity only, jiggle is skipped, blur overlay hidden

The `Toaster` component:

```tsx
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
            "pointer-events-none",
            "fixed",
            "bottom-8",
            "left-1/2",
            "z-1",
            "flex",
            "w-full",
            "-translate-x-1/2",
            "flex-col",
            "gap-3"
          )}
        />
      </ToastPrimitive.Provider>
    )
  }
)

Toaster.displayName = "Toaster"
```

**Step 2: Run tests**

Run: `pnpm test -- src/components/toast/toast.test.tsx`
Expected: All tests PASS

**Step 3: Verify types compile**

Run: `pnpm exec tsc -b`
Expected: no errors

**Step 4: Commit**

```bash
git add src/components/toast/toast.tsx
git commit -m "feat(toast): implement Toaster, Toast, and ToastButton components"
```

---

### Task 4: Integrate Toaster into Provider

**Files:**

- Modify: `src/components/provider/provider.tsx`

**Step 1: Add Toaster import and render inside Provider**

```tsx
// src/components/provider/provider.tsx
import { IconSprite } from "@/components/icon"
import { Toaster } from "@/components/toast"
import { TooltipProvider } from "@/components/tooltip"

type ProviderProps = {
  /**
   * App content
   */
  children: React.ReactNode
}

/**
 * Root provider for the DS. Add once at the top of your app tree.
 *
 * Handles global setup:
 * - `TooltipProvider` — enables instant skip-delay transitions between tooltips
 * - `IconSprite` — injects the SVG sprite required by all `Icon` and `IconButton` components
 * - `Toaster` — renders toast notifications triggered via the `toast()` API
 */
export function Provider({ children }: ProviderProps) {
  return (
    <TooltipProvider>
      <IconSprite />
      <Toaster />
      {children}
    </TooltipProvider>
  )
}
```

**Step 2: Verify types compile**

Run: `pnpm exec tsc -b`
Expected: no errors

**Step 3: Run all tests to check nothing broke**

Run: `pnpm test`
Expected: all tests PASS

**Step 4: Commit**

```bash
git add src/components/provider/provider.tsx
git commit -m "feat(provider): integrate Toaster into Provider"
```

---

### Task 5: Write Storybook stories

**Files:**

- Create: `src/components/toast/toast.stories.tsx`

**Step 1: Write stories**

Stories need a wrapper that renders `<Toaster />` and trigger buttons. Each story uses `render` with buttons that call the `toast` API on click.

```tsx
// src/components/toast/toast.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"

import { toast, Toaster } from "@/components/toast"

function ToastStoryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">{children}</div>
    </>
  )
}

function TriggerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-gray-1200 rounded-md px-3 py-1.5 text-sm font-medium text-white"
    >
      {label}
    </button>
  )
}

const meta = {
  title: "Toast",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton label="Info" onClick={() => toast("This is an info message")} />
      <TriggerButton
        label="Success"
        onClick={() => toast.success("Operation completed")}
      />
      <TriggerButton
        label="Warning"
        onClick={() => toast.warning("Approaching rate limit")}
      />
      <TriggerButton label="Error" onClick={() => toast.error("Something went wrong")} />
    </ToastStoryWrapper>
  ),
}

export const WithAction: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show toast with action"
        onClick={() =>
          toast.success("Item created", {
            action: { label: "Undo", onClick: () => toast("Undone!") },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const WithConfirmDeny: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show confirm/deny toast"
        onClick={() =>
          toast("Unsaved changes", {
            duration: Infinity,
            confirm: { label: "Save", onClick: () => toast.success("Saved!") },
            deny: { label: "Discard", onClick: () => toast("Discarded") },
            disableCloseAction: true,
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const WithIconButtons: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show icon button toast"
        onClick={() =>
          toast("Delete this item?", {
            duration: Infinity,
            confirmIcon: { label: "Confirm", onClick: () => toast.success("Deleted") },
            denyIcon: { label: "Cancel" },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const WithMutedAction: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show muted action toast"
        onClick={() =>
          toast.success("File exported", {
            action: { label: "Open", onClick: () => toast("Opening...") },
            mutedAction: { label: "Copy link", onClick: () => toast("Link copied!") },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const AutoDismiss: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show toast (3s auto-dismiss)"
        onClick={() => toast("This will disappear in 3 seconds")}
      />
      <TriggerButton
        label="Show toast (1s auto-dismiss)"
        onClick={() => toast("Quick flash", { duration: 1000 })}
      />
    </ToastStoryWrapper>
  ),
}

export const Persistent: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show persistent toast"
        onClick={() =>
          toast("This toast stays until dismissed", {
            duration: Infinity,
            action: {
              label: "Dismiss",
              onClick: () => {
                /* Radix close handles it */
              },
            },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const Jiggle: Story = {
  render: () => {
    let toastId: string
    return (
      <ToastStoryWrapper>
        <TriggerButton
          label="Create toast"
          onClick={() => {
            toastId = toast("Watch me jiggle", { duration: Infinity })
          }}
        />
        <TriggerButton
          label="Trigger jiggle"
          onClick={() => {
            if (toastId) toast.update(toastId, { jiggle: true })
          }}
        />
      </ToastStoryWrapper>
    )
  },
}

export const ToastLimit: Story = {
  render: () => {
    let count = 0
    return (
      <ToastStoryWrapper>
        <TriggerButton
          label="Add toast (max 3)"
          onClick={() => {
            count++
            toast(`Toast #${count}`, { duration: Infinity })
          }}
        />
      </ToastStoryWrapper>
    )
  },
}
```

**Step 2: Verify stories load in Storybook**

Run: `pnpm storybook`
Check: All 9 stories render and interact correctly at `http://localhost:6006`

**Step 3: Commit**

```bash
git add src/components/toast/toast.stories.tsx
git commit -m "feat(toast): add Storybook stories for all Toast variants"
```

---

### Task 6: Run lint and format, fix any issues

**Step 1: Run lint**

Run: `pnpm lint`
Expected: no errors (or fix any that appear)

**Step 2: Run format**

Run: `pnpm format`
Expected: files formatted

**Step 3: Run all tests one final time**

Run: `pnpm test`
Expected: all tests PASS

**Step 4: Type check**

Run: `pnpm exec tsc -b`
Expected: no errors

**Step 5: Commit any formatting/lint fixes**

```bash
git add -A
git commit -m "chore(toast): lint and format"
```

---

### Summary of commits

1. `feat(toast): add types, Zustand store, and imperative API`
2. `test(toast): add unit tests for Toast component`
3. `feat(toast): implement Toaster, Toast, and ToastButton components`
4. `feat(provider): integrate Toaster into Provider`
5. `feat(toast): add Storybook stories for all Toast variants`
6. `chore(toast): lint and format`
