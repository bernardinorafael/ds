import React, { type CSSProperties } from "react"
import { createPortal } from "react-dom"

import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { Checkbox } from "@/components/checkbox"
import { Icon } from "@/components/icon"
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
    /**
     * Row selection state from `useRowSelection`. When provided, SelectHeader,
     * SelectCell, Row highlight, and BulkBar read from context automatically.
     */
    selection?: SelectionContextValue
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

export type SortDirection = "asc" | "desc"

export type DataTableSelectHeaderProps = {
  /** Current checked state of the select-all checkbox */
  checked?: boolean
  /** Shows the checkbox in indeterminate state (some rows selected) */
  indeterminate?: boolean
  /** Called when the checkbox is toggled */
  onChange?: () => void
  /** Disables the checkbox */
  disabled?: boolean
}

export type DataTableSelectCellProps = {
  /** Current checked state of the row checkbox */
  checked?: boolean
  /** Called when the checkbox is toggled */
  onChange?: () => void
  /** Disables the checkbox */
  disabled?: boolean
}

export type DataTableSortHeaderProps = Omit<DataTableHeaderProps, "srOnly"> & {
  /**
   * Current sort direction. `undefined` means this column is not actively sorted.
   */
  direction?: SortDirection
  /**
   * Called when the user clicks to sort. Receives the next direction, or
   * `undefined` when the third click clears the sort.
   */
  onSort: (direction: SortDirection | undefined) => void
  /**
   * Accessible label for the column used in the sort button's aria-label.
   * Auto-derived from `children` when it is a plain string.
   */
  label?: string
}

// ---------------------------------------------------------------------------
// Selection Context
// ---------------------------------------------------------------------------

type SelectionContextValue = {
  selectedIds: Set<string>
  isSelected: (id: string) => boolean
  isAllSelected: boolean
  isPartialSelected: boolean
  toggleRow: (id: string) => void
  toggleAll: () => void
  clearSelection: () => void
}

const SelectionContext = React.createContext<SelectionContextValue | null>(null)

function useSelectionContext() {
  return React.useContext(SelectionContext)
}

// ---------------------------------------------------------------------------
// Row Context
// ---------------------------------------------------------------------------

const RowContext = React.createContext<string | null>(null)

