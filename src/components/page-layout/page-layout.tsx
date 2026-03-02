import React from "react"

import { cn } from "@/utils/cn"

type PageLayoutProps = Pick<
  React.ComponentProps<"article">,
  "id" | "aria-label" | "className"
> & {
  /** Page title rendered as an h2 */
  title?: React.ReactNode
  /** Badge displayed inline with the title */
  titleBadge?: React.ReactNode
  /** Page description rendered below the title */
  description?: React.ReactNode
  /** Metadata badges next to description, separated by vertical dividers */
  badges?: React.ReactNode
  /** Content rendered below description */
  afterDescription?: React.ReactNode
  /** Action buttons aligned to the right of the header */
  actions?: React.ReactNode
  /** Slot for back navigation (router-agnostic) */
  backAction?: React.ReactNode
  /** Page body content */
  children?: React.ReactNode
}

const PageLayout = React.forwardRef<HTMLElement, PageLayoutProps>(
  (
    {
      className,
      title,
      titleBadge,
      description,
      badges,
      afterDescription,
      actions,
      backAction,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const hasHeader = title || description

    return (
      <article
        ref={forwardedRef}
        className={cn("group h-full space-y-8 overflow-x-hidden", className)}
        {...props}
      >
        {hasHeader && (
          <header className="relative flex w-full flex-col gap-4 pb-6">
            {backAction && <div className="mb-2">{backAction}</div>}

            <div className="flex w-full items-end justify-between gap-4">
              <div className={cn("flex flex-col", titleBadge ? "gap-2" : "gap-0.5")}>
                {title && (
                  <div className={cn(titleBadge && "flex items-center gap-2")}>
                    <h2 className="truncate text-2xl font-medium tracking-tight [&+*]:shrink-0">
                      {title}
                    </h2>
                    {titleBadge && <span>{titleBadge}</span>}
                  </div>
                )}

                {(description || badges) && (
                  <div className="flex gap-2">
                    {description && (
                      <div className="text-word-secondary">{description}</div>
                    )}

                    {badges && (
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          description && "border-l border-gray-400 pl-2"
                        )}
                      >
                        {React.Children.toArray(
                          React.isValidElement(badges) &&
                            badges.type === React.Fragment
                            ? badges.props.children
                            : badges
                        ).map((badge, index, array) => (
                          <React.Fragment key={index}>
                            {badge}
                            {index < array.length - 1 && (
                              <div className="h-3 w-px bg-gray-400" role="separator" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {afterDescription && <div className="mt-2">{afterDescription}</div>}
              </div>

              {actions && (
                <div className="flex shrink-0 items-center gap-3">{actions}</div>
              )}
            </div>

            <div className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-gray-400" />
          </header>
        )}

        <div data-page-layout-body="" className="h-full">
          {children}
        </div>
      </article>
    )
  }
)

PageLayout.displayName = "PageLayout"

export { PageLayout }
export type { PageLayoutProps }
