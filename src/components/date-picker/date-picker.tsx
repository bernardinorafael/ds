import React from "react"

import { AnimatePresence, motion } from "motion/react"
import { I18nProvider } from "react-aria"
import {
  DateInput,
  Dialog,
  Group,
  Label,
  Popover,
  Button as RAButton,
  DatePicker as RADatePicker,
  DateSegment as RADateSegment,
  type DateValue,
} from "react-aria-components"

import { Calendar } from "@/components/calendar"
import { Icon } from "@/components/icon"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export type DatePickerProps = {
  /**
   * Selected date value (controlled)
   */
  value?: DateValue | null
  /**
   * Initial date value (uncontrolled)
   */
  defaultValue?: DateValue
  /**
   * Callback fired when the date changes
   */
  onChange?: (value: DateValue | null) => void
  /**
   * Minimum selectable date
   */
  minValue?: DateValue
  /**
   * Maximum selectable date
   */
  maxValue?: DateValue
  /**
   * Disables the date picker
   */
  isDisabled?: boolean
  /**
   * Shows invalid state styling
   */
  isInvalid?: boolean
  /**
   * Accessible label for the date picker @default "Date"
   */
  label?: string
  /**
   * Locale for date formatting and segment order @default "en-US"
   */
  locale?: string
  className?: string
  id?: string
  "aria-label"?: string
  "aria-describedby"?: string
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      minValue,
      maxValue,
      isDisabled,
      isInvalid,
      label = "Date",
      locale = "en-US",
      className,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <I18nProvider locale={locale}>
        <RADatePicker
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          minValue={minValue}
          maxValue={maxValue}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          className={cn("group", className)}
          {...props}
        >
          <Label className="sr-only">{label}</Label>
          <Group
            ref={forwardedRef}
            className={cn(
              // layout
              "flex w-full items-center",

              // visual — matches DS Input rootVariants
              "rounded-sm bg-white shadow-sm transition",

              // ring border
              "ring-1",
              isInvalid
                ? "ring-destructive"
                : "ring-[color-mix(in_srgb,black_10%,transparent)]",

              // focus-within ring
              isInvalid
                ? [
                    "focus-within:ring-[3px]",
                    "focus-within:ring-[color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
                    "focus-within:ring-offset-1",
                    "focus-within:ring-offset-destructive",
                  ]
                : [
                    "focus-within:ring-[3px]",
                    "focus-within:ring-[color-mix(in_srgb,black_13%,transparent)]",
                    "focus-within:ring-offset-1",
                    "focus-within:ring-offset-[color-mix(in_srgb,black_15%,transparent)]",
                  ],

              // disabled
              isDisabled && "cursor-not-allowed opacity-50",

              // size
              "h-8"
            )}
          >
            <DateInput className={cn("flex flex-1 items-center", "pl-3 text-base")}>
              {(segment) => (
                <RADateSegment
                  segment={segment}
                  className={cn(
                    "inline justify-between rounded-sm px-1 caret-transparent outline-none",
                    isInvalid
                      ? "focus:bg-destructive focus:text-white"
                      : "focus:text-secondary-foreground focus:bg-black/6",
                    "data-[type=literal]:px-0 data-[type=literal]:text-gray-800",
                    segment.isPlaceholder && "text-word-placeholder"
                  )}
                />
              )}
            </DateInput>

            <RAButton
              className={cn(
                "flex shrink-0 cursor-pointer items-center justify-center select-none",
                "text-word-placeholder enabled:hover:text-word-secondary transition-colors outline-none",
                "pr-2.5 disabled:cursor-not-allowed"
              )}
            >
              <Icon name="calendar-fill" />
            </RAButton>
          </Group>

          <Popover offset={10} containerPadding={10}>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.24,
                  type: "spring",
                  bounce: 0.1,
                }}
              >
                <Dialog className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-black/10 outline-none">
                  <Calendar locale={locale}>
                    <Calendar.Header />
                    <Calendar.Grid />
                  </Calendar>
                </Dialog>
              </motion.div>
            </AnimatePresence>
          </Popover>
        </RADatePicker>
      </I18nProvider>
    )
  }
)

DatePicker.displayName = "DatePicker"
