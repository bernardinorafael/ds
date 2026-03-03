import React from "react"

import { getDayOfWeek, getLocalTimeZone, today } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"
import { I18nProvider } from "react-aria"
import {
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  Button as RAButton,
  Calendar as RACalendar,
  CalendarCell as RACalendarCell,
  CalendarGrid as RACalendarGrid,
  RangeCalendar as RARangeCalendar,
  type DateValue,
  type CalendarProps as RACalendarProps,
  type RangeCalendarProps as RARangeCalendarProps,
} from "react-aria-components"

import { Icon } from "@/components/icon"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type CalendarContextValue = {
  mode: "single" | "range"
}

const CalendarContext = React.createContext<CalendarContextValue | null>(null)

function useCalendarContext() {
  const ctx = React.useContext(CalendarContext)
  if (!ctx) {
    throw new Error("Calendar compound components must be used within <Calendar>")
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Calendar (Root)
// ---------------------------------------------------------------------------

type CalendarSingleProps = {
  mode?: "single"
} & Pick<
  RACalendarProps<DateValue>,
  | "value"
  | "defaultValue"
  | "onChange"
  | "focusedValue"
  | "onFocusChange"
  | "minValue"
  | "maxValue"
  | "isDisabled"
  | "autoFocus"
  | "visibleDuration"
>

type CalendarRangeProps = {
  mode: "range"
} & Pick<
  RARangeCalendarProps<DateValue>,
  | "value"
  | "defaultValue"
  | "onChange"
  | "focusedValue"
  | "onFocusChange"
  | "minValue"
  | "maxValue"
  | "isDisabled"
  | "autoFocus"
  | "visibleDuration"
>

export type CalendarRootProps = (CalendarSingleProps | CalendarRangeProps) & {
  /**
   * Calendar content (Header, Grid)
   */
  children: React.ReactNode
  className?: string
  /**
   * Locale for date formatting and week start day @default "en-US"
   */
  locale?: string
  /**
   * Enables scroll-to-navigate: mouse wheel changes month
   */
  scrollNavigation?: boolean
}

const CalendarRoot = React.forwardRef<HTMLDivElement, CalendarRootProps>(
  (
    {
      children,
      className,
      mode = "single",
      locale = "en-US",
      scrollNavigation,
      ...props
    },
    forwardedRef
  ) => {
    const [internalFocusedDate, setInternalFocusedDate] = React.useState<CalendarDate>(
      () => today(getLocalTimeZone())
    )

    const focusedValue = props.focusedValue ?? internalFocusedDate
    const onFocusChange = props.onFocusChange ?? setInternalFocusedDate

    const handleWheel = React.useCallback(
      (e: React.WheelEvent<HTMLDivElement>) => {
        if (!scrollNavigation) return
        e.preventDefault()
        const current = focusedValue as CalendarDate
        if (e.deltaY > 0) {
          onFocusChange(current.add({ months: 1 }) as CalendarDate & DateValue)
        } else {
          onFocusChange(current.subtract({ months: 1 }) as CalendarDate & DateValue)
        }
      },
      [scrollNavigation, focusedValue, onFocusChange]
    )

    const sharedProps = {
      ...props,
      focusedValue,
      onFocusChange,
    }

    return (
      <I18nProvider locale={locale}>
        <CalendarContext.Provider value={{ mode }}>
          <div ref={forwardedRef} className={className} onWheel={handleWheel}>
            {mode === "range" ? (
              <RARangeCalendar {...(sharedProps as RARangeCalendarProps<DateValue>)}>
                {children}
              </RARangeCalendar>
            ) : (
              <RACalendar {...(sharedProps as RACalendarProps<DateValue>)}>
                {children}
              </RACalendar>
            )}
          </div>
        </CalendarContext.Provider>
      </I18nProvider>
    )
  }
)

CalendarRoot.displayName = "Calendar"

// ---------------------------------------------------------------------------
// Calendar.Header
// ---------------------------------------------------------------------------

const navButtonClassName = cn(
  // layout
  "inline-flex",
  "shrink-0",
  "items-center",
  "justify-center",

  // visual — ghost circle sm
  "size-6",
  "rounded-full",
  "cursor-pointer",
  "select-none",
  "bg-transparent",
  "text-foreground",
  "not-disabled:hover:bg-black/6",

  // transitions
  "transition-colors",
  "duration-300",

  // focus states
  "outline-none",
  "focus-visible:ring-[3px]",
  "focus-visible:ring-[color-mix(in_srgb,black_13%,transparent)]",
  "focus-visible:ring-offset-1",
  "focus-visible:ring-offset-[color-mix(in_srgb,black_15%,transparent)]",

  // disabled states
  "disabled:cursor-not-allowed",
  "disabled:opacity-50"
)

export type CalendarHeaderProps = {
  className?: string
}

const CalendarHeader = React.forwardRef<HTMLElement, CalendarHeaderProps>(
  ({ className }, forwardedRef) => {
    return (
      <header
        ref={forwardedRef}
        className={cn("mx-0.5 mb-1 flex items-center justify-between", className)}
      >
        <RAButton slot="previous" className={navButtonClassName}>
          <Icon name="chevron-left-outline" size="sm" aria-label="Previous month" />
        </RAButton>

        <Heading className="font-book text-foreground m-0 text-sm lowercase" />

        <RAButton slot="next" className={navButtonClassName}>
          <Icon name="chevron-right-outline" size="sm" aria-label="Next month" />
        </RAButton>
      </header>
    )
  }
)

CalendarHeader.displayName = "Calendar.Header"

// ---------------------------------------------------------------------------
// Calendar.Grid
// ---------------------------------------------------------------------------

export type CalendarGridProps = {
  className?: string
  /**
   * Day name style @default "short"
   */
  weekdayStyle?: "short" | "long" | "narrow"
  /**
   * Offset from the start of the visible range (e.g. `{ months: 1 }` for second month)
   */
  offset?: { months?: number; days?: number; years?: number }
}

const CalendarGrid = React.forwardRef<HTMLTableElement, CalendarGridProps>(
  ({ className, weekdayStyle = "short", offset }, forwardedRef) => {
    const { mode } = useCalendarContext()

    return (
      <RACalendarGrid
        ref={forwardedRef}
        weekdayStyle={weekdayStyle}
        offset={offset}
        className={cn(
          "font-book w-full border-separate border-spacing-x-1 border-spacing-y-1.5 text-sm",
          className
        )}
      >
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell>
              <div className="font-book text-gray-1100 ml-0.5 grid size-7 place-items-center lowercase">
                {day.slice(0, 2)}
              </div>
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>

        <CalendarGridBody>
          {(date) => (
            <RACalendarCell
              date={date}
              className={({
                isSelected,
                isSelectionStart,
                isSelectionEnd,
                isOutsideMonth,
                isDisabled,
              }) => {
                const dayOfWeek = getDayOfWeek(date, "en-US")
                const isEdge = isSelectionStart || isSelectionEnd
                const isRoundedLeft =
                  isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1)
                const isRoundedRight =
                  isSelected &&
                  (isSelectionEnd ||
                    dayOfWeek === 6 ||
                    date.day === date.calendar.getDaysInMonth(date))

                const isToday = date.compare(today(getLocalTimeZone())) === 0
                const isRangeMiddle = isSelected && mode === "range" && !isEdge

                return cn(
                  // base
                  "text-gray-1200 isolate z-1 ml-0.5 flex size-7 cursor-pointer items-center justify-center",

                  // selected range band (all selected cells in range mode, including edges)
                  isSelected &&
                    mode === "range" &&
                    "text-primary bg-purple-300 ring-[3.5px] ring-purple-300",

                  // range middle text stays purple
                  isRangeMiddle && "text-primary",

                  // selection edges (start/end) — premium gradient pill on top of range band
                  isEdge && [
                    "relative",
                    "text-white",
                    "[text-shadow:0_1px_2px_0_rgb(0_0_0/20%)]",
                    "after:absolute",
                    "after:inset-0",
                    "after:z-[-1]",
                    "after:size-7",
                    "after:rounded-full",
                    "after:content-['']",
                    "after:[background:linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_100%),var(--color-primary)]",
                    "after:shadow-[0px_0px_8px_-2px_rgba(255,255,255,0.10)_inset,0px_3px_1px_-2px_rgb(255,255,255,0.08)_inset,0px_4px_4px_-3px_rgba(0,0,0,0.32),0px_0px_0px_1px_var(--color-primary)]",
                  ],

                  // selected single (non-range) — gradient pill
                  isSelected &&
                    mode === "single" && [
                      "relative",
                      "text-white",
                      "[text-shadow:0_1px_2px_0_rgb(0_0_0/20%)]",
                      "after:absolute",
                      "after:inset-0",
                      "after:z-[-1]",
                      "after:size-7",
                      "after:rounded-full",
                      "after:content-['']",
                      "after:[background:linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_100%),var(--color-primary)]",
                      "after:shadow-[0px_0px_8px_-2px_rgba(255,255,255,0.10)_inset,0px_3px_1px_-2px_rgb(255,255,255,0.08)_inset,0px_4px_4px_-3px_rgba(0,0,0,0.32),0px_0px_0px_1px_var(--color-primary)]",
                    ],

                  // idle (not selected, not outside month)
                  !isSelected &&
                    !isOutsideMonth &&
                    "rounded-full hover:bg-gray-300/70 hover:ring-2 hover:ring-gray-300/70",

                  // range edge rounding
                  isRoundedLeft && "rounded-l-full",
                  isRoundedRight && "rounded-r-full",

                  // outside month — hidden
                  isOutsideMonth && "invisible",

                  // disabled (min/max range)
                  !isOutsideMonth &&
                    isDisabled &&
                    "cursor-default text-gray-800 hover:bg-transparent hover:ring-transparent",

                  // today (not selected)
                  isToday &&
                    !isSelected &&
                    "hover:bg-surface-100 shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.06),0px_0px_0px_1px_rgba(25,28,33,0.12),0px_4px_4px_-2px_rgba(0,0,0,0.04)] hover:ring-0 hover:ring-transparent",

                  // focus
                  "focus-visible:ring-primary/50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                )
              }}
            />
          )}
        </CalendarGridBody>
      </RACalendarGrid>
    )
  }
)

CalendarGrid.displayName = "Calendar.Grid"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Calendar = Object.assign(CalendarRoot, {
  Header: CalendarHeader,
  Grid: CalendarGrid,
})