function useRowContext() {
  return React.useContext(RowContext)
}

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

    // selection
    "[--data-table-select-col-w:2.5rem]",
    "[--data-table-selected-bg:var(--color-blue-100)]",
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

    // flush left when preceded by a select column
    "[[data-table-select]+&]:pl-0",

    // background
    "bg-(--data-table-cell-bg)",
    "group-data-selected/table-row:bg-(--data-table-selected-bg)",

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
      selection,
      spacing = "cozy",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      limitOptions = DEFAULT_LIMIT_OPTIONS,
    },
    forwardedRef
  ) => {
    const limitSelectId = React.useId()

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

    const content = (
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
                    htmlFor={`${limitSelectId}-limit`}
                    className="inline-flex items-center gap-2"
                  >
                    <span className="text-word-secondary text-xs">Results per page</span>
                    <Select
                      size="sm"
                      className="w-14"
                      position="fixed"
                      aria-label="Rows per page"
                      id={`${limitSelectId}-limit`}
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
                      icon="chevron-left-outline"
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
                      icon="chevron-right-outline"
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

    return selection ? (
      <SelectionContext.Provider value={selection}>
        {content}
      </SelectionContext.Provider>
    ) : (
      content
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
>(({ children, ...rest }, ref) => (
  <thead ref={ref} {...rest}>
    <tr>{children}</tr>
  </thead>
))

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
        "text-word-primary",
        // spacing
        "px-(--data-table-header-px)",
        "pt-(--data-table-header-pt)",
        "pb-(--data-table-header-pb)",
        // flush left when preceded by a select column
        "[[data-table-select]+&]:pl-0",
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
// DataTableSortHeader
// ---------------------------------------------------------------------------

function nextDirection(d?: SortDirection): SortDirection | undefined {
  if (!d) return "asc"
  if (d === "asc") return "desc"
  return undefined
}

const SORT_ICON: Record<string, "chevron-up-outline" | "chevron-down-outline"> = {
  asc: "chevron-up-outline",
  desc: "chevron-down-outline",
}

const DataTableSortHeader = React.forwardRef<
  HTMLTableCellElement,
  DataTableSortHeaderProps
>(({ width, children, className, direction, onSort, label, ...rest }, ref) => {
  const active = !!direction
  const columnLabel = label ?? (typeof children === "string" ? children : "")

  const handleClick = () => onSort(nextDirection(direction))

  return (
    <th
      ref={ref}
      aria-sort={
        direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"
      }
      className={cn(
        // layout
        "overflow-hidden text-left",
        // typography
        "text-sm font-medium",
        "leading-(--data-table-header-leading)",
        "text-word-primary",
        // spacing
        "px-(--data-table-header-px)",
        "pt-(--data-table-header-pt)",
        "pb-(--data-table-header-pb)",
        // flush left when preceded by a select column
        "[[data-table-select]+&]:pl-0",
        // width (set via CSS var so table-fixed respects it)
        width && "w-(--data-table-header-w)",
        className
      )}
      style={
        width ? ({ "--data-table-header-w": width } as React.CSSProperties) : undefined
      }
      {...rest}
    >
      <button
        type="button"
        data-table-sort=""
        aria-label={
          !direction
            ? `Sort ${columnLabel} ascending`
            : direction === "asc"
              ? `Sort ${columnLabel} descending`
              : `Clear ${columnLabel} sort`
        }
        onClick={handleClick}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1",
          "rounded-xs outline-none",
          "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-1"
        )}
      >
        {children}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={direction ?? "idle"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: active ? 1 : 0.4, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex shrink-0"
          >
            <Icon
              name={active ? SORT_ICON[direction!] : "chevron-down-outline"}
              size="sm"
              aria-hidden
            />
          </motion.span>
        </AnimatePresence>
      </button>
    </th>
  )
})

DataTableSortHeader.displayName = "DataTable.SortHeader"

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
  Pick<React.ComponentProps<"tr">, "children" | "className"> & {
    /** Highlights the row as selected */
    selected?: boolean
    /**
     * Row identifier for selection context. When inside a `selection` context,
     * the row auto-derives `selected` and provides the ID to child SelectCell.
     */
    rowId?: string
  }
>(({ selected, rowId, children, ...props }, ref) => {
  const selection = useSelectionContext()

  const isSelected = selected ?? (selection && rowId ? selection.isSelected(rowId) : false)

  const row = (
    <tr
      data-selected={isSelected ? "" : undefined}
      className={cn(
        "group/table-row text-base",

        // 1px separator between consecutive rows (applied directly to cells)
        "[&+&>*]:border-t"
      )}
      ref={ref}
      {...props}
    >
      {children}
    </tr>
  )

  return rowId ? (
    <RowContext.Provider value={rowId}>{row}</RowContext.Provider>
  ) : (
    row
  )
})

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
// DataTableSelectHeader
// ---------------------------------------------------------------------------

function DataTableSelectHeader({
  checked: checkedProp,
  indeterminate: indeterminateProp,
  onChange: onChangeProp,
  disabled,
}: DataTableSelectHeaderProps) {
  const selection = useSelectionContext()

  const checked = checkedProp ?? selection?.isAllSelected ?? false
  const indeterminate = indeterminateProp ?? selection?.isPartialSelected
  const onChange = onChangeProp ?? selection?.toggleAll

  return (
    <th
      data-table-select=""
      className={cn(
        "overflow-hidden",
        "leading-(--data-table-header-leading)",
        "pt-(--data-table-header-pt)",
        "pb-(--data-table-header-pb)",
        "w-(--data-table-select-col-w)"
      )}
    >
      <div className="flex items-center justify-center">
        <Checkbox
          size="sm"
          checked={indeterminate ? "indeterminate" : checked}
          onCheckedChange={() => onChange?.()}
          disabled={disabled}
          aria-label="Select all rows"
        />
      </div>
    </th>
  )
}

DataTableSelectHeader.displayName = "DataTable.SelectHeader"

// ---------------------------------------------------------------------------
// DataTableSelectCell
// ---------------------------------------------------------------------------

function DataTableSelectCell({
  checked: checkedProp,
  onChange: onChangeProp,
  disabled,
}: DataTableSelectCellProps) {
  const selection = useSelectionContext()
  const rowId = useRowContext()

  const checked =
    checkedProp ?? (selection && rowId ? selection.isSelected(rowId) : false)
  const onChange =
    onChangeProp ??
    (selection && rowId ? () => selection.toggleRow(rowId) : undefined)

  return (
    <td
      data-table-cell=""
      data-table-select=""
      className={cn(
        cellVariants({ flushLeft: true, flushRight: true }),
        "w-(--data-table-select-col-w)"
      )}
    >
      <div className="flex items-center justify-center">
        <Checkbox
          size="sm"
          checked={checked}
          onCheckedChange={() => onChange?.()}
          disabled={disabled}
          aria-label="Select row"
        />
      </div>
    </td>
  )
}

DataTableSelectCell.displayName = "DataTable.SelectCell"

// ---------------------------------------------------------------------------
// useSortState
// ---------------------------------------------------------------------------

/**
 * Manages single-column sort state for DataTable.SortHeader.
 *
 * @example
 * const { directionFor, handleSort } = useSortState({ column: "name", direction: "asc" })
 *
 * <DataTable.SortHeader direction={directionFor("name")} onSort={handleSort("name")}>
 *   Name
 * </DataTable.SortHeader>
 */
export function useSortState(initial?: { column: string; direction: SortDirection }) {
  const [sort, setSort] = React.useState(initial)

  const directionFor = (column: string) =>
    sort?.column === column ? sort.direction : undefined

  const handleSort = (column: string) => (direction: SortDirection | undefined) =>
    setSort(direction ? { column, direction } : undefined)

  return { sort, directionFor, handleSort }
}

// ---------------------------------------------------------------------------
// useRowSelection
// ---------------------------------------------------------------------------

/**
 * Manages row selection state for visible rows.
 *
 * @example
 * const { isSelected, isAllSelected, isPartialSelected, toggleRow, toggleAll } =
 *   useRowSelection(rows, { key: "id" })
 */
export function useRowSelection<T>(rows: T[], { key }: { key: keyof T }) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const rowKeys = React.useMemo(() => rows.map((row) => String(row[key])), [rows, key])

  const isAllSelected = React.useMemo(
    () => rowKeys.length > 0 && rowKeys.every((k) => selectedIds.has(k)),
    [rowKeys, selectedIds]
  )

  const isPartialSelected = React.useMemo(
    () => rowKeys.some((k) => selectedIds.has(k)) && !isAllSelected,
    [rowKeys, selectedIds, isAllSelected]
  )

  const isSelected = React.useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const toggleRow = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const toggleAll = React.useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(rowKeys))
    }
  }, [isAllSelected, rowKeys])

  const clearSelection = React.useCallback(() => setSelectedIds(new Set()), [])

  return {
    selectedIds,
    isSelected,
    isAllSelected,
    isPartialSelected,
    toggleRow,
    toggleAll,
    clearSelection,
  }
}

