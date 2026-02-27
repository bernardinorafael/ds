import React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { useControllableState } from "@/hooks/use-controllable-state"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// CardRoot
// ---------------------------------------------------------------------------

type Spacing = "compact" | "cozy"

const cardRootVariants = cva(
  [
    // positioning
    "isolate",
    "relative",

    // visual
    "overflow-hidden",
    "rounded-3xl",
    "p-1",
  ],
  {
    variants: {
      background: {
        intense: "bg-surface-50",
        soft: "bg-surface-100",
      },
    },
    defaultVariants: {
      background: "soft",
    },
  }
)

type CardRootProps = Pick<
  React.ComponentProps<"section">,
  "id" | "aria-label" | "aria-labelledby" | "className" | "children"
> &
  VariantProps<typeof cardRootVariants> & {
    spacing?: Spacing
  }

const CardRoot = React.forwardRef<HTMLElement, CardRootProps>(
  ({ className, background, spacing = "compact", children, ...props }, forwardedRef) => {
    return (
      <section
        ref={forwardedRef}
        data-card-root=""
        data-card-spacing={spacing}
        data-card-background={background ?? "soft"}
        className={cn(cardRootVariants({ background }), className)}
        {...props}
      >
        {children}
      </section>
    )
  }
)

CardRoot.displayName = "Card"

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------

type CardHeaderProps = Pick<React.ComponentProps<"header">, "className" | "children">

const CardHeader = React.forwardRef<HTMLElement, CardHeaderProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <header
        ref={forwardedRef}
        data-card-header=""
        className={cn(
          "grid",
          "grid-rows-1",
          "items-center",
          "gap-x-6",
          "gap-y-0.5",
          "p-4",
          className
        )}
        {...props}
      >
        {children}
      </header>
    )
  }
)

CardHeader.displayName = "Card.Header"

// ---------------------------------------------------------------------------
// CardTitle
// ---------------------------------------------------------------------------

type CardTitleProps = Pick<React.ComponentProps<"h2">, "id" | "className" | "children">

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <h2
        ref={forwardedRef}
        data-card-title=""
        className={cn(
          "col-start-1",
          "row-start-1",
          "text-balance",
          "font-sans",
          "text-lg",
          "font-medium",
          "text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    )
  }
)

CardTitle.displayName = "Card.Title"

// ---------------------------------------------------------------------------
// CardDescription
// ---------------------------------------------------------------------------

type CardDescriptionProps = Pick<
  React.ComponentProps<"p">,
  "id" | "className" | "children"
>

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <p
        ref={forwardedRef}
        data-card-description=""
        className={cn(
          "text-sm",
          "font-normal",
          "text-word-secondary",
          "col-start-1",
          "row-start-1",
          "text-balance",
          "[[data-card-title]~&]:row-start-2",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = "Card.Description"

// ---------------------------------------------------------------------------
// CardActions
// ---------------------------------------------------------------------------

type CardActionsProps = Pick<React.ComponentProps<"div">, "className" | "children">

const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        data-card-actions=""
        className={cn(
          "col-start-2",
          "row-span-full",
          "place-self-start",
          "flex",
          "min-w-0",
          "shrink-0",
          "items-start",
          "gap-3",
          "[[data-card-title]~[data-card-description]~&]:mt-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardActions.displayName = "Card.Actions"

// ---------------------------------------------------------------------------
// CardBody
// ---------------------------------------------------------------------------

type CollapsibleProps = {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type CardBodyProps = Pick<React.ComponentProps<"div">, "className" | "children"> &
  CollapsibleProps

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  (
    { className, children, open: openProp, defaultOpen = true, onOpenChange, ...props },
    forwardedRef
  ) => {
    const [open] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={forwardedRef}
            data-card-body=""
            initial={{ height: 0, opacity: 0, scale: 0.9 }}
            animate={{ height: "auto", opacity: 1, scale: 1 }}
            exit={{
              height: 0,
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.3, opacity: { delay: 0.1 } }}
            {...props}
          >
            <div
              className={cn(
                "rounded-xl",
                "bg-surface-200",
                "shadow-xs",
                "in-data-[card-spacing=compact]:px-4",
                "in-data-[card-spacing=compact]:py-4",
                "in-data-[card-spacing=cozy]:px-8",
                "in-data-[card-spacing=cozy]:py-6",
                className
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

CardBody.displayName = "Card.Body"

// ---------------------------------------------------------------------------
// CardRow
// ---------------------------------------------------------------------------

type CardRowProps = Pick<React.ComponentProps<"div">, "className" | "children">

const CardRow = React.forwardRef<HTMLDivElement, CardRowProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        data-card-row=""
        className={cn(
          "[&+&]:border-t",

          // compact
          "in-data-[card-spacing=compact]:-mx-4",
          "in-data-[card-spacing=compact]:px-4",
          "in-data-[card-spacing=compact]:py-4",
          "in-data-[card-spacing=compact]:first:-mt-4",
          "in-data-[card-spacing=compact]:last:-mb-4",

          // cozy
          "in-data-[card-spacing=cozy]:-mx-8",
          "in-data-[card-spacing=cozy]:px-8",
          "in-data-[card-spacing=cozy]:py-6",
          "in-data-[card-spacing=cozy]:first:-mt-6",
          "in-data-[card-spacing=cozy]:last:-mb-6",

          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardRow.displayName = "Card.Row"

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------

type CardFooterProps = Pick<React.ComponentProps<"div">, "className" | "children"> &
  CollapsibleProps

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    { className, children, open: openProp, defaultOpen = true, onOpenChange, ...props },
    forwardedRef
  ) => {
    const [open] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.footer
            ref={forwardedRef}
            data-card-footer=""
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            exit={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2, opacity: { delay: 0.1 } }}
            {...props}
          >
            <div
              className={cn(
                "-mb-1",
                "grid",
                "grid-rows-1",
                "items-center",
                "gap-6",
                "gap-y-2",
                "p-4",
                "[&>:not([data-card-actions])]:col-start-1",
                className
              )}
            >
              {children}
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    )
  }
)

CardFooter.displayName = "Card.Footer"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Row: CardRow,
  Actions: CardActions,
  Footer: CardFooter,
})

export type {
  CardRootProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardBodyProps,
  CardRowProps,
  CardActionsProps,
  CardFooterProps,
}
