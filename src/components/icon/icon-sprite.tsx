import { _SYMBOLS, getIconId, VIEWBOX } from "./icons"

/**
 * Renders all icon symbols into the DOM as a hidden SVG sprite.
 * Must be mounted once at the application root before any Icon is rendered.
 *
 * @example
 * // app/layout.tsx
 * import { IconSprite } from "@acme/ds"
 * export default function Layout({ children }) {
 *   return <html><body><IconSprite />{children}</body></html>
 * }
 */
export function IconSprite() {
  return (
    <svg aria-hidden className="sr-only absolute">
      {(Object.keys(_SYMBOLS) as Array<keyof typeof _SYMBOLS>).flatMap((name) =>
        (["sm", "base"] as const).map((size) => (
          <symbol
            key={getIconId(name, size)}
            id={getIconId(name, size)}
            viewBox={VIEWBOX[size]}
          >
            {_SYMBOLS[name][size]}
          </symbol>
        ))
      )}
    </svg>
  )
}

IconSprite.displayName = "IconSprite"
