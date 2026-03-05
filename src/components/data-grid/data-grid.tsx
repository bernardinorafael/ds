import "@tanstack/react-table"

import React from "react"

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type ExpandedState,
  type OnChangeFn,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

import { Icon } from "@/components/icon"
import { IconButton } from "@/components/icon-button"
import { Select } from "@/components/select"
import { cn } from "@/utils/cn"

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

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

    // outer padding
    "p-(--data-table-p)",

    // CSS custom property defaults
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

    // expansion
    "[--data-table-expand-col-w:3rem]",

    // row link
    "[--data-table-cell-bg-hover:var(--color-gray-100)]",
  ],
  {
    variants: {
      spacing: {
        compact: "[--data-table-cell-px:1rem] [--data-table-cell-py:0.625rem]",
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

    // spacing
    "px-(--data-table-cell-px)",
    "py-(--data-table-cell-py)",

    // flush left when preceded by an expand column
    "[[data-table-expand]+&]:pl-0",

    // background
    "bg-(--data-table-row-bg,var(--data-table-cell-bg))",
    "group-data-expanded/table-row:bg-gray-100",

    // border color for row separators
    "border-border",
  ],
  {
    variants: {
      flushLeft: {
        true: "pl-0",
      },
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
// Sorting helpers
// ---------------------------------------------------------------------------

const SORT_ICON: Record<string, "chevron-up-outline" | "chevron-down-outline"> = {
  asc: "chevron-up-outline",
  desc: "chevron-down-outline",
}

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

const DEFAULT_LIMIT_OPTIONS = [10, 25, 50]

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
// Types
// ---------------------------------------------------------------------------

type DataGridProps<TData> = Pick<
  React.ComponentProps<"section">,
  "id" | "className" | "aria-label" | "aria-labelledby"
> &
  VariantProps<typeof rootVariants> & {
    /** Column definitions created via createColumnHelper */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[]
    /** Data array to render */
    data: TData[]
    /** Custom row ID accessor */
    getRowId?: (row: TData) => string
    /** Controlled sorting state */
    sorting?: SortingState
    /** Called when sorting changes */
    onSortingChange?: OnChangeFn<SortingState>
    /** When true, sorting is handled externally (server-side). @default true */
    manualSorting?: boolean
    /** Server-side pagination state */
    pagination?: {
      count: number
      limit: number
      page: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    /** Called when page changes */
    onPageChange?: (page: number) => void
    /** Called when rows-per-page limit changes */
    onLimitChange?: (limit: number) => void
    /** Page size options shown in the footer select @default [10, 25, 50] */
    limitOptions?: number[]
    /** Enable row expansion with detail panels */
    enableRowExpansion?: boolean
    /** Render function for the detail panel content */
    renderRowDetail?: (row: Row<TData>) => React.ReactNode
    /** Controlled expanded state */
    expandedRows?: ExpandedState
    /** Called when expansion changes */
    onExpandedChange?: OnChangeFn<ExpandedState>
    /** Generate an href for each row. Row becomes clickable when this returns a string. */
    getRowHref?: (row: Row<TData>) => string | undefined
    /** Additional props for the row link anchor element */
    getRowLinkProps?: (
      row: Row<TData>
    ) => Pick<React.ComponentProps<"a">, "target" | "rel" | "aria-label">
    /** Controlled column visibility state */
    columnVisibility?: VisibilityState
    /** Called when column visibility changes */
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>
    /** Controlled column pinning state */
    columnPinning?: ColumnPinningState
    /** Called when column pinning changes */
    onColumnPinningChange?: OnChangeFn<ColumnPinningState>
  }

// ---------------------------------------------------------------------------
// Pinning helpers
// ---------------------------------------------------------------------------

function getPinnedCellStyle<TData>(
  column: Column<TData, unknown>
): React.CSSProperties | undefined {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined

  return {
    position: "sticky",
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: 1,
    transition: "box-shadow 150ms",
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DataGridInner<TData>(
  {
    columns,
    data,
    spacing = "cozy",
    getRowId,
    sorting,
    onSortingChange,
    manualSorting,
    pagination,
    onPageChange,
    onLimitChange,
    limitOptions,
    enableRowExpansion,
    renderRowDetail,
    expandedRows,
    onExpandedChange,
    getRowHref,
    getRowLinkProps,
    columnVisibility,
    onColumnVisibilityChange,
    columnPinning: columnPinningProp,
    onColumnPinningChange,
    className,
    ...sectionProps
  }: DataGridProps<TData>,
  forwardedRef: React.ForwardedRef<HTMLTableElement>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cols: ColumnDef<TData, any>[] = []

    if (enableRowExpansion) {
      cols.push({
        id: "__expand",
        size: 48,
        header: () => <span className="sr-only">Expand</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <span
              className={cn(
                "inline-flex transition-transform duration-200",
                row.getIsExpanded() && "rotate-90"
              )}
            >
              <IconButton
                size="sm"
                shape="circle"
                intent="ghost"
                icon="chevron-right-outline"
                aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
                onClick={() => row.toggleExpanded()}
              />
            </span>
          </div>
        ),
        meta: {
          flushLeft: true,
          flushRight: true,
        },
      })
    }

    cols.push(...columns)
    return cols
  }, [columns, enableRowExpansion])

  const [internalExpanded, setInternalExpanded] = React.useState<ExpandedState>({})
  const resolvedExpanded = expandedRows ?? internalExpanded

  const handleExpandedChange: OnChangeFn<ExpandedState> = React.useCallback(
    (updaterOrValue) => {
      if (onExpandedChange) {
        onExpandedChange(updaterOrValue)
        return
      }
      setInternalExpanded((prev) => {
        const next =
          typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
        if (typeof next === "boolean") return next
        const prevKeys = typeof prev === "boolean" ? [] : Object.keys(prev)
        const nextKeys = Object.keys(next)
        const newKey = nextKeys.find(
          (k) => !prevKeys.includes(k) || !prev[k as keyof typeof prev]
        )
        if (newKey) return { [newKey]: true }
        return {}
      })
    },
    [onExpandedChange]
  )

  const hasPinning = !!columnPinningProp

  const resolvedColumnPinning = React.useMemo<ColumnPinningState | undefined>(() => {
    if (!columnPinningProp) return undefined

    const autoLeftPins: string[] = []
    if (enableRowExpansion) autoLeftPins.push("__expand")

    return {
      ...columnPinningProp,
      left: [...autoLeftPins, ...(columnPinningProp.left ?? [])],
    }
  }, [columnPinningProp, enableRowExpansion])

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || !hasPinning) return

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      const maxScroll = scrollWidth - clientWidth
      const hasLeft = scrollLeft > 0
      const hasRight = scrollLeft < maxScroll - 1

      el.style.setProperty("--pin-shadow-left", hasLeft ? "0.2" : "0")
      el.style.setProperty("--pin-shadow-right", hasRight ? "0.2" : "0")
    }

    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [hasPinning])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: allColumns,
    defaultColumn: { size: 0 },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId,
    onSortingChange,
    manualSorting: manualSorting ?? true,
    onExpandedChange: handleExpandedChange,
    onColumnVisibilityChange,
    onColumnPinningChange,
    getRowCanExpand: enableRowExpansion ? () => true : undefined,
    state: {
      sorting,
      expanded: resolvedExpanded,
      columnVisibility: columnVisibility ?? {},
      ...(resolvedColumnPinning && { columnPinning: resolvedColumnPinning }),
    },
  })

  const limitSelectId = React.useId()
  const resolvedLimitOptions = limitOptions ?? DEFAULT_LIMIT_OPTIONS

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

  const minLimitOption = Math.min(...resolvedLimitOptions)
  const showFooter =
    !!pagination && pagination.count > 0 && pagination.count > minLimitOption

  const handlePreviousPage = React.useCallback(() => {
    if (pagination?.hasPreviousPage) {
      onPageChange?.(pagination.page - 1)
    }
  }, [pagination, onPageChange])

  const handleNextPage = React.useCallback(() => {
    if (pagination?.hasNextPage) {
      onPageChange?.(pagination.page + 1)
    }
  }, [pagination, onPageChange])

  const handleRowClick = React.useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement
    if (target.closest("a, button, input, select, [role='checkbox']")) return
    const link = e.currentTarget.querySelector<HTMLAnchorElement>("[data-table-row-link]")
    link?.click()
  }, [])

  const handleExpandRowClick = React.useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, input, select, [role='checkbox']")) return
      row.toggleExpanded()
    },
    []
  )

  return (
    <>
      <section
        data-table-root=""
        className={rootVariants({ className, spacing })}
        {...sectionProps}
      >
        {/* Table area */}
        <div
          className={cn(
            "relative isolate order-1 -mt-(--data-table-p)",
            // Head gradient masks (disabled when column pinning is active)
            !hasPinning && [
              "before:absolute before:top-0 before:left-0 before:z-1 before:h-(--data-table-head-height)",
              "before:bg-linear-to-r before:from-(--data-table-bg) before:to-transparent",
              "after:absolute after:top-0 after:right-0 after:z-1",
              "after:h-(--data-table-head-height) after:w-(--data-table-header-px)",
              "after:bg-linear-to-l after:from-(--data-table-bg) after:to-transparent",
            ]
          )}
        >
          {/* Top corner masks – paint section bg over cells that overflow the body bg's top rounded corners */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 left-0 z-1"
            style={{
              top: "var(--data-table-head-height)",
              height: "var(--data-table-body-rounded)",
              background: [
                "radial-gradient(circle at 100% 100%, transparent calc(var(--data-table-body-rounded) - 0.5px), var(--data-table-bg) var(--data-table-body-rounded)) left top / var(--data-table-body-rounded) var(--data-table-body-rounded) no-repeat",
                "radial-gradient(circle at 0% 100%, transparent calc(var(--data-table-body-rounded) - 0.5px), var(--data-table-bg) var(--data-table-body-rounded)) right top / var(--data-table-body-rounded) var(--data-table-body-rounded) no-repeat",
              ].join(", "),
            }}
          />

          {/* Body background */}
          <div
            className={cn(
              "after:absolute after:inset-0 after:top-(--data-table-head-height)",
              "after:-z-1 after:rounded-(--data-table-body-rounded) after:bg-(--data-table-cell-bg)"
            )}
          >
            {/* Clip overflow + shadow */}
            <div
              className={cn(
                "overflow-hidden rounded-(--data-table-body-rounded)",
                "after:pointer-events-none after:absolute after:inset-0 after:z-2",
                "after:top-(--data-table-head-height)",
                "after:rounded-(--data-table-body-rounded) after:shadow-xs"
              )}
            >
              {/* Horizontal scroll container */}
              <div
                ref={scrollContainerRef}
                className="relative overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <table
                  ref={forwardedRef}
                  className={cn(
                    "relative table-fixed caption-bottom border-separate border-spacing-0 whitespace-nowrap",
                    !hasPinning && "w-full"
                  )}
                  style={
                    hasPinning
                      ? {
                          width: table.getTotalSize() || "100%",
                        }
                      : undefined
                  }
                >
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          const isExpandColumn = header.column.id === "__expand"

                          if (isExpandColumn) {
                            const pinStyle = getPinnedCellStyle(header.column)

                            return (
                              <th
                                key={header.id}
                                data-table-expand=""
                                style={{ width: "3rem", ...pinStyle }}
                                className={cn(
                                  "overflow-hidden leading-(--data-table-header-leading)",
                                  "pt-(--data-table-header-pt) pb-(--data-table-header-pb)",
                                  pinStyle && "bg-(--data-table-bg)"
                                )}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </th>
                            )
                          }

                          const meta = header.column.columnDef.meta
                          const width = meta?.actions
                            ? 48
                            : (meta?.width ??
                              (header.column.columnDef.size
                                ? header.column.columnDef.size
                                : undefined))

                          const sortDirection = header.column.getIsSorted()
                          const active = !!sortDirection
                          const columnLabel =
                            typeof header.column.columnDef.header === "string"
                              ? header.column.columnDef.header
                              : header.column.id

                          const pinStyle = getPinnedCellStyle(header.column)
                          const pinned = header.column.getIsPinned()
                          const isLastLeftPinned =
                            pinned === "left" && header.column.getIsLastColumn("left")
                          const isFirstRightPinned =
                            pinned === "right" && header.column.getIsFirstColumn("right")

                          return (
                            <th
                              key={header.id}
                              aria-sort={
                                sortDirection === "asc"
                                  ? "ascending"
                                  : sortDirection === "desc"
                                    ? "descending"
                                    : "none"
                              }
                              className={cn(
                                "[&:has([data-table-sort])_[data-table-sort-spacer]]:hidden",
                                "text-word-primary overflow-hidden text-left text-sm font-medium",
                                "leading-(--data-table-header-leading) [[data-table-expand]+&]:pl-0",
                                "px-(--data-table-header-px) pt-(--data-table-header-pt) pb-(--data-table-header-pb)",
                                width && "w-(--data-table-header-w)",
                                pinStyle && "bg-(--data-table-bg)"
                              )}
                              style={{
                                ...(width
                                  ? ({
                                      "--data-table-header-w":
                                        typeof width === "number" ? `${width}px` : width,
                                    } as React.CSSProperties)
                                  : undefined),
                                ...pinStyle,
                                ...(isLastLeftPinned && {
                                  boxShadow:
                                    "4px 0 16px -4px rgb(0 0 0 / var(--pin-shadow-left, 0))",
                                  clipPath: "inset(-1px -20px -1px 0)",
                                }),
                                ...(isFirstRightPinned && {
                                  boxShadow:
                                    "-4px 0 16px -4px rgb(0 0 0 / var(--pin-shadow-right, 0))",
                                  clipPath: "inset(-1px 0 -1px -20px)",
                                }),
                              }}
                            >
                              <span
                                className={cn(
                                  "inline-flex items-center",
                                  (meta?.srOnly || meta?.actions) && "sr-only"
                                )}
                              >
                                {header.column.getCanSort() ? (
                                  <button
                                    type="button"
                                    data-table-sort=""
                                    aria-label={
                                      !sortDirection
                                        ? `Sort ${columnLabel} ascending`
                                        : sortDirection === "asc"
                                          ? `Sort ${columnLabel} descending`
                                          : `Clear ${columnLabel} sort`
                                    }
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={cn(
                                      "group/sort inline-flex cursor-pointer items-center gap-1 rounded-xs outline-none",
                                      "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-1"
                                    )}
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    <span
                                      className={cn(
                                        "inline-flex shrink-0 transition-opacity duration-150",
                                        active
                                          ? "opacity-100"
                                          : "opacity-0 group-hover/sort:opacity-100"
                                      )}
                                    >
                                      <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                          key={sortDirection || "idle"}
                                          initial={{ opacity: 0, y: -4 }}
                                          animate={{ opacity: active ? 1 : 0.4, y: 0 }}
                                          exit={{ opacity: 0, y: 4 }}
                                          transition={{ duration: 0.15 }}
                                          className="inline-flex"
                                        >
                                          <Icon
                                            name={
                                              active
                                                ? SORT_ICON[sortDirection!]
                                                : "chevron-down-outline"
                                            }
                                            size="sm"
                                            aria-hidden
                                          />
                                        </motion.span>
                                      </AnimatePresence>
                                    </span>
                                  </button>
                                ) : (
                                  <>
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                    <span
                                      data-table-sort-spacer=""
                                      className="ml-1 size-4 shrink-0 bg-transparent"
                                    />
                                  </>
                                )}
                              </span>
                            </th>
                          )
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    className={cn(
                      "relative",
                      "[&>tr:first-child>td:first-child]:rounded-tl-(--data-table-body-rounded)",
                      "[&>tr:first-child>td:last-child]:rounded-tr-(--data-table-body-rounded)",
                      "[&>tr:last-child>td:first-child]:rounded-bl-(--data-table-body-rounded)",
                      "[&>tr:last-child>td:last-child]:rounded-br-(--data-table-body-rounded)"
                    )}
                  >
                    {table.getRowModel().rows.map((row) => {
                      const rowHref = getRowHref?.(row)
                      const hasRowLink = !!rowHref

                      const firstDataCellId = row
                        .getVisibleCells()
                        .find((c) => c.column.id !== "__expand")?.id

                      return (
                        <React.Fragment key={row.id}>
                          <tr
                            data-expanded={row.getIsExpanded() ? "" : undefined}
                            aria-expanded={
                              enableRowExpansion ? row.getIsExpanded() : undefined
                            }
                            onClick={
                              hasRowLink
                                ? handleRowClick
                                : enableRowExpansion
                                  ? (e) => handleExpandRowClick(e, row)
                                  : undefined
                            }
                            className={cn(
                              "group/table-row text-base",
                              "[&+&>*]:border-t [[data-table-detail]+&>*]:border-t",
                              enableRowExpansion &&
                                !hasRowLink && [
                                  "cursor-pointer",
                                  "hover:[--data-table-row-bg:var(--data-table-cell-bg-hover)]",
                                ],
                              hasRowLink && [
                                "relative isolate cursor-pointer *:overflow-visible",
                                "hover:[--data-table-row-bg:var(--data-table-cell-bg-hover)]",
                                "[&:has([data-table-row-link]:focus-visible)]:[--data-table-row-bg:var(--data-table-cell-bg-hover)]",
                                "[&>:where([data-table-expand])]:relative [&>:where([data-table-expand])]:z-1",
                                "[&_:where(a,button)]:relative [&_:where(a,button)]:z-1",
                                !hasPinning && "[clip-path:inset(0)]",
                              ]
                            )}
                          >
                            {row.getVisibleCells().map((cell) => {
                              const cellPinStyle = getPinnedCellStyle(cell.column)
                              const cellPinned = cell.column.getIsPinned()
                              const cellIsLastLeft =
                                cellPinned === "left" &&
                                cell.column.getIsLastColumn("left")
                              const cellIsFirstRight =
                                cellPinned === "right" &&
                                cell.column.getIsFirstColumn("right")

                              const isExpandColumn = cell.column.id === "__expand"

                              if (isExpandColumn) {
                                return (
                                  <td
                                    key={cell.id}
                                    data-table-expand=""
                                    style={{
                                      width: "3rem",
                                      ...cellPinStyle,
                                      ...(cellIsLastLeft && {
                                        boxShadow:
                                          "4px 0 16px -4px rgb(0 0 0 / var(--pin-shadow-left, 0))",
                                        clipPath: "inset(-1px -20px -1px 0)",
                                      }),
                                    }}
                                    className={cellVariants({
                                      flushLeft: false,
                                      flushRight: false,
                                    })}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                )
                              }

                              const meta = cell.column.columnDef.meta
                              const shouldRenderLink =
                                hasRowLink && cell.id === firstDataCellId

                              return (
                                <td
                                  key={cell.id}
                                  data-table-cell=""
                                  style={{
                                    ...cellPinStyle,
                                    ...(cellIsLastLeft && {
                                      boxShadow:
                                        "4px 0 16px -4px rgb(0 0 0 / var(--pin-shadow-left, 0))",
                                      clipPath: "inset(-1px -20px -1px 0)",
                                    }),
                                    ...(cellIsFirstRight && {
                                      boxShadow:
                                        "-4px 0 16px -4px rgb(0 0 0 / var(--pin-shadow-right, 0))",
                                      clipPath: "inset(-1px 0 -1px -20px)",
                                    }),
                                  }}
                                  className={cn(
                                    cellVariants({
                                      flushLeft: meta?.flushLeft ?? false,
                                      flushRight:
                                        meta?.flushRight || meta?.actions || false,
                                    })
                                  )}
                                >
                                  {shouldRenderLink ? (
                                    <a
                                      data-table-row-link=""
                                      href={rowHref}
                                      {...getRowLinkProps?.(row)}
                                      className={cn(
                                        "static -mx-1 -my-0.5 appearance-none rounded px-1 py-0.5",
                                        "outline-none focus-visible:relative focus-visible:z-5",
                                        "focus-visible:ring-[3px] focus-visible:ring-offset-1",
                                        "focus-visible:ring-[color-mix(in_srgb,black_13%,transparent)]",
                                        "focus-visible:ring-offset-[color-mix(in_srgb,black_15%,transparent)]",
                                        "before:pointer-events-auto before:absolute before:inset-0",
                                        "before:z-0 before:block before:cursor-pointer"
                                      )}
                                    >
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </a>
                                  ) : (
                                    flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )
                                  )}
                                </td>
                              )
                            })}
                          </tr>

                          <AnimatePresence initial={false}>
                            {row.getIsExpanded() && renderRowDetail && (
                              <motion.tr
                                key={`${row.id}-detail`}
                                data-table-detail=""
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <td colSpan={table.getVisibleLeafColumns().length}>
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <div
                                      className={cn(
                                        "ml-[calc(var(--data-table-expand-col-w)/2)]",
                                        "border-l border-gray-300 bg-(--data-table-cell-bg)",
                                        "py-(--data-table-cell-py) pr-(--data-table-cell-px)",
                                        "pl-(--data-table-cell-px)"
                                      )}
                                    >
                                      {renderRowDetail(row)}
                                    </div>
                                  </motion.div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination footer */}
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
                      className="w-15"
                      position="fixed"
                      aria-label="Rows per page"
                      id={`${limitSelectId}-limit`}
                      onValueChange={(v) => onLimitChange?.(Number(v))}
                      value={String(pagination!.limit)}
                      items={resolvedLimitOptions.map((v) => ({
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
    </>
  )
}

// ---------------------------------------------------------------------------
// DataGrid (exported)
// ---------------------------------------------------------------------------

export const DataGrid = React.forwardRef(DataGridInner) as <TData>(
  props: DataGridProps<TData> & React.RefAttributes<HTMLTableElement>
) => React.ReactElement
;(DataGrid as React.FC).displayName = "DataGrid"
