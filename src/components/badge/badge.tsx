import React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const badgeVariants = cva(
  [
    // positioning
    "relative",
    "isolate",

    // layout
    "inline-flex",
    "flex-none",
    "items-center",

    // visual
    "rounded-sm",
    "bg-clip-border",
    "whitespace-nowrap",
    "font-medium",

    // overlay
    "after:absolute",
    "after:inset-0",
    "after:rounded-[inherit]",
    "after:bg-linear-to-b",
    "after:from-transparent",
    "after:to-black",
    "after:opacity-[0.02]",
  ],
  {
    variants: {
      intent: {
        secondary: ["border-gray-500", "bg-gray-200", "text-gray-1000"],
        success: ["border-green-500", "bg-green-200", "text-green-1000"],
        warning: ["border-orange-500", "bg-orange-200", "text-orange-1000"],
        info: ["border-blue-500", "bg-blue-200", "text-blue-1000"],
        danger: ["border-red-500", "bg-red-200", "text-red-1000"],
        primary: ["border-purple-500", "bg-purple-200", "text-purple-1000"],
        beta: ["bg-blue-200", "text-blue-1000"],
        slate: [
          "border-black/16",
          "bg-gray-900",
          "text-white",

          "before:absolute",
          "before:inset-0",
          "before:rounded-[inherit]",
          "before:bg-black/8",
        ],
        pro: [
          "overflow-hidden",
          "bg-gray-1200",
          "text-white",
          "shadow-[0_1px_2px,0_1px_2px]",
          "shadow-black/10",

          "before:absolute",
          "before:inset-0",
          "before:rounded-[inherit]",
          "before:shadow-[inset_0_1px_0,inset_0_0_0_1px]",
          "before:shadow-white/10",
        ],
        "add-on": [
          "border",
          "border-dashed",
          "border-blue-700",
          "bg-blue-200",
          "text-blue-1000",
        ],
      },
      size: {
        sm: ["text-xs", "px-1.25", "py-px"],
        md: ["text-sm", "px-2", "py-0.5"],
      },
    },
    compoundVariants: [
      {
        intent: [
          "secondary",
          "success",
          "warning",
          "info",
          "danger",
          "primary",
          "slate",
          "add-on",
        ],
        className: "border",
      },
      {
        intent: "pro",
        size: "sm",
        className: ["px-1.5", "py-0.5"],
      },
      {
        intent: "pro",
        size: "md",
        className: ["px-2.5", "py-1"],
      },
      {
        intent: "beta",
        size: "sm",
        className: "px-1",
      },
      {
        intent: "beta",
        size: "md",
        className: "px-1.5",
      },
    ],
    defaultVariants: {
      intent: "secondary",
      size: "sm",
    },
  }
)

type BadgeProps = Pick<React.ComponentProps<"span">, "className"> &
  VariantProps<typeof badgeVariants> & {
    children: React.ReactNode
  }

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, intent, size, children, ...props }, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className={cn(badgeVariants({ intent, size }), className)}
        {...props}
      >
        {intent === "pro" && <ProShimmer />}
        {intent === "beta" && <BetaBorder />}
        <span className="relative">{children}</span>
      </span>
    )
  }
)

Badge.displayName = "Badge"

function ProShimmer() {
  return (
    <span
      className={cn(
        "animate-badge-shimmer absolute inset-y-0 right-full w-full",
        "bg-[linear-gradient(60deg,transparent,rgba(255,255,255,0.4)_50%,transparent_51%)]"
      )}
    />
  )
}

function BetaBorder() {
  return (
    <span className="absolute inset-0">
      <DashedLine
        dashArray="3.4 1"
        className="absolute -inset-x-0.75 -top-[0.03125rem] text-blue-700"
      />
      <DashedLine
        dashArray="3.4 1"
        className="absolute -inset-x-0.75 -bottom-[0.03125rem] text-blue-700"
      />
      <DashedLine
        vertical
        dashArray="3 1"
        className="absolute -inset-y-0.5 left-[0.5px] text-blue-700"
      />
      <DashedLine
        vertical
        dashArray="3 1"
        className="absolute -inset-y-0.5 right-[0.5px] text-blue-700"
      />
    </span>
  )
}

function DashedLine({
  className,
  dashArray = "0",
  vertical = false,
}: {
  className?: string
  dashArray?: string
  vertical?: boolean
}) {
  const STROKE_WIDTH = 1

  return (
    <span className={cn("block transform-gpu", className)}>
      <svg
        width={vertical ? STROKE_WIDTH : "100%"}
        height={vertical ? "100%" : STROKE_WIDTH}
      >
        <line
          x1={vertical ? STROKE_WIDTH / 2 : 0}
          y1={vertical ? 0 : STROKE_WIDTH / 2}
          x2={vertical ? STROKE_WIDTH / 2 : "100%"}
          y2={vertical ? "100%" : STROKE_WIDTH / 2}
          style={{
            stroke: "currentColor",
            strokeDasharray: dashArray,
            strokeWidth: STROKE_WIDTH,
          }}
        />
      </svg>
    </span>
  )
}
