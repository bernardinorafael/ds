import React from "react"

import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { Button, type ButtonProps } from "@/components/button"
import { useControllableState } from "@/hooks/use-controllable-state"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// AlertDialogRoot
// ---------------------------------------------------------------------------

const alertDialogPanelVariants = cva(
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

type AlertDialogRootProps = VariantProps<typeof alertDialogPanelVariants> & {
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
   * Element that triggers the alert dialog when clicked
   */
  trigger?: React.ReactNode
  /**
   * Alert dialog content (Content, Header, Section, Footer, etc.)
   */
  children: React.ReactNode
  /**
   * Vertically center the dialog in the viewport @default false
   */
  centeredLayout?: boolean
}

const AlertDialogRoot = React.forwardRef<HTMLDivElement, AlertDialogRootProps>(
  (
    {
      open: openProp,
      onOpenChange,
      defaultOpen,
      trigger,
      children,
      size,
      centeredLayout = false,
    },
    forwardedRef
  ) => {
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    return (
      <RadixAlertDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={setOpen}>
        {trigger && (
          <RadixAlertDialog.Trigger asChild>{trigger}</RadixAlertDialog.Trigger>
        )}
        <AnimatePresence>
          {open && (
            <RadixAlertDialog.Portal forceMount>
              <RadixAlertDialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  className={cn(
                    "fixed inset-0 z-50 grid justify-center bg-white/60 py-40 backdrop-blur-sm",
                    centeredLayout ? "items-center" : "items-start"
                  )}
                >
                  <RadixAlertDialog.Content asChild>
                    <motion.div
                      ref={forwardedRef}
                      initial={{ opacity: 0, scale: 0.95, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 40 }}
                      transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                      className={alertDialogPanelVariants({ size })}
                    >
                      {children}
                    </motion.div>
                  </RadixAlertDialog.Content>
                </motion.div>
              </RadixAlertDialog.Overlay>
            </RadixAlertDialog.Portal>
          )}
        </AnimatePresence>
      </RadixAlertDialog.Root>
    )
  }
)

AlertDialogRoot.displayName = "AlertDialog"

// ---------------------------------------------------------------------------
// AlertDialogContent
// ---------------------------------------------------------------------------

type AlertDialogContentProps = Pick<React.ComponentProps<"div">, "className" | "children">

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-alert-dialog-content=""
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

AlertDialogContent.displayName = "AlertDialog.Content"

// ---------------------------------------------------------------------------
// AlertDialogHeader
// ---------------------------------------------------------------------------

type AlertDialogHeaderProps = Pick<React.ComponentProps<"div">, "className"> & {
  /**
   * Alert dialog title text or element
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

const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, title, description, hasBorder = true, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-alert-dialog-header=""
      className={cn(
        "relative flex items-start gap-6 px-5 py-4",
        hasBorder && "border-surface-100 border-b",
        className
      )}
      {...props}
    >
      <div className="flex w-full flex-col gap-1">
        <RadixAlertDialog.Title className="text-xl font-semibold text-balance">
          {title}
        </RadixAlertDialog.Title>
        {description && (
          <RadixAlertDialog.Description className="text-word-secondary max-w-[40ch] text-base font-normal">
            {description}
          </RadixAlertDialog.Description>
        )}
      </div>
    </div>
  )
)

AlertDialogHeader.displayName = "AlertDialog.Header"

// ---------------------------------------------------------------------------
// AlertDialogSection
// ---------------------------------------------------------------------------

type AlertDialogSectionProps = Pick<
  React.ComponentProps<"section">,
  "className" | "children"
>

const AlertDialogSection = React.forwardRef<HTMLElement, AlertDialogSectionProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <section
      ref={forwardedRef}
      data-alert-dialog-section=""
      className={cn("pt-4-5 space-y-5 px-5 pb-6", className)}
      {...props}
    >
      {children}
    </section>
  )
)

AlertDialogSection.displayName = "AlertDialog.Section"

// ---------------------------------------------------------------------------
// AlertDialogFooter
// ---------------------------------------------------------------------------

type AlertDialogFooterProps = Pick<React.ComponentProps<"div">, "className" | "children">

const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-alert-dialog-footer=""
      className={cn("flex items-center justify-end gap-3 px-5 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)

AlertDialogFooter.displayName = "AlertDialog.Footer"

// ---------------------------------------------------------------------------
// AlertDialogAction
// ---------------------------------------------------------------------------

type AlertDialogActionProps = {
  /**
   * Button content
   */
  children: React.ReactNode
  /**
   * Click handler
   */
  onClick?: ButtonProps["onClick"]
  /**
   * Disable the action button
   */
  disabled?: boolean
  /**
   * Shows a spinner overlay and disables interaction
   */
  isLoading?: boolean
  /**
   * Button size @default "md"
   */
  size?: ButtonProps["size"]
}

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  (props, forwardedRef) => (
    <RadixAlertDialog.Action asChild>
      <Button ref={forwardedRef} type="button" intent="danger" {...props} />
    </RadixAlertDialog.Action>
  )
)

AlertDialogAction.displayName = "AlertDialog.Action"

// ---------------------------------------------------------------------------
// AlertDialogCancel
// ---------------------------------------------------------------------------

type AlertDialogCancelProps = {
  /**
   * Button label @default "Cancel"
   */
  children?: React.ReactNode
  /**
   * Button size @default "md"
   */
  size?: ButtonProps["size"]
  /**
   * Disable the cancel button
   */
  disabled?: boolean
}

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ children = "Cancel", ...props }, forwardedRef) => (
    <RadixAlertDialog.Cancel asChild>
      <Button ref={forwardedRef} type="button" intent="secondary" {...props}>
        {children}
      </Button>
    </RadixAlertDialog.Cancel>
  )
)

AlertDialogCancel.displayName = "AlertDialog.Cancel"

// ---------------------------------------------------------------------------
// AlertDialogNotice
// ---------------------------------------------------------------------------

type AlertDialogNoticeProps = {
  /**
   * Notice content
   */
  children: React.ReactNode
  /**
   * Visual intent for the notice @default "danger"
   */
  intent?: "neutral" | "warning" | "danger"
}

const AlertDialogNotice = React.forwardRef<HTMLElement, AlertDialogNoticeProps>(
  ({ children, intent = "danger", ...props }, forwardedRef) => (
    <section
      ref={forwardedRef}
      data-alert-dialog-notice=""
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

AlertDialogNotice.displayName = "AlertDialog.Notice"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Section: AlertDialogSection,
  Footer: AlertDialogFooter,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
  Notice: AlertDialogNotice,
})

export type {
  AlertDialogRootProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogSectionProps,
  AlertDialogFooterProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogNoticeProps,
}
