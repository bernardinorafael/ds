import React, { type CSSProperties } from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { IconButton } from "@/components/icon-button"
import { Select } from "@/components/select"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaginationProps = {
  count: number
  limit: number
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export type DataTableRootProps = Pick<
  React.ComponentProps<"section">,
  "id" | "className" | "aria-label" | "aria-labelledby"
> &
  VariantProps<typeof rootVariants> & {
    /**
     * Table content — Head, Body, etc.
     */
    children: React.ReactNode
    /**
     * Pagination state and callbacks. Footer appears automatically when provided
     * and `count > Math.min(...limitOptions)`.
     */
    pagination?: PaginationProps
    /**
     * Page size options shown in the footer select @default [10, 25, 50]
     */
    limitOptions?: number[]
  }

export type DataTableHeaderProps = Pick<
  React.ComponentProps<"th">,
  "abbr" | "children" | "className" | "colSpan" | "headers" | "rowSpan" | "scope"
> & {
  /**
   * Fixed column width. Applied via CSS custom property so it participates in
   * the `table-fixed` layout.
   */
  width?: CSSProperties["width"]
  /**
   * Visually hide the header text while keeping it accessible to screen readers.
   */
  srOnly?: boolean
}

export type DataTableCellProps = Pick<
  React.ComponentProps<"td">,
  "children" | "className" | "colSpan" | "headers" | "rowSpan"
> &
  VariantProps<typeof cellVariants>

// ---------------------------------------------------------------------------
// SlidingNumber (internal — not exported)
// ---------------------------------------------------------------------------

function SlidingNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const DEFAULT_LIMIT_OPTIONS = [10, 25, 50]

const rootVariants = cva(
  [
    // layout
    "flex",
    "flex-col",
    "isolate",
    "relative",

    // visual
    "rounded-3xl",
    "overflow-hidden",
    "bg-(--data-table-bg)",

    // outer padding (1px gap between header area and body ring)
    "p-(--data-table-p)",

    // ─── CSS custom property defaults ───────────────────────────────────────
    // structure
    "[--data-table-p:0.25rem]",
    "[--data-table-border-width:1px]",

    // backgrounds
    "[--data-table-bg:var(--color-surface-100)]",
    "[--data-table-cell-bg:var(--color-surface-200)]",

    // body shape
    "[--data-table-body-rounded:var(--radius-xl)]",

    // header
    "[--data-table-header-px:var(--data-table-cell-px)]",
    "[--data-table-header-pt:0.75rem]",
    "[--data-table-header-leading:1rem]",
    "[--data-table-header-pb:calc(var(--data-table-header-pt)-var(--data-table-border-width))]",
    "[--data-table-head-height:calc(var(--data-table-header-pt)+var(--data-table-header-pb)+var(--data-table-header-leading))]",
  ],
  {
    variants: {
      spacing: {
        compact: "[--data-table-cell-px:1rem] [--data-table-cell-py:0.75rem]",
        cozy: "[--data-table-cell-px:1rem] [--data-table-cell-py:1rem]",
      },
    },
    defaultVariants: {
      spacing: "cozy",
    },
  }
)

const cellVariants = cva(
  [
    // layout
    "text-left",
    "overflow-hidden",
    "bg-clip-padding",

    // spacing (from CSS vars set by root spacing variant)
    "px-(--data-table-cell-px)",
    "py-(--data-table-cell-py)",

    // background
    "bg-(--data-table-cell-bg)",

    // border color for row separators (border-width is controlled by Row's sibling selector)
    "border-border",
  ],
  {
    variants: {
      /**
       * Remove left padding — useful for the first column when the table
       * has a leading icon or checkbox.
       */
      flushLeft: {
        true: "pl-0",
      },
      /**
       * Remove right padding — useful for the last column that contains
       * action buttons.
       */
      flushRight: {
        true: "pr-0",
      },
    },
    defaultVariants: {
      flushLeft: false,
      flushRight: false,
    },
  }
)

// ---------------------------------------------------------------------------
// DataTableRoot
// ---------------------------------------------------------------------------

const DataTableRoot = React.forwardRef<HTMLTableElement, DataTableRootProps>(
  (
    {
      id,
      className,
      children,
      pagination,
      spacing = "cozy",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      limitOptions = DEFAULT_LIMIT_OPTIONS,
    },
    forwardedRef
  ) => {
    const pageEnd = React.useMemo(
      () => (pagination ? Math.ceil(pagination.count / pagination.limit) : 0),
      [pagination]
    )

    const rangeStart = React.useMemo(
      () => (pagination ? (pagination.page - 1) * pagination.limit + 1 : 0),
      [pagination]
    )

    const rangeEnd = React.useMemo(
      () =>
        pagination ? Math.min(pagination.page * pagination.limit, pagination.count) : 0,
      [pagination]
    )

    const minLimitOption = Math.min(...limitOptions)
    const showFooter =
      !!pagination && pagination.count > 0 && pagination.count > minLimitOption

    const handlePreviousPage = React.useCallback(() => {
      if (pagination?.hasPreviousPage) {
        pagination.onPageChange(pagination.page - 1)
      }
    }, [pagination])

    const handleNextPage = React.useCallback(() => {
      if (pagination?.hasNextPage) {
        pagination.onPageChange(pagination.page + 1)
      }
    }, [pagination])

    return (
      <section
        id={id}
        data-table-root=""
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={rootVariants({ className, spacing })}
      >
        {/* ── Table area ────────────────────────────────────────────────── */}
        <div
          className={cn(
            "relative isolate order-1 -mt-(--data-table-p)",
            // Head gradient masks — fade left/right edges at header level
            "before:absolute before:top-0 before:left-0 before:z-1 before:h-(--data-table-head-height)",
            "before:bg-linear-to-r before:from-(--data-table-bg) before:to-transparent",
            "after:absolute after:top-0 after:right-0 after:z-1",
            "after:h-(--data-table-head-height) after:w-(--data-table-header-px)",
            "after:bg-linear-to-l after:from-(--data-table-bg) after:to-transparent"
          )}
        >
          {/* Body background (visible on overscroll in macOS Safari) */}
          <div
            className={cn(
              "after:absolute after:inset-0 after:top-(--data-table-head-height)",
              "after:-z-1 after:rounded-(--data-table-body-rounded) after:bg-(--data-table-cell-bg)"
            )}
          >
            {/* Clip overflow + body border + shadow */}
            <div
              className={cn(
                "overflow-hidden",
                // ::after — subtle multi-layer shadow outlines the body
                "after:pointer-events-none after:absolute after:inset-0 after:z-2",
                "after:top-(--data-table-head-height)",
                "after:rounded-(--data-table-body-rounded) after:shadow-xs"
              )}
            >
              {/* Horizontal scroll container */}
              <div className="relative overflow-x-auto overscroll-x-contain">
                <table
                  ref={forwardedRef}
                  className="relative w-full table-fixed caption-bottom whitespace-nowrap"
                >
                  {children}
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pagination footer ─────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {showFooter && (
            <motion.footer
              data-table-footer=""
              className="z-1 order-2 overflow-hidden select-none"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, opacity: { delay: 0.1 } }}
            >
              <div className="-mb-(--data-table-p) flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--data-table-cell-px) py-3">
                {/* Left: count display + limit select */}
                <div className="order-1 flex shrink-0 items-center gap-2">
                  <span className="text-word-secondary text-xs font-medium">
                    {pagination!.count > 0
                      ? `${rangeStart}–${rangeEnd} of ${pagination!.count}`
                      : "No results"}
                  </span>

                  <label
                    htmlFor="data-table-limit-select"
                    className="inline-flex items-center gap-2"
                  >
                    <span className="text-word-secondary text-xs">Results per page</span>
                    <Select
                      size="sm"
                      className="w-14"
                      position="fixed"
                      aria-label="Rows per page"
                      id="data-table-limit-select"
                      onValueChange={(v) => pagination!.onLimitChange(Number(v))}
                      value={String(pagination!.limit)}
                      items={limitOptions.map((v) => ({
                        label: String(v),
                        value: String(v),
                      }))}
                    />
                  </label>
                </div>

                {/* Right: previous / page indicator / next */}
                <AnimatePresence initial={false}>
                  <motion.div
                    data-table-pagination=""
                    className="order-2 flex shrink-0 items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconButton
                      icon="chevron-left"
                      size="sm"
                      intent="secondary"
                      disabled={!pagination!.hasPreviousPage}
                      onClick={handlePreviousPage}
                      aria-label="Previous page"
                    />

                    <span className="text-word-secondary flex items-center gap-0.5 text-xs font-medium">
                      <span className="text-word-primary">
                        <SlidingNumber value={pagination!.page} />
                      </span>
                      <span>/</span>
                      <span className="text-word-primary">{pageEnd}</span>
                    </span>

                    <IconButton
                      icon="chevron-right"
                      size="sm"
                      intent="secondary"
                      disabled={!pagination!.hasNextPage}
                      onClick={handleNextPage}
                      aria-label="Next page"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </section>
    )
  }
)

DataTableRoot.displayName = "DataTable"

// ---------------------------------------------------------------------------
// DataTableHead
// ---------------------------------------------------------------------------

const DataTableHead = React.forwardRef<
  HTMLTableSectionElement,
  Pick<React.HTMLAttributes<HTMLTableSectionElement>, "children" | "className">
>((props, ref) => <thead ref={ref} {...props} />)

DataTableHead.displayName = "DataTable.Head"

// ---------------------------------------------------------------------------
// DataTableHeader
// ---------------------------------------------------------------------------

const DataTableHeader = React.forwardRef<HTMLTableCellElement, DataTableHeaderProps>(
  ({ width, children, className, srOnly, ...rest }, ref) => (
    <th
      ref={ref}
      className={cn(
        // hide sort spacer when a sort icon is present
        "[&:has([data-table-sort])_[data-table-sort-spacer]]:hidden",
        // layout
        "overflow-hidden text-left",
        // typography
        "text-sm font-medium",
        "leading-(--data-table-header-leading)",
        "text-word-secondary",
        // spacing
        "px-(--data-table-header-px)",
        "pt-(--data-table-header-pt)",
        "pb-(--data-table-header-pb)",
        // width (set via CSS var so table-fixed respects it)
        width && "w-(--data-table-header-w)",
        className
      )}
      style={
        width ? ({ "--data-table-header-w": width } as React.CSSProperties) : undefined
      }
      {...rest}
    >
      <span className={cn("inline-flex items-center", srOnly && "sr-only")}>
        {children}
        <span data-table-sort-spacer="" className="ml-1 size-4 shrink-0 bg-transparent" />
      </span>
    </th>
  )
)

DataTableHeader.displayName = "DataTable.Header"

// ---------------------------------------------------------------------------
// DataTableBody
// ---------------------------------------------------------------------------

const DataTableBody = React.forwardRef<
  HTMLTableSectionElement,
  Pick<React.ComponentProps<"tbody">, "children" | "className">
>(({ className, ...rest }, ref) => (
  <tbody
    className={cn(
      "relative",
      "[&>tr:first-child>td:first-child]:rounded-tl-(--data-table-body-rounded)",
      "[&>tr:first-child>td:last-child]:rounded-tr-(--data-table-body-rounded)",
      "[&>tr:last-child>td:first-child]:rounded-bl-(--data-table-body-rounded)",
      "[&>tr:last-child>td:last-child]:rounded-br-(--data-table-body-rounded)",
      className
    )}
    ref={ref}
    {...rest}
  />
))

DataTableBody.displayName = "DataTable.Body"

// ---------------------------------------------------------------------------
// DataTableRow
// ---------------------------------------------------------------------------

const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  Pick<React.ComponentProps<"tr">, "children" | "className">
>((props, ref) => (
  <tr
    className={cn(
      "group/table-row text-base",

      // 1px separator between consecutive rows (applied directly to cells)
      "[&+&>*]:border-t"
    )}
    ref={ref}
    {...props}
  />
))

DataTableRow.displayName = "DataTable.Row"

// ---------------------------------------------------------------------------
// DataTableCell
// ---------------------------------------------------------------------------

const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(
  ({ className, flushLeft, flushRight, ...rest }, ref) => (
    <td
      data-table-cell=""
      className={cn(cellVariants({ flushLeft, flushRight, className }))}
      ref={ref}
      {...rest}
    />
  )
)

DataTableCell.displayName = "DataTable.Cell"

// ---------------------------------------------------------------------------
// DataTableActions
// ---------------------------------------------------------------------------

const DataTableActions = React.forwardRef<
  HTMLDivElement,
  Pick<React.HTMLAttributes<HTMLDivElement>, "children" | "className">
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-center", className)} {...props}>
    {children}
  </div>
))

DataTableActions.displayName = "DataTable.Actions"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const DataTable = Object.assign(DataTableRoot, {
  Head: DataTableHead,
  Header: DataTableHeader,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
  Actions: DataTableActions,
})
