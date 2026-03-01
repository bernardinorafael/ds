import { cn } from "@/utils/cn"

export type DataTableToolbarProps = {
  /**
   * Action button slot (right-aligned on desktop, top-right on mobile)
   */
  action?: React.ReactNode
  /**
   * The DataTable to render below the toolbar
   */
  children: React.ReactNode
  /**
   * Search input slot
   */
  search?: React.ReactNode
  /**
   * Sort controls slot
   */
  sort?: React.ReactNode
  /**
   * Filter controls slot
   */
  filter?: React.ReactNode
  /**
   * Custom class name for the outer wrapper
   */
  className?: string
}

export function DataTableToolbar(props: DataTableToolbarProps) {
  const hasControls = props.search || props.sort || props.filter

  return (
    <section className={cn("flex flex-col gap-4", props.className)}>
      {(props.action || hasControls) && (
        <header className={cn("flex items-center justify-between gap-x-8 gap-y-4")}>
          {hasControls && (
            <div className="flex grow items-center gap-3">
              {props.search && <div className="max-w-75 grow">{props.search}</div>}

              {(props.filter || props.sort) && (
                <div className="flex items-center gap-3">
                  {props.filter && <div className="shrink-0">{props.filter}</div>}
                  {props.sort && <div className="shrink-0">{props.sort}</div>}
                </div>
              )}
            </div>
          )}

          {props.action && (
            <div className="flex max-h-8 shrink-0 items-center max-sm:self-end sm:order-2">
              {props.action}
            </div>
          )}
        </header>
      )}

      {props.children}
    </section>
  )
}
