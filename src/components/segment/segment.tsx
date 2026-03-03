import React from "react"

import {
  DateInput,
  DateSegment as RADateSegment,
  type DateInputProps,
} from "react-aria-components"

import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// DateFormatHint (internal)
// ---------------------------------------------------------------------------

const SEGMENT_MAP = ["month", "day", "year"] as const

function DateFormatHint({
  isOpen,
  focusedSegment,
}: {
  isOpen: boolean
  focusedSegment: string | null
}) {
  return (
    <div
      className={cn(
        "absolute top-[34px] left-0 isolate z-30",
        "flex gap-1 rounded-sm bg-[#2A2A2A] px-1.5 py-1 text-sm font-book",
        "shadow-[0px_0px_1px_0px_rgba(255,255,255,0.72),0px_0px_0px_1px_rgba(0,0,0,0.24)_inset,0px_16px_36px_-6px_rgba(0,0,0,0.36),0px_6px_16px_-2px_rgba(0,0,0,0.20)]",
        "transition-opacity",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {(["MM", "/", "DD", "/", "YYYY"] as const).map((label, i) => (
        <span
          key={i}
          className={cn(
            "transition-colors",
            label !== "/" && focusedSegment === SEGMENT_MAP[Math.floor(i / 2)]
              ? "text-white"
              : "text-gray-1000"
          )}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Segment
// ---------------------------------------------------------------------------

export type SegmentProps = Pick<DateInputProps, "slot"> & {
  /**
   * Whether the segment displays an invalid state (red ring)
   */
  isInvalid?: boolean
  className?: string
}

const segmentClassName = (segment: { type: string; isPlaceholder: boolean }) =>
  cn(
    "flex w-full justify-between rounded-xs p-px uppercase caret-transparent transition-colors",
    "focus:bg-purple-400",
    "focus-within:text-gray-1200",
    "data-[type=literal]:text-gray-900",
    "data-[type=month]:w-5 data-[type=month]:place-content-center",
    "data-[type=day]:w-5 data-[type=day]:place-content-center",
    "data-[type=year]:w-10 data-[type=year]:place-content-center",
    segment.isPlaceholder && "tracking-tight text-gray-900 group-focus-within:text-gray-1200"
  )

export const Segment = React.forwardRef<HTMLDivElement, SegmentProps>(
  ({ isInvalid, className, ...props }, forwardedRef) => {
    const [focusedSegment, setFocusedSegment] = React.useState<string | null>(null)
    const [isHintOpen, setIsHintOpen] = React.useState(false)

    return (
      <div ref={forwardedRef} className={cn("relative", className)}>
        <DateInput
          className={cn(
            "group flex h-7 w-[6.625rem] flex-1 items-center justify-start rounded-sm p-1.5",
            "shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.06),0px_0px_0px_1px_rgba(25,28,33,0.12),0px_4px_4px_-2px_rgba(0,0,0,0.04)]",
            isInvalid
              ? "rounded-xs shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.06),0px_0px_0px_1px_rgb(239,68,68),0px_4px_4px_-2px_rgba(0,0,0,0.04)] ring-4 ring-red-900/24 transition-all"
              : "focus-within:ring-[3px] focus-within:ring-black/8 focus-within:ring-offset-1 focus-within:ring-offset-black/2"
          )}
          {...props}
        >
          {(segment) => {
            const handleFocus = () => {
              setIsHintOpen(true)
              setFocusedSegment(segment.type)
            }
            const handleBlur = () => {
              setIsHintOpen(false)
              setFocusedSegment(null)
            }

            return (
              <div onFocus={handleFocus} onBlur={handleBlur}>
                <RADateSegment segment={segment} className={segmentClassName(segment)} />
              </div>
            )
          }}
        </DateInput>

        <DateFormatHint isOpen={isHintOpen} focusedSegment={focusedSegment} />
      </div>
    )
  }
)

Segment.displayName = "Segment"
