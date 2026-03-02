import React from "react"

import * as RadixDropdown from "@radix-ui/react-dropdown-menu"
import { motion } from "motion/react"

import { Checkbox } from "@/components/checkbox"
import { Icon } from "@/components/icon"
import type { IconName } from "@/components/icon"
import { Tooltip } from "@/components/tooltip"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const contentClassName = cn(
  "z-50",
  "p-1",
  "min-w-32",
  "rounded-lg",
  "border",
  "border-border",
  "bg-white",
  "text-base",
  "text-word-primary",
  "shadow-lg",

  // open/close animations
  "data-[state=open]:animate-in",
  "data-[state=open]:fade-in-0",
  "data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0",

  // zoom
  "data-[state=open]:zoom-in-95",
  "data-[state=closed]:zoom-out-95",

  // slide direction
  "data-[side=bottom]:slide-in-from-top-2",
  "data-[side=top]:slide-in-from-bottom-2",
  "data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2"
)

const itemClassName = cn(
  "flex",
  "items-center",
  "p-1.5",
  "gap-2",
  "font-medium",
  "select-none",
  "outline-none",
  "cursor-pointer",
  "rounded-sm",
  "text-word-primary",
  "data-highlighted:bg-surface-100",
  "data-disabled:cursor-not-allowed",
  "data-disabled:opacity-50"
)

const separatorClassName = "bg-border mx-1 my-1 h-px"

const labelClassName = "text-word-tertiary px-1.5 py-1.5 text-sm select-none"

// ---------------------------------------------------------------------------
// CheckIndicator
// ---------------------------------------------------------------------------

function CheckIndicator({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      className="flex items-center"
    >
      {children}
    </motion.span>
  )
}

// ---------------------------------------------------------------------------
// DropdownRoot
// ---------------------------------------------------------------------------

type DropdownRootProps = Pick<
  RadixDropdown.DropdownMenuProps,
  "open" | "defaultOpen" | "onOpenChange" | "modal" | "children"
>

function DropdownRoot({ children, ...props }: DropdownRootProps) {
  return <RadixDropdown.Root {...props}>{children}</RadixDropdown.Root>
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

type DropdownTriggerProps = Pick<
  React.ComponentProps<"button">,
  "id" | "aria-label" | "className" | "children"
> & {
  /**
   * Merge props onto the child element instead of wrapping
   */
  asChild?: boolean
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ children, ...props }, forwardedRef) => (
    <RadixDropdown.Trigger ref={forwardedRef} {...props}>
      {children}
    </RadixDropdown.Trigger>
  )
)

DropdownTrigger.displayName = "Dropdown.Trigger"

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type DropdownContentProps = Pick<React.ComponentProps<"div">, "className" | "children"> &
  Pick<RadixDropdown.DropdownMenuContentProps, "side" | "sideOffset" | "align" | "alignOffset">

const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  (
    { className, children, side = "bottom", sideOffset = 6, align = "start", ...props },
    forwardedRef
  ) => (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        ref={forwardedRef}
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={cn(contentClassName, className)}
        {...props}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
)

DropdownContent.displayName = "Dropdown.Content"

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

type DropdownItemProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className" | "children"
> &
  Pick<RadixDropdown.DropdownMenuItemProps, "disabled" | "onSelect"> & {
    /**
     * Icon displayed before the label
     */
    icon?: IconName
    /**
     * Apply destructive styling
     */
    destructive?: boolean
    /**
     * Tooltip label shown on hover (useful for disabled items)
     */
    tooltip?: React.ReactNode
  }

const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ className, children, icon, destructive, tooltip, disabled, ...props }, forwardedRef) => {
    const item = (
      <RadixDropdown.Item
        ref={forwardedRef}
        disabled={disabled}
        className={cn(
          itemClassName,
          destructive && "text-destructive data-highlighted:text-destructive",
          className
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn("shrink-0", destructive ? "text-destructive" : "text-word-secondary")}
          >
            <Icon name={icon} size="sm" />
          </span>
        )}
        {children}
      </RadixDropdown.Item>
    )

    if (!tooltip) return item

    return (
      <Tooltip label={tooltip} side="right">
        <span className="flex">
          {item}
        </span>
      </Tooltip>
    )
  }
)

DropdownItem.displayName = "Dropdown.Item"

// ---------------------------------------------------------------------------
// CheckboxItem
// ---------------------------------------------------------------------------

type DropdownCheckboxItemProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className" | "children"
> &
  Pick<RadixDropdown.DropdownMenuCheckboxItemProps, "checked" | "onCheckedChange" | "disabled"> & {
    /**
     * Icon displayed after the check indicator
     */
    icon?: IconName
  }

const preventClose = (e: Event) => e.preventDefault()

const DropdownCheckboxItem = React.forwardRef<HTMLDivElement, DropdownCheckboxItemProps>(
  ({ className, children, icon, checked, disabled, ...props }, forwardedRef) => (
    <RadixDropdown.CheckboxItem
      ref={forwardedRef}
      checked={checked}
      disabled={disabled}
      onSelect={preventClose}
      className={cn(itemClassName, className)}
      {...props}
    >
      <Checkbox
        checked={checked === true}
        disabled={disabled}
        size="sm"
        className="pointer-events-none"
      />
      {icon && (
        <span className="text-word-secondary shrink-0">
          <Icon name={icon} size="sm" />
        </span>
      )}
      {children}
    </RadixDropdown.CheckboxItem>
  )
)

