import React from "react"

import * as RadixDialog from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { Button, type ButtonProps } from "@/components/button"
import { IconButton } from "@/components/icon-button"
import { useControllableState } from "@/hooks/use-controllable-state"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Nesting context
// ---------------------------------------------------------------------------

const MAX_DIALOG_DEPTH = 3

const DialogDepthContext = React.createContext(0)

type DialogCallbacks = {
  onNestedOpen: () => void
  onNestedClose: () => void
}

const DialogCallbacksContext = React.createContext<DialogCallbacks | null>(null)

// ---------------------------------------------------------------------------
// DialogRoot
// ---------------------------------------------------------------------------

const dialogPanelVariants = cva(
  [
    // layout
    "w-[94vw]",

    // visual
    "rounded-xl",
    "bg-surface-100",
    "p-1",
    "shadow-lg",
    "ring-1",
    "ring-black/6",

    // focus
    "outline-none",
  ],
  {
    variants: {
      size: {
        sm: "max-w-105",
        base: "max-w-122.5",
        lg: "max-w-152.5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
)

type DialogRootProps = VariantProps<typeof dialogPanelVariants> & {
  /**
   * Controlled open state
   */
  open?: boolean
  /**
   * Initial open state for uncontrolled usage
   */
  defaultOpen?: boolean
  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Element that triggers the dialog when clicked
   */
  trigger?: React.ReactNode
  /**
   * Dialog content (Content, Header, Section, Footer, etc.)
   */
  children: React.ReactNode
  /**
   * Vertically center the dialog in the viewport @default false
   */
  centeredLayout?: boolean
  /**
   * Allow closing by clicking outside or pressing Escape @default true
   */
  dismissible?: boolean
}

const DialogRoot = React.forwardRef<HTMLDivElement, DialogRootProps>(
  (
    {
      trigger,
      children,
      defaultOpen,
      size,
      open: openProp,
      centeredLayout = false,
      dismissible = true,
      onOpenChange,
    },
    forwardedRef
  ) => {
    const depth = React.useContext(DialogDepthContext)
    const parentCallbacks = React.useContext(DialogCallbacksContext)
    const [hasNestedOpen, setHasNestedOpen] = React.useState(false)

    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    const myCallbacks = React.useMemo<DialogCallbacks>(
      () => ({
        onNestedOpen: () => setHasNestedOpen(true),
        onNestedClose: () => setHasNestedOpen(false),
      }),
      []
    )

    React.useEffect(() => {
      if (!parentCallbacks || !open) return
      parentCallbacks.onNestedOpen()
      return () => parentCallbacks.onNestedClose()
    }, [open, parentCallbacks])

    if (depth >= MAX_DIALOG_DEPTH) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Dialog: maximum nesting depth of ${MAX_DIALOG_DEPTH} reached.`)
      }
      return null
    }

    const isNested = depth > 0
    const isPushedBack = open && hasNestedOpen

    return (
      <RadixDialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
        {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
        <AnimatePresence>
          {open && (
            <RadixDialog.Portal forceMount>
              <RadixDialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  className={cn(
                    "fixed inset-0 z-50 grid justify-center py-40",
                    !isNested && "bg-white/60 backdrop-blur-sm",
                    centeredLayout ? "items-center" : "items-start"
                  )}
                >
                  <RadixDialog.Content
                    asChild
                    onInteractOutside={
                      dismissible ? undefined : (e) => e.preventDefault()
                    }
                    onEscapeKeyDown={dismissible ? undefined : (e) => e.preventDefault()}
                  >
                    <motion.div
                      ref={forwardedRef}
                      initial={{ opacity: 0, scale: 0.95, y: 40 }}
                      animate={
                        isPushedBack
                          ? { opacity: 0.85, filter: "blur(2px)", scale: 0.96, y: -20 }
                          : { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }
                      }
                      exit={{ opacity: 0, scale: 0.95, y: 40 }}
                      transition={
                        isPushedBack
                          ? { type: "spring", bounce: 0, duration: 0.4 }
                          : { type: "spring", bounce: 0, duration: 0.25 }
                      }
                      className={dialogPanelVariants({ size })}
                    >
                      <DialogDepthContext.Provider value={depth + 1}>
                        <DialogCallbacksContext.Provider value={myCallbacks}>
                          {children}
                        </DialogCallbacksContext.Provider>
                      </DialogDepthContext.Provider>
                    </motion.div>
                  </RadixDialog.Content>
                </motion.div>
              </RadixDialog.Overlay>
            </RadixDialog.Portal>
          )}
        </AnimatePresence>
      </RadixDialog.Root>
    )
  }
)

DialogRoot.displayName = "Dialog"

// ---------------------------------------------------------------------------
// DialogContent
// ---------------------------------------------------------------------------

type DialogContentProps = Pick<React.ComponentProps<"div">, "className" | "children">

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-dialog-content=""
      className={cn(
        "overflow-hidden rounded-lg bg-white shadow shadow-black/6",
        "ring-1 ring-black/6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

DialogContent.displayName = "Dialog.Content"

// ---------------------------------------------------------------------------
// DialogHeader
// ---------------------------------------------------------------------------

type DialogHeaderProps = Pick<React.ComponentProps<"div">, "className"> & {
  /**
   * Dialog title text or element
   */
  title: React.ReactNode
  /**
   * Optional description below the title
   */
  description?: React.ReactNode
  /**
   * Show a bottom border @default false
   */
  hasBorder?: boolean
}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, title, description, hasBorder = true, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-dialog-header=""
      className={cn(
        "relative flex items-start gap-6 px-5 py-4",
        hasBorder && "border-surface-100 border-b",
        className
      )}
      {...props}
    >
      <div className="flex w-full flex-col gap-1">
        <RadixDialog.Title className="text-xl font-semibold text-balance">
          {title}
        </RadixDialog.Title>
        {description && (
          <RadixDialog.Description className="text-word-secondary max-w-[40ch] text-base font-normal">
            {description}
          </RadixDialog.Description>
        )}
      </div>
      <RadixDialog.Close asChild>
        <IconButton icon="x" aria-label="Close" size="sm" intent="ghost" />
      </RadixDialog.Close>
    </div>
  )
)

DialogHeader.displayName = "Dialog.Header"

// ---------------------------------------------------------------------------
// DialogSection
// ---------------------------------------------------------------------------

type DialogSectionProps = Pick<React.ComponentProps<"section">, "className" | "children">

const DialogSection = React.forwardRef<HTMLElement, DialogSectionProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <section
      ref={forwardedRef}
      data-dialog-section=""
      className={cn("pt-4-5 space-y-5 px-5 pb-6", className)}
      {...props}
    >
      {children}
    </section>
  )
)

DialogSection.displayName = "Dialog.Section"

// ---------------------------------------------------------------------------
// DialogFooter
// ---------------------------------------------------------------------------

type DialogFooterProps = Pick<React.ComponentProps<"div">, "className" | "children">

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-dialog-footer=""
      className={cn("flex items-center justify-end gap-3 px-5 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)

DialogFooter.displayName = "Dialog.Footer"

// ---------------------------------------------------------------------------
// DialogClose
// ---------------------------------------------------------------------------

type DialogCloseProps = {
  /**
   * Button label
   */
  children?: React.ReactNode
  /**
   * Button size @default "md"
   */
  size?: ButtonProps["size"]
  /**
   * Disable the close button
   */
  disabled?: boolean
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, size, disabled }, forwardedRef) => (
    <RadixDialog.Close asChild>
      <Button
        ref={forwardedRef}
        disabled={disabled}
        type="button"
        size={size}
        intent="secondary"
      >
        {children}
      </Button>
    </RadixDialog.Close>
  )
)

DialogClose.displayName = "Dialog.Close"

// ---------------------------------------------------------------------------
// DialogNotice
// ---------------------------------------------------------------------------

type DialogNoticeProps = {
  /**
   * Notice content
   */
  children: React.ReactNode
  /**
   * Visual intent for the notice @default "warning"
   */
  intent?: "neutral" | "warning" | "danger"
}

const DialogNotice = React.forwardRef<HTMLElement, DialogNoticeProps>(
  ({ children, intent = "warning", ...props }, forwardedRef) => (
    <section
      ref={forwardedRef}
      data-dialog-notice=""
      className={cn(
        "border-surface-100 mt-4-5 relative block border-t",
        "only:-mt-4-5 only:border-t-0",
        "-mx-5 -mb-6",
        "after:pointer-events-none after:absolute after:inset-0",
        "after:bg-linear-to-r after:from-white after:via-white/80 after:to-transparent",
        intent === "warning" && "bg-warning-stripes",
        intent === "danger" && "bg-danger-stripes",
        intent === "neutral" && "bg-neutral-stripes"
      )}
      {...props}
    >
      <div
        className={cn(
          "leading-4-5 relative flex gap-1.5 px-4 py-3 text-[0.8125rem] font-medium",
          intent === "warning" && "text-orange-900",
          intent === "danger" && "text-red-900",
          intent === "neutral" && "text-word-secondary"
        )}
      >
        <div className="z-10">{children}</div>
      </div>
    </section>
  )
)

DialogNotice.displayName = "Dialog.Notice"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Dialog = Object.assign(DialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  Section: DialogSection,
  Footer: DialogFooter,
  Close: DialogClose,
  Notice: DialogNotice,
})

export type {
  DialogRootProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogSectionProps,
  DialogFooterProps,
  DialogCloseProps,
  DialogNoticeProps,
}
