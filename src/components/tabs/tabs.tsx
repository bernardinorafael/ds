import React from "react"

import * as RadixTabs from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"
import { LayoutGroup, motion } from "motion/react"

import { Tooltip } from "@/components/tooltip"
import { useControllableState } from "@/hooks/use-controllable-state"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type TabsContextValue = {
  layoutId: string
  activeValue: string | undefined
  size: "sm" | "md"
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) {
    throw new Error("Tabs compound components must be used within <Tabs>")
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Tabs (Root)
// ---------------------------------------------------------------------------

type TabsRootProps = Pick<
  React.ComponentProps<"div">,
  "id" | "className" | "children"
> & {
  /**
   * Controlled active tab value
   */
  value?: string
  /**
   * Initial active tab for uncontrolled usage
   */
  defaultValue?: string
  /**
   * Callback fired when the active tab changes
   */
  onValueChange?: (value: string) => void
  /**
   * Trigger text size @default "md"
   */
  size?: "sm" | "md"
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  (
    { id, className, children, value, defaultValue, onValueChange, size = "md" },
    forwardedRef
  ) => {
    const layoutId = React.useId()

    const [activeValue, setActiveValue] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: onValueChange,
    })

    return (
      <TabsContext.Provider value={{ layoutId, activeValue, size }}>
        <RadixTabs.Root
          id={id}
          ref={forwardedRef}
          value={activeValue}
          onValueChange={setActiveValue}
          className={className}
        >
          {children}
        </RadixTabs.Root>
      </TabsContext.Provider>
    )
  }
)

TabsRoot.displayName = "Tabs"

// ---------------------------------------------------------------------------
// Tabs.List
// ---------------------------------------------------------------------------

type TabsListProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className" | "children"
>

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { layoutId } = useTabsContext()

    return (
      <RadixTabs.List
        ref={forwardedRef}
        className={cn("border-border flex border-b", className)}
        {...props}
      >
        <LayoutGroup id={layoutId}>{children}</LayoutGroup>
      </RadixTabs.List>
    )
  }
)

TabsList.displayName = "Tabs.List"

// ---------------------------------------------------------------------------
// Tabs.Trigger
// ---------------------------------------------------------------------------

const triggerVariants = cva(
  [
    // positioning
    "relative",

    // layout
    "inline-flex",
    "items-center",
    "gap-1.5",

    // visual
    "cursor-pointer",
    "select-none",
    "font-book",
    "text-word-secondary",

    // transitions
    "transition-colors",

    // focus states
    "outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary/50",
    "focus-visible:ring-offset-2",

    // active state
    "data-[state=active]:text-foreground",

    // hover state
    "enabled:hover:text-foreground",

    // disabled states
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-3 py-2 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type TabsTriggerProps = Pick<
  React.ComponentProps<"button">,
  "id" | "aria-label" | "className" | "disabled" | "children"
> & {
  /**
   * Tab value that links this trigger to its content panel
   */
  value: string
  /**
   * Tooltip shown on hover (useful for explaining why a tab is disabled)
   */
  tooltip?: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, tooltip, ...props }, forwardedRef) => {
    const { activeValue, size } = useTabsContext()

    const isActive = activeValue === value

    const trigger = (
      <RadixTabs.Trigger
        ref={forwardedRef}
        value={value}
        className={cn(triggerVariants({ size }), className)}
        {...props}
      >
        {children}
        {isActive && (
          <motion.span
            layoutId="tabs-indicator"
            className="bg-foreground absolute inset-x-0 -bottom-px h-px"
            transition={{ type: "spring", bounce: 0, duration: 0.25 }}
          />
        )}
      </RadixTabs.Trigger>
    )

    if (tooltip) {
      return <Tooltip label={tooltip}>{trigger}</Tooltip>
    }

    return trigger
  }
)

TabsTrigger.displayName = "Tabs.Trigger"

// ---------------------------------------------------------------------------
// Tabs.Content
// ---------------------------------------------------------------------------

type TabsContentProps = Pick<
  React.ComponentProps<"div">,
  "id" | "className" | "children"
> & {
  /**
   * Tab value that links this content panel to its trigger
   */
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, forwardedRef) => (
    <RadixTabs.Content
      ref={forwardedRef}
      value={value}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  )
)

TabsContent.displayName = "Tabs.Content"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
})

export type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps }
