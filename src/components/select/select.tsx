import React from "react"

import * as RadixSelect from "@radix-ui/react-select"
import { motion } from "motion/react"

import { buttonVariants } from "@/components/button"
import { useFieldControl } from "@/components/field"
import { Icon } from "@/components/icon"
import type { IconName } from "@/components/icon"
import { Spinner } from "@/components/spinner"
import { cn } from "@/utils/cn"

export type SelectItem = {
  label: string
  description?: string
  disabled?: boolean
  value: string
  /**
   * Icon displayed before the label
   */
  icon?: IconName
}

export type SelectGroup = {
  label: string
  items: SelectItem[]
}

function isGrouped(items: SelectItem[] | SelectGroup[]): items is SelectGroup[] {
  return items.length > 0 && "items" in items[0]
}

function isEmpty(items: SelectItem[] | SelectGroup[]): boolean {
  if (items.length === 0) return true
  if (isGrouped(items)) return items.every((g) => g.items.length === 0)
  return false
}

export type SelectProps = Pick<
  React.ComponentProps<"button">,
  "id" | "aria-describedby" | "aria-invalid" | "aria-label" | "disabled" | "className"
> &
  Pick<RadixSelect.SelectProps, "defaultValue" | "onValueChange" | "value" | "name"> & {
    /**
     * Placeholder shown when no value is selected @default "Select"
     */
    placeholder?: string
    /**
     * Text displayed before the selected value
     */
    prefix?: string
    /**
     * Shows a spinner and disables interaction
     */
    loading?: boolean
    /**
     * Dropdown position strategy @default "popper"
     */
    position?: "popper" | "fixed"
    /**
     * Available options (flat list or grouped)
     */
    items: SelectItem[] | SelectGroup[]
    /**
     * Visual validity state. Overrides Field context detection.
     */
    validity?: "initial" | "error" | "warning" | "success"
    /**
     * Trigger size @default "md"
     */
    size?: "sm" | "md"
    /**
     * Text shown when there are no options @default "No options"
     */
    emptyLabel?: string
  }

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

function renderItem(item: SelectItem) {
  return (
    <RadixSelect.Item
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      className={itemClassName}
    >
      {item.icon && (
        <span className="text-word-secondary shrink-0">
          <Icon name={item.icon} size="sm" />
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
        {item.description && (
          <span className="text-word-secondary text-sm">{item.description}</span>
        )}
      </div>
      <RadixSelect.ItemIndicator className="ml-auto">
        <motion.span
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.1,
          }}
          className="flex items-center"
        >
          <Icon name="check-outline" size="sm" />
        </motion.span>
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      items,
      prefix,
      className,
      placeholder = "Select",
      loading = false,
      position = "popper",
      disabled,
      size = "md",
      emptyLabel = "No options",
      validity: validityProp,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      "aria-label": ariaLabel,
      ...props
    },
    forwardedRef
  ) => {
    const field = useFieldControl({ props: { id } })
    const ariaInvalid = ariaInvalidProp ?? field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")

    return (
      <RadixSelect.Root
        disabled={disabled || loading}
        onValueChange={props.onValueChange}
        defaultValue={props.defaultValue}
        value={props.value}
        name={props.name}
      >
        <RadixSelect.Trigger
          ref={forwardedRef}
          id={field.id}
          aria-describedby={ariaDescribedByProp ?? field["aria-describedby"]}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          className={cn(
            buttonVariants({ intent: "secondary", size }),
            "w-full justify-start",
            // replace border with ring approach
            "border-0",
            "ring-1",
            "ring-(--select-border-color)",
            // focus ring
            "focus-visible:ring-[3px]",
            "focus-visible:ring-(--select-ring-color)",
            "focus-visible:ring-offset-1",
            "focus-visible:ring-offset-(--select-border-color)",
            // validity CSS vars
            validity === "initial" && [
              "[--select-border-color:color-mix(in_srgb,black_10%,transparent)]",
              "[--select-ring-color:color-mix(in_srgb,black_13%,transparent)]",
            ],
            validity === "error" && [
              "[--select-border-color:var(--color-destructive)]",
              "[--select-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
            ],
            validity === "warning" && [
              "[--select-border-color:var(--color-orange-900)]",
              "[--select-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
            ],
            validity === "success" && [
              "[--select-border-color:var(--color-green-900)]",
              "[--select-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
            ],
            className
          )}
        >
          <div className="mr-2 flex min-w-0 items-center gap-1.5">
            {prefix && <span className="text-word-secondary shrink-0">{prefix}</span>}
            <span className="truncate">
              <RadixSelect.Value placeholder={placeholder} />
            </span>
          </div>
          {loading ? (
            <Spinner
              size={size === "sm" ? "xs" : "sm"}
              className="ml-auto shrink-0"
              label="Loading"
            />
          ) : (
            <span className="ml-auto shrink-0 opacity-50">
              <Icon name="chevron-up-down-outline" size="sm" />
            </span>
          )}
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className={cn(
              "z-50",
              "p-1",
              "min-w-32",
              "max-h-52",
              "overflow-y-auto",
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

              // zoom (skipped for position=fixed to avoid jarring scale)
              position !== "fixed" && "data-[state=open]:zoom-in-95",
              position !== "fixed" && "data-[state=closed]:zoom-out-95",

              // slide direction
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2",
              "data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2",

              position === "popper" && "min-w-(--radix-select-trigger-width)"
            )}
            {...(position === "popper" && {
              position: "popper",
              sideOffset: 6,
            })}
          >
            <RadixSelect.Viewport>
              {isEmpty(items) ? (
                <div className="text-word-tertiary p-4 text-center text-sm select-none">
                  {emptyLabel}
                </div>
              ) : isGrouped(items) ? (
                items.map((group, groupIndex) => (
                  <React.Fragment key={group.label}>
                    {groupIndex > 0 && (
                      <RadixSelect.Separator className="bg-border mx-1 my-1 h-px" />
                    )}
                    <RadixSelect.Group>
                      <RadixSelect.Label className="text-word-tertiary px-1.5 py-1.5 text-sm select-none">
                        {group.label}
                      </RadixSelect.Label>
                      {group.items.map(renderItem)}
                    </RadixSelect.Group>
                  </React.Fragment>
                ))
              ) : (
                <RadixSelect.Group>
                  {(items as SelectItem[]).map(renderItem)}
                </RadixSelect.Group>
              )}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    )
  }
)

Select.displayName = "Select"
