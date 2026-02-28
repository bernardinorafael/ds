import React from "react"

import * as RadixSelect from "@radix-ui/react-select"
import { Check, ChevronsUpDown } from "lucide-react"

import { buttonVariants } from "@/components/button"
import { Spinner } from "@/components/spinner"
import { cn } from "@/utils/cn"

export type SelectItem = {
  label: string
  description?: string
  disabled?: boolean
  value: string
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
     * Available options
     */
    items: SelectItem[]
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
      ...props
    },
    forwardedRef
  ) => {
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
          id={id}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"]}
          aria-label={props["aria-label"]}
          aria-busy={loading || undefined}
          className={cn(
            buttonVariants({ intent: "secondary", size: "md" }),
            "w-full justify-start",
            className
          )}
        >
          <div className="mr-2 flex items-center gap-1.5">
            {prefix && <span className="text-word-secondary">{prefix}</span>}
            <RadixSelect.Value placeholder={placeholder} />
          </div>
          {loading ? (
            <Spinner size="sm" className="ml-auto" label="Loading" />
          ) : (
            <ChevronsUpDown size={14} className="ml-auto opacity-50" />
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
              <RadixSelect.Group>
                {items.map((item) => (
                  <RadixSelect.Item
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    className={cn(
                      "flex",
                      "items-center",
                      "p-1.5",
                      "gap-4",
                      "font-medium",
                      "select-none",
                      "outline-none",
                      "cursor-pointer",
                      "rounded-sm",
                      "text-word-primary",
                      "data-highlighted:bg-surface-100",
                      "data-disabled:cursor-not-allowed",
                      "data-disabled:opacity-50"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
                      {item.description && (
                        <span className="text-word-secondary text-sm">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <RadixSelect.ItemIndicator className="ml-auto">
                      <Check size={16} />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Group>
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    )
  }
)

Select.displayName = "Select"