DropdownCheckboxItem.displayName = "Dropdown.CheckboxItem"

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------

type DropdownRadioGroupProps = Pick<
  RadixDropdown.DropdownMenuRadioGroupProps,
  "value" | "onValueChange" | "children"
>

function DropdownRadioGroup({ children, ...props }: DropdownRadioGroupProps) {
  return <RadixDropdown.RadioGroup {...props}>{children}</RadixDropdown.RadioGroup>
}

// ---------------------------------------------------------------------------
// RadioItem
// ---------------------------------------------------------------------------

type DropdownRadioItemProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className" | "children"
> &
  Pick<RadixDropdown.DropdownMenuRadioItemProps, "value" | "disabled"> & {
    /**
     * Icon displayed after the radio indicator
     */
    icon?: IconName
  }

// TODO: replace indicator with DS Radio component once implemented
const DropdownRadioItem = React.forwardRef<HTMLDivElement, DropdownRadioItemProps>(
  ({ className, children, icon, ...props }, forwardedRef) => (
    <RadixDropdown.RadioItem
      ref={forwardedRef}
      onSelect={preventClose}
      className={cn(itemClassName, className)}
      {...props}
    >
      <span className="flex w-3.5 shrink-0 items-center justify-center">
        <RadixDropdown.ItemIndicator>
          <CheckIndicator>
            <Icon name="check-outline" size="sm" />
          </CheckIndicator>
        </RadixDropdown.ItemIndicator>
      </span>
      {icon && (
        <span className="text-word-secondary shrink-0">
          <Icon name={icon} size="sm" />
        </span>
      )}
      {children}
    </RadixDropdown.RadioItem>
  )
)

DropdownRadioItem.displayName = "Dropdown.RadioItem"

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

type DropdownLabelProps = Pick<React.ComponentProps<"div">, "className" | "children">

const DropdownLabel = React.forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ className, ...props }, forwardedRef) => (
    <RadixDropdown.Label
      ref={forwardedRef}
      className={cn(labelClassName, className)}
      {...props}
    />
  )
)

DropdownLabel.displayName = "Dropdown.Label"

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

type DropdownSeparatorProps = Pick<React.ComponentProps<"div">, "className">

const DropdownSeparator = React.forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...props }, forwardedRef) => (
    <RadixDropdown.Separator
      ref={forwardedRef}
      className={cn(separatorClassName, className)}
      {...props}
    />
  )
)

DropdownSeparator.displayName = "Dropdown.Separator"

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

type DropdownGroupProps = Pick<React.ComponentProps<"div">, "className" | "children">

const DropdownGroup = React.forwardRef<HTMLDivElement, DropdownGroupProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <RadixDropdown.Group ref={forwardedRef} className={className} {...props}>
      {children}
    </RadixDropdown.Group>
  )
)

DropdownGroup.displayName = "Dropdown.Group"

// ---------------------------------------------------------------------------
// Sub
// ---------------------------------------------------------------------------

type DropdownSubProps = Pick<
  RadixDropdown.DropdownMenuSubProps,
  "open" | "defaultOpen" | "onOpenChange" | "children"
>

function DropdownSub({ children, ...props }: DropdownSubProps) {
  return <RadixDropdown.Sub {...props}>{children}</RadixDropdown.Sub>
}

// ---------------------------------------------------------------------------
// SubTrigger
// ---------------------------------------------------------------------------

type DropdownSubTriggerProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className" | "children"
> &
  Pick<RadixDropdown.DropdownMenuSubTriggerProps, "disabled"> & {
    /**
     * Icon displayed before the label
     */
    icon?: IconName
  }

const DropdownSubTrigger = React.forwardRef<HTMLDivElement, DropdownSubTriggerProps>(
  ({ className, children, icon, ...props }, forwardedRef) => (
    <RadixDropdown.SubTrigger
      ref={forwardedRef}
      className={cn(itemClassName, className)}
      {...props}
    >
      {icon && (
        <span className="text-word-secondary shrink-0">
          <Icon name={icon} size="sm" />
        </span>
      )}
      {children}
      <span className="text-word-secondary ml-auto shrink-0">
        <Icon name="chevron-right-outline" />
      </span>
    </RadixDropdown.SubTrigger>
  )
)

DropdownSubTrigger.displayName = "Dropdown.SubTrigger"

// ---------------------------------------------------------------------------
// SubContent
// ---------------------------------------------------------------------------

type DropdownSubContentProps = Pick<React.ComponentProps<"div">, "className" | "children">

const DropdownSubContent = React.forwardRef<HTMLDivElement, DropdownSubContentProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <RadixDropdown.Portal>
      <RadixDropdown.SubContent
        ref={forwardedRef}
        sideOffset={4}
        className={cn(contentClassName, className)}
        {...props}
      >
        {children}
      </RadixDropdown.SubContent>
    </RadixDropdown.Portal>
  )
)

DropdownSubContent.displayName = "Dropdown.SubContent"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
  Group: DropdownGroup,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
})

export type {
  DropdownRootProps,
  DropdownTriggerProps,
  DropdownContentProps,
  DropdownItemProps,
  DropdownCheckboxItemProps,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownLabelProps,
  DropdownSeparatorProps,
  DropdownGroupProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownSubContentProps,
}
