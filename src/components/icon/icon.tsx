import React from "react"

import { cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

import { getIconId, VIEWBOX, type IconName } from "./icons"

const iconVariants = cva("shrink-0 overflow-visible stroke-[1.25]", {
  variants: {
    size: {
      sm: "size-4",
      base: "size-5",
    },
    fill: {
      /**
       * Removes the secondary fill from two-tone icons by setting
       * `--icon-fill: transparent`. Has no effect on single-color icons.
       */
      transparent: "[--icon-fill:transparent]",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

export type IconProps = {
  /**
   * Icon identifier
   */
  name: IconName
  /**
   * Size variant @default "base"
   */
  size?: "sm" | "base"
  /**
   * Removes secondary fill from two-tone icons
   */
  fill?: "transparent"
  className?: string
  /**
   * Accessible label for screen readers.
   * When provided, removes `aria-hidden` and adds `role="img"`.
   */
  "aria-label"?: string
  "aria-hidden"?: boolean
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      fill,
      className,
      size = "base",
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden = true,
    },
    forwardedRef
  ) => (
    <svg
      ref={forwardedRef}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox={VIEWBOX[size]}
      aria-hidden={ariaLabel ? undefined : ariaHidden}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
      className={cn(iconVariants({ size, fill }), className)}
      data-icon=""
    >
      <use href={`#${getIconId(name, size)}`} />
    </svg>
  )
)

Icon.displayName = "Icon"
