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
  DateRangePicker as RADateRangePicker,
  DateSegment as RADateSegment,
  type DateValue,
} from "react-aria-components"
import type { DateRange } from "react-aria-components"

import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Icon } from "@/components/icon"
import { IconButton } from "@/components/icon-button"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Shared segment class
// ---------------------------------------------------------------------------

const segmentClassName = (
  segment: { type: string; isPlaceholder: boolean },
  isInvalid?: boolean
) =>
  cn(
    "inline justify-between rounded-xs px-1 caret-transparent outline-none",
    isInvalid
      ? "focus:bg-destructive focus:text-white"
      : "focus:bg-black/6 focus:text-secondary-foreground",
    "data-[type=literal]:px-0 data-[type=literal]:text-gray-800",
    segment.isPlaceholder && "text-word-placeholder"
  )

// ---------------------------------------------------------------------------
// DateRangePicker
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Preset type
// ---------------------------------------------------------------------------

export type DateRangePreset = {
  /**
   * Display label for the preset
   */
  label: string
  /**
   * Date range value to apply when selected
   */
  value: DateRange
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type DateRangePickerProps = {
  /**
   * Selected date range (controlled)
   */
  value?: DateRange | null
  /**
   * Initial date range (uncontrolled)
   */
  defaultValue?: DateRange
  /**
   * Callback fired when the date range changes
   */
  onChange?: (value: DateRange | null) => void
  /**
   * Minimum selectable date
   */
  minValue?: DateValue
  /**
   * Maximum selectable date
   */
  maxValue?: DateValue
  /**
   * Disables the date range picker
   */
  isDisabled?: boolean
  /**
   * Shows invalid state styling
   */
  isInvalid?: boolean
  /**
   * Accessible label for the date range picker @default "Date range"
   */
  label?: string
  /**
   * Label for the clear button @default "Clear"
   */
  clearLabel?: string
  /**
   * Label for the apply button @default "Apply"
   */
  applyLabel?: string
  /**
   * Quick-select preset date ranges shown in a sidebar
   */
  presets?: DateRangePreset[]
  /**
   * Show two months side by side in the popover @default false
   */
  doubleMonth?: boolean
  /**
   * Locale for date formatting and segment order @default "en-US"
   */
  locale?: string
  className?: string
  id?: string
  "aria-label"?: string
  "aria-describedby"?: string
}

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      minValue,
      maxValue,
      isDisabled,
      isInvalid,
      label = "Date range",
      clearLabel = "Clear",
      applyLabel = "Apply",
      presets,
      doubleMonth = false,
      locale = "en-US",
      className,
      ...props
    },
    forwardedRef
  ) => {
    const [presetsOpen, setPresetsOpen] = React.useState(true)
    const hasPresets = Boolean(presets?.length)

    return (
      <I18nProvider locale={locale}>
        <RADateRangePicker
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
          {({ state }) => (
            <>
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
                <DateInput slot="start" className="flex items-center pl-3 text-base">
                  {(segment) => (
                    <RADateSegment
                      segment={segment}
                      className={segmentClassName(segment, isInvalid)}
                    />
                  )}
                </DateInput>

                <span className="px-1.5 text-gray-800">
                  <Icon name="arrow-right-outline" size="sm" />
                </span>

                <DateInput slot="end" className="flex items-center text-base">
                  {(segment) => (
                    <RADateSegment
                      segment={segment}
                      className={segmentClassName(segment, isInvalid)}
                    />
                  )}
                </DateInput>

                <RAButton
                  className={cn(
                    "ml-auto flex shrink-0 cursor-pointer items-center justify-center select-none",
                    "text-word-placeholder hover:text-word-secondary transition-colors outline-none",
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
                    <Dialog
                      className={cn(
                        "flex overflow-hidden outline-none",
                        hasPresets
                          ? "bg-surface-100 rounded-3xl p-1 shadow-xs"
                          : "rounded-3xl bg-white p-4 shadow-md ring-1 ring-black/10"
                      )}
                    >
                      <AnimatePresence initial={false}>
                        {hasPresets && presetsOpen && (
                          <motion.nav
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex shrink-0 flex-col gap-0.5 p-2">
                              {presets!.map((preset) => {
                                const currentRange = state.dateRange
                                const isActive =
                                  currentRange?.start &&
                                  currentRange?.end &&
                                  currentRange.start.compare(preset.value.start) === 0 &&
                                  currentRange.end.compare(preset.value.end) === 0

                                return (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    className={cn(
                                      "flex cursor-pointer items-center justify-between gap-2",
                                      "rounded-md px-3 py-1.5 text-left text-sm whitespace-nowrap",
                                      "transition-colors outline-none",
                                      "focus-visible:ring-primary/50 focus-visible:ring-2",
                                      isActive
                                        ? "text-primary"
                                        : "text-word-secondary hover:text-word-primary hover:bg-black/4"
                                    )}
                                    onClick={() => {
                                      state.setDateRange(preset.value)
                                      onChange?.(preset.value)
                                    }}
                                  >
                                    {preset.label}
                                    {isActive && <Icon name="check-outline" size="sm" />}
                                  </button>
                                )
                              })}
                            </div>
                          </motion.nav>
                        )}
                      </AnimatePresence>

                      <div
                        className={cn(hasPresets && "rounded-xl bg-white p-4 shadow-xs")}
                      >
                        <Calendar
                          mode="range"
                          locale={locale}
                          visibleDuration={doubleMonth ? { months: 2 } : undefined}
                        >
                          <Calendar.Header />
                          <div className={cn(doubleMonth && "flex gap-4")}>
                            <Calendar.Grid />
                            {doubleMonth && <Calendar.Grid offset={{ months: 1 }} />}
                          </div>
                        </Calendar>

                        <div className="mt-1 h-px w-full rounded-full bg-black/4" />

                        <div className="flex w-full items-center gap-3 pt-3">
                          {hasPresets && (
                            <IconButton
                              icon="filter-outline"
                              size="sm"
                              intent="ghost"
                              tooltip="Toggle presets"
                              tooltipPortal={false}
                              onClick={() => setPresetsOpen((v) => !v)}
                            />
                          )}
                          <div className="ml-auto flex items-center gap-3">
                            <Button
                              size="sm"
                              intent="ghost"
                              onClick={() => {
                                state.setValue({
                                  start: null!,
                                  end: null!,
                                })
                                onChange?.(null)
                              }}
                            >
                              {clearLabel}
                            </Button>
                            <Button
                              size="sm"
                              intent="primary"
                              onClick={() => {
                                state.setOpen(false)
                              }}
                            >
                              {applyLabel}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Dialog>
                  </motion.div>
                </AnimatePresence>
              </Popover>
            </>
          )}
        </RADateRangePicker>
      </I18nProvider>
    )
  }
)

DateRangePicker.displayName = "DateRangePicker"
