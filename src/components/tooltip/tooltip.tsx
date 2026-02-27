import React from "react"

import * as RadixTooltip from "@radix-ui/react-tooltip"

import { cn } from "@/utils/cn"

type TooltipProps = {
  /**
   * Element that triggers the tooltip on hover
   */
  children: React.ReactNode
  /**
   * Content displayed inside the tooltip
   */
  label: React.ReactNode
  /**
   * Tooltip placement relative to the trigger @default "top"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * Alignment along the perpendicular axis @default "center"
   */
  align?: "start" | "center" | "end"
  /**
   * Distance in px between the trigger and the tooltip @default 8
   */
  sideOffset?: number
  /**
   * Delay in ms before the tooltip appears @default 400
   */
  delayDuration?: number
  /**
   * Initial open state for uncontrolled usage
   */
  defaultOpen?: boolean
  /**
   * Controlled open state
   */
  open?: boolean
  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (open: boolean) => void
}

type TooltipProviderProps = {
  /**
   * Tooltip content for nested Tooltip components
   */
  children: React.ReactNode
  /**
   * How long to wait before re-enabling the delay after the user
   * stops hovering a tooltip. Enables instant "skip delay" transitions
   * between adjacent tooltips @default 300
   */
  skipDelayDuration?: number
}

export function TooltipProvider({
  children,
  skipDelayDuration = 300,
}: TooltipProviderProps) {
  return (
    <RadixTooltip.Provider skipDelayDuration={skipDelayDuration}>
      {children}
    </RadixTooltip.Provider>
  )
}

export const Tooltip = React.forwardRef<HTMLButtonElement, TooltipProps>(
  (
    {
      label,
      children,
      defaultOpen,
      onOpenChange,
      open,
      side = "top",
      align,
      sideOffset = 8,
      delayDuration = 400,
    },
    forwardedRef
  ) => {
    return (
      <RadixTooltip.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        delayDuration={delayDuration}
      >
        <RadixTooltip.Trigger ref={forwardedRef} asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            sideOffset={sideOffset}
            collisionPadding={5}
            side={side}
            align={align}
            style={{ maxWidth: 240 }}
            className={cn(
              "tooltip-content",
              "z-50 text-center font-medium text-white shadow-lg",
              "bg-gray-1200 rounded-sm px-2 py-1 text-sm leading-relaxed"
            )}
          >
            {label}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    )
  }
)

Tooltip.displayName = "Tooltip"
