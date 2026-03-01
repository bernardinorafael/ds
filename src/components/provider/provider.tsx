import { IconSprite } from "@/components/icon"
import { TooltipProvider } from "@/components/tooltip"

type ProviderProps = {
  /**
   * App content
   */
  children: React.ReactNode
}

/**
 * Root provider for the DS. Add once at the top of your app tree.
 *
 * Handles global setup:
 * - `TooltipProvider` — enables instant skip-delay transitions between tooltips
 * - `IconSprite` — injects the SVG sprite required by all `Icon` and `IconButton` components
 */
export function Provider({ children }: ProviderProps) {
  return (
    <TooltipProvider>
      <IconSprite />
      {children}
    </TooltipProvider>
  )
}
