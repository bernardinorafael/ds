import React from "react"

export function getIconId(name: string, size: "sm" | "base"): string {
  return `icon__${name}--${size}`
}

export const VIEWBOX = {
  sm: "0 0 16 16",
  base: "0 0 20 20",
} as const

/**
 * SVG symbol definitions. Each icon requires both `sm` (16×16) and `base` (20×20) paths.
 * Paths are drawn for each size — not scaled — to preserve stroke quality.
 *
 * Stroke icons: no fill/stroke on elements (inherited from SVG root).
 * Fill icons: add `fill="currentColor" stroke="none"` (overrides SVG root's fill="none").
 * Two-tone icons: apply `className="fill-[--icon-fill,currentColor]"` + `fillOpacity={0.15}`
 * to the secondary path. The Icon component controls `--icon-fill` via the `fill` prop.
 */
export const _SYMBOLS = {
  info: {
    base: (
      <path
        fill="currentColor"
        stroke="none"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1C14.97 1 19 5.03 19 10C19 14.97 14.97 19 10 19C5.03 19 1 14.97 1 10C1 5.03 5.03 1 10 1ZM10 6C10.552 6 11 6.448 11 7C11 7.552 10.552 8 10 8C9.448 8 9 7.552 9 7C9 6.448 9.448 6 10 6ZM9 9.5H11V15H9Z"
      />
    ),
    sm: (
      <path
        fill="currentColor"
        stroke="none"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1ZM8 4.75C8.414 4.75 8.75 5.086 8.75 5.5C8.75 5.914 8.414 6.25 8 6.25C7.586 6.25 7.25 5.914 7.25 5.5C7.25 5.086 7.586 4.75 8 4.75ZM7.25 7.5H8.75V12H7.25Z"
      />
    ),
  },
} satisfies Record<string, { sm: React.ReactNode; base: React.ReactNode }>

export type IconName = keyof typeof _SYMBOLS
