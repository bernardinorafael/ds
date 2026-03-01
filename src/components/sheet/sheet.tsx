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

const MAX_SHEET_DEPTH = 3

const SheetDepthContext = React.createContext(0)

type SheetCallbacks = {
  onNestedOpen: () => void
  onNestedClose: () => void
}

const SheetCallbacksContext = React.createContext<SheetCallbacks | null>(null)

// ---------------------------------------------------------------------------
// SheetRoot
// ---------------------------------------------------------------------------

const sheetPanelVariants = cva(
  [
    // layout
    "w-[94vw]",
    "flex",
    "flex-col",

    // position — right side panel
    "absolute",
    "inset-y-2",
    "right-2",

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
        base: "max-w-122.5",
        lg: "max-w-180",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
)

type SheetRootProps = VariantProps<typeof sheetPanelVariants> & {
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
   * Element that triggers the sheet when clicked
   */
  trigger?: React.ReactNode
  /**
   * Sheet content (Content, Header, Section, Footer, etc.)
   */
  children: React.ReactNode
  /**
   * Allow closing by clicking outside or pressing Escape @default true
   */
  dismissible?: boolean
}

const SheetRoot = React.forwardRef<HTMLDivElement, SheetRootProps>(
  (
    {
      trigger,
      children,
      defaultOpen,
      size,
      open: openProp,
      onOpenChange,
      dismissible = true,
    },
    forwardedRef
  ) => {
    const depth = React.useContext(SheetDepthContext)
    const parentCallbacks = React.useContext(SheetCallbacksContext)
    const [hasNestedOpen, setHasNestedOpen] = React.useState(false)

    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    const myCallbacks = React.useMemo<SheetCallbacks>(
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

    if (depth >= MAX_SHEET_DEPTH) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Sheet: maximum nesting depth of ${MAX_SHEET_DEPTH} reached.`)
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
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                  className={cn(
                    "fixed inset-0 z-50",
                    !isNested && "bg-white/60 backdrop-blur-sm"
                  )}
                  style={{
                    perspective: "1200px",
                  }}
                >
                  <RadixDialog.Content
                    asChild
                    onEscapeKeyDown={dismissible ? undefined : (e) => e.preventDefault()}
                    onInteractOutside={
                      dismissible ? undefined : (e) => e.preventDefault()
                    }
                  >
                    <motion.div
                      ref={forwardedRef}
                      initial={{ opacity: 0, x: "100%", rotateY: 8, scale: 0.95 }}
                      animate={
                        isPushedBack
                          ? {
                              opacity: 0.85,
                              filter: "blur(2px)",
                              scale: 0.96,
                              x: 0,
                              rotateY: 0,
                            }
                          : {
                              opacity: 1,
                              filter: "blur(0px)",
                              scale: 1,
                              x: 0,
                              rotateY: 0,
                            }
                      }
                      exit={{
                        opacity: 0,
                        x: "100%",
                        rotateY: -8,
                        scale: 0.95,
                      }}
                      transition={
                        isPushedBack
                          ? {
                              type: "spring",
                              bounce: 0,
                              duration: 0.4,
                            }
                          : {
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                              mass: 0.9,
                            }
                      }
                      className={sheetPanelVariants({ size })}
                    >
                      <SheetDepthContext.Provider value={depth + 1}>
                        <SheetCallbacksContext.Provider value={myCallbacks}>
                          {children}
                        </SheetCallbacksContext.Provider>
                      </SheetDepthContext.Provider>
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

SheetRoot.displayName = "Sheet"

// ---------------------------------------------------------------------------
// SheetContent
// ---------------------------------------------------------------------------

type SheetContentProps = Pick<React.ComponentProps<"div">, "className" | "children">

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-sheet-content=""
      className={cn(
        "overflow-hidden rounded-lg bg-white shadow shadow-black/6",
        "ring-1 ring-black/6",
        "flex flex-1 flex-col overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

SheetContent.displayName = "Sheet.Content"

// ---------------------------------------------------------------------------
// SheetHeader
// ---------------------------------------------------------------------------

type SheetHeaderProps = Pick<React.ComponentProps<"div">, "className"> & {
  /**
   * Sheet title text or element
   */
  title: React.ReactNode
  /**
   * Optional description below the title
   */
  description?: React.ReactNode
  /**
   * Show a bottom border @default true
   */
  hasBorder?: boolean
}

const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, title, description, hasBorder = true, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-sheet-header=""
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

SheetHeader.displayName = "Sheet.Header"

// ---------------------------------------------------------------------------
// SheetSection
// ---------------------------------------------------------------------------

type SheetSectionProps = Pick<React.ComponentProps<"section">, "className" | "children">

const SheetSection = React.forwardRef<HTMLElement, SheetSectionProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <section
      ref={forwardedRef}
      data-sheet-section=""
      className={cn("pt-4-5 flex-1 space-y-5 overflow-auto px-5 pb-6", className)}
      {...props}
    >
      {children}
    </section>
  )
)

SheetSection.displayName = "Sheet.Section"

// ---------------------------------------------------------------------------
// SheetFooter
// ---------------------------------------------------------------------------

type SheetFooterProps = Pick<React.ComponentProps<"div">, "className" | "children">

const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-sheet-footer=""
      className={cn(
        "border-surface-100 flex items-center justify-end gap-3 border-t px-5 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

SheetFooter.displayName = "Sheet.Footer"

// ---------------------------------------------------------------------------
// SheetClose
// ---------------------------------------------------------------------------

type SheetCloseProps = {
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

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
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

SheetClose.displayName = "Sheet.Close"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Sheet = Object.assign(SheetRoot, {
  Content: SheetContent,
  Header: SheetHeader,
  Section: SheetSection,
  Footer: SheetFooter,
  Close: SheetClose,
})

export type {
  SheetRootProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetSectionProps,
  SheetFooterProps,
  SheetCloseProps,
}
