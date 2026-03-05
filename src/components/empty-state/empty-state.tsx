import React from "react"

import { Icon, type IconName } from "@/components/icon"

type EmptyStateProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className"
> & {
  /**
   * Icon name from the DS icon set
   */
  icon?: IconName
  /**
   * Heading text
   */
  title: string
  /**
   * Supportive text below the title
   */
  description?: string
  /**
   * Actions rendered below the description (buttons, links)
   */
  children?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, children, ...props }, forwardedRef) => {
    return (
      <div ref={forwardedRef} {...props}>
        <div className="flex flex-col items-start gap-3">
          {icon && (
            <div className="bg-surface-100 text-word-secondary flex size-10 items-center justify-center rounded-lg">
              <Icon name={icon} size="lg" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h3 className="text-word-primary text-base font-medium">{title}</h3>

            {description && (
              <p className="text-word-secondary max-w-md text-sm">{description}</p>
            )}
          </div>

          {children && <div className="mt-1 flex items-center gap-2">{children}</div>}
        </div>
      </div>
    )
  }
)

EmptyState.displayName = "EmptyState"