// ---------------------------------------------------------------------------
// DataTable.BulkBar
// ---------------------------------------------------------------------------

export type DataTableBulkBarProps = {
  /**
   * Action buttons shown on the right side of the bar
   */
  children: React.ReactNode
  /**
   * Override the count label. Receives the number of selected rows.
   * @default (count) => `${count} selected`
   */
  label?: (count: number) => string
  /**
   * Override clear button text
   * @default "Clear selection"
   */
  clearLabel?: string
  /**
   * Additional class name for the bar container
   */
  className?: string
}

function DataTableBulkBar({
  children,
  label = (count) => `${count} selected`,
  clearLabel = "Clear selection",
  className,
}: DataTableBulkBarProps) {
  const selection = useSelectionContext()

  if (!selection) return null

  const count = selection.selectedIds.size

  return createPortal(
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          role="toolbar"
          aria-label="Bulk actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            // positioning
            "fixed bottom-4 left-1/2 z-50",
            "-translate-x-1/2",

            // layout
            "flex items-center gap-3",

            // sizing
            "px-4 py-2.5",

            // visual
            "rounded-xl",
            "bg-gray-1200",
            "text-white",
            "shadow-lg",

            className
          )}
        >
          {/* Left: count + clear */}
          <span aria-live="polite" aria-atomic="true" className="text-sm font-medium tabular-nums whitespace-nowrap">
            {label(count)}
          </span>
          <button
            type="button"
            onClick={selection.clearSelection}
            aria-label={clearLabel}
            className={cn(
              "cursor-pointer rounded-sm px-2 py-1 text-sm font-medium whitespace-nowrap",
              "text-white/70 hover:text-white",
              "outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1200"
            )}
          >
            {clearLabel}
          </button>

          {/* Separator */}
          <div className="h-4 w-px bg-white/20" role="separator" />

          {/* Right: consumer actions */}
          <div className="flex items-center gap-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

DataTableBulkBar.displayName = "DataTable.BulkBar"

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const DataTable = Object.assign(DataTableRoot, {
  Head: DataTableHead,
  Header: DataTableHeader,
  SortHeader: DataTableSortHeader,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
  Actions: DataTableActions,
  SelectHeader: DataTableSelectHeader,
  SelectCell: DataTableSelectCell,
  BulkBar: DataTableBulkBar,
})
