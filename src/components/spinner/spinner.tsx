import React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const BLADE_COUNT = 12
const BASE_DELAY = -1.667

const spinnerVariants = cva("relative inline-block", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-5",
      md: "size-6",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

type SpinnerProps = Pick<React.ComponentProps<"div">, "className"> &
  VariantProps<typeof spinnerVariants> & {
    label?: string
  }

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, label = "Loading", ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      >
        {Array.from({ length: BLADE_COUNT }).map((_, i) => (
          <span
            key={i}
            className="spinner-blade"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-130%)`,
              animationDelay: `${BASE_DELAY + i * (1 / BLADE_COUNT)}s`,
            }}
          />
        ))}
      </div>
    )
  }
)

Spinner.displayName = "Spinner"
