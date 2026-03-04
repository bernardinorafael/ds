# DataGrid (Experimental) — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a TanStack Table-powered `<DataGrid>` component with the same visual styling as the existing `DataTable`, but with a single-component declarative API driven by column definitions.

**Architecture:** Single `<DataGrid>` component that internally creates a TanStack Table instance from `columns` + `data` props and renders the full table with header, body, pagination, selection, expansion, and bulk bar. All styling (CSS variables, CVA variants, animations) is copied from the existing `DataTable`. The consumer never touches `<thead>`, `<tbody>`, `<tr>`, or `<td>` — everything is rendered automatically.

**Tech Stack:** `@tanstack/react-table`, React 19, TypeScript, Tailwind CSS v4, `cva`, `motion/react`, existing DS components (`Checkbox`, `Icon`, `IconButton`, `Select`)

---

## Task 1: Install @tanstack/react-table

**Files:**

- Modify: `package.json`

**Step 1: Install the dependency**

Run: `pnpm add @tanstack/react-table`

**Step 2: Verify installation**

Run: `pnpm exec tsc -b`
Expected: No errors (TanStack Table ships its own types)

---

## Task 2: Create DataGrid core (rendering columns + rows)

**Files:**

- Create: `src/experimental/data-grid/data-grid.tsx`
- Create: `src/experimental/data-grid/index.ts`

**Step 1: Create the barrel export**

```ts
// src/experimental/data-grid/index.ts
export { DataGrid } from "./data-grid"
export { createColumnHelper } from "@tanstack/react-table"
export type { ColumnDef, SortingState, RowSelectionState } from "@tanstack/react-table"
```

**Step 2: Create the DataGrid component — core rendering only**

This step creates the component with just core table rendering (columns + data → rendered table). No sorting, pagination, selection, or expansion yet.

The component must:

- Accept `columns`, `data`, `spacing`, `className`, `aria-label`, `aria-labelledby`, `getRowId`
- Internally call `useReactTable` with `getCoreRowModel()`
- Render the full table structure reusing exact CSS classes/variables from `DataTable`
- Copy `rootVariants` and `cellVariants` from `data-table.tsx`
- Render `<thead>` with headers from `table.getHeaderGroups()`
- Render `<tbody>` with rows from `table.getRowModel().rows`
- Each cell renders via `flexRender(cell.column.columnDef.cell, cell.getContext())`
- Support column `size` via the same CSS variable width pattern (`--data-table-header-w`)
- Support `meta.srOnly` on header columns
- Support `meta.flushLeft` / `meta.flushRight` on cells
- Include the body background, shadow, and gradient mask divs from DataTable

Key implementation details:

- Import `flexRender`, `useReactTable`, `getCoreRowModel`, `createColumnHelper` from `@tanstack/react-table`
- Column meta typing: extend TanStack's `ColumnMeta` interface via module augmentation
- The table element: `<table className="relative w-full table-fixed caption-bottom whitespace-nowrap">`
- Header cells use the same classes as `DataTableHeader`
- Body cells use `cellVariants` from the existing DataTable

```tsx
// Module augmentation for column meta at top of file
import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    srOnly?: boolean
    flushLeft?: boolean
    flushRight?: boolean
  }
}
```

**Step 3: Type-check**

Run: `pnpm exec tsc -b`
Expected: PASS

---

## Task 3: Create basic Storybook story

**Files:**

- Create: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Create stories with basic rendering**

- Title: `"Experimental/DataGrid"`
- Tags: `["autodocs"]`
- Decorator: wrap in `<Provider>`
- Reuse same `USERS` sample data from DataTable stories
- Stories: `Compact` (spacing="compact"), `Cozy` (spacing="cozy", default)
- Each story defines columns via `createColumnHelper<User>()` with accessor columns for name, email, role, status
- The status column uses a custom `cell` renderer with `<Badge>`

**Step 2: Verify in Storybook**

Run: `pnpm sb`
Navigate to "Experimental/DataGrid" — verify table renders with correct styling

---

## Task 4: Add sorting support

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Add sorting props to DataGrid**

Props to add:

```tsx
sorting?: SortingState
onSortingChange?: OnChangeFn<SortingState>
manualSorting?: boolean  // @default true — server-side sorting by default
```

Implementation:

- Import `getSortedRowModel` from `@tanstack/react-table`
- Pass `state: { sorting }`, `onSortingChange`, `manualSorting`, `getSortedRowModel()` to `useReactTable`
- In header rendering: if `column.getCanSort()`, render the sort button with the same animated icon pattern from `DataTableSortHeader` (chevron-up/down-outline, AnimatePresence mode="wait", opacity/y animation)
- `aria-sort` on `<th>` when sorting is active
- `aria-label` on sort button: "Sort {column} ascending/descending" / "Clear {column} sort"
- Sort cycle: `column.getToggleSortingHandler()` handles the click

**Step 2: Add WithSorting story**

- Uses `useState<SortingState>` for controlled sorting
- All columns except "status" are sortable (use `enableSorting: false` on status column)
- Client-side sorting for the demo: `manualSorting={false}`

**Step 3: Verify**

Run: `pnpm exec tsc -b`
Check Storybook: sorting icons animate, columns sort correctly, aria attributes present

---

## Task 5: Add pagination support

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Add pagination props to DataGrid**

Props to add:

```tsx
pagination?: {
  count: number
  limit: number
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
onPageChange?: (page: number) => void
onLimitChange?: (limit: number) => void
limitOptions?: number[]  // @default [10, 25, 50]
```

Implementation:

- Copy the pagination footer from `DataTableRoot` (the `<AnimatePresence>` + `<motion.footer>` block)
- Copy `SlidingNumber` internal component
- Same logic: show footer when `count > Math.min(...limitOptions)`
- Same layout: left side (range text + limit select), right side (prev/page/next)
- Same animations: footer height 0→auto, page number sliding

**Step 2: Add WithPagination story**

- Uses `useState` for page and limit
- Generates 127 fake users
- Slices data based on current page/limit

**Step 3: Verify**

Check Storybook: pagination footer appears, page transitions animate, limit select works

---

## Task 6: Add row selection support

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Add selection props to DataGrid**

Props to add:

```tsx
enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
rowSelection?: RowSelectionState
onRowSelectionChange?: OnChangeFn<RowSelectionState>
```

Implementation:

- Import `getFilteredSelectedRowModel` (or just use core model)
- Pass `enableRowSelection`, `state: { rowSelection }`, `onRowSelectionChange` to `useReactTable`
- When `enableRowSelection` is truthy:
  - Auto-prepend a select column with `id: "__select"` to the columns array
  - Header: `<Checkbox>` with `checked` / `indeterminate` based on `table.getIsAllPageRowsSelected()` / `table.getIsSomePageRowsSelected()`
  - Cell: `<Checkbox>` with `row.getIsSelected()`, `row.getToggleSelectedHandler()`
  - Column width: `--data-table-select-col-w` (2.5rem)
  - Cell styling: `flushLeft: true, flushRight: true`
- Row `data-selected` attribute when selected
- Selected row background: `group-data-selected/table-row:bg-(--data-table-selected-bg)`

**Step 2: Add WithSelection story**

- Uses `useState<RowSelectionState>({})` for controlled selection
- Shows checkboxes, select-all works, row highlight on selection

**Step 3: Verify**

Check Storybook: checkboxes appear, select-all toggles, rows highlight

---

## Task 7: Add BulkBar support

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Add BulkBar props to DataGrid**

Props to add:

```tsx
renderBulkBar?: (props: {
  selectedCount: number
  clearSelection: () => void
  table: Table<TData>
}) => React.ReactNode
```

Implementation:

- When `renderBulkBar` is provided and selected count > 0, render via `createPortal` to `document.body`
- Copy the same animation (spring scale 0.9→1, y 64→0, exit spring bounce:0 duration:0.3)
- Same styling: fixed bottom-4, left-1/2, -translate-x-1/2, rounded-xl, bg-gray-1200, text-white, shadow-lg
- The consumer provides the bar content via the render prop
- `clearSelection` calls `table.resetRowSelection()`

Also export a `DataGridBulkBar` helper component that provides the default bar layout (count label + separator + children):

```tsx
<DataGrid
  renderBulkBar={({ selectedCount, clearSelection }) => (
    <DataGridBulkBar count={selectedCount}>
      <Button>Delete</Button>
    </DataGridBulkBar>
  )}
/>
```

**Step 2: Add WithBulkBar story**

- Combines selection + bulk bar
- Shows 3 action buttons (Notify, Activate, Delete)

**Step 3: Verify**

Check Storybook: bulk bar appears at bottom when rows selected, animates in/out

---

## Task 8: Add row expansion support

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Add expansion props to DataGrid**

Props to add:

```tsx
enableRowExpansion?: boolean
renderRowDetail?: (row: Row<TData>) => React.ReactNode
expandedRows?: ExpandedState
onExpandedChange?: OnChangeFn<ExpandedState>
```

Implementation:

- Import `getExpandedRowModel` from `@tanstack/react-table`
- Pass `enableExpanding`, `state: { expanded }`, `onExpandedChange`, `getExpandedRowModel()` to `useReactTable`
- When `enableRowExpansion` is truthy:
  - Auto-prepend an expand column with `id: "__expand"` before data columns (but after select column if present)
  - Header: `<th>` with sr-only "Expand" text, width `--data-table-expand-col-w`
  - Cell: `<IconButton>` with chevron-right-outline, rotates 90° when expanded
  - `row.getToggleExpandedHandler()` on click
  - `aria-expanded` on `<tr>`
- Detail row: rendered as extra `<tr>` with `data-table-detail` attribute
  - Same animation as DataTable: `<motion.tr>` opacity 0→1, inner `<motion.div>` height 0→auto
  - Left border, same cell background, same padding
  - `colSpan` calculated from visible column count

**Accordion behavior:** By default, TanStack Table allows multiple rows expanded. To match DataTable's accordion behavior, use custom `onExpandedChange` that collapses previous when expanding new:

```tsx
// Internal: if accordion mode, only keep one expanded
const handleExpandedChange: OnChangeFn<ExpandedState> = (updater) => {
  // ... implement accordion logic
}
```

**Step 2: Add ExpandableRows story**

- Renders `UserDetail` component in detail panel (same as DataTable stories)
- Accordion behavior: only one row expanded at a time

**Step 3: Verify**

Check Storybook: chevron button appears, rotates on expand, detail panel slides in/out

---

## Task 9: Add row link support

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Add row link props to DataGrid**

Props to add:

```tsx
getRowHref?: (row: Row<TData>) => string
getRowLinkProps?: (row: Row<TData>) => Pick<React.ComponentProps<"a">, "target" | "rel" | "aria-label">
```

Implementation:

- When `getRowHref` returns a string for a row, render a `<a>` inside the first data cell with the same stretched pseudo-element pattern from `DataTableRowLink`
- Row gets the same click handler: clicks on `a, button, input, select, [role='checkbox']` don't trigger the link
- Row CSS classes for link support: `has-data-table-row-link:*` selectors from DataTable
- Buttons/links inside the row get `relative z-1` via the same selectors
- Select/expand cells get `relative z-1` to float above the link

**Step 2: Add WithRowLink story**

- Shows 5 users with row links to `#/users/{id}`
- Last column has actions menu button

**Step 3: Verify**

Check Storybook: hovering rows shows hover state, clicking navigates (hash change), action buttons clickable independently

---

## Task 10: Add actions column helper

**Files:**

- Modify: `src/experimental/data-grid/data-grid.tsx`
- Modify: `src/experimental/data-grid/index.ts`

**Step 1: Add column meta for actions**

The `meta.actions` flag on a display column triggers:

- `flushRight: true` on the cell
- `srOnly: true` on the header
- Fixed small width

Usage:

```tsx
columnHelper.display({
  id: "actions",
  header: "Actions",
  meta: { actions: true },
  cell: ({ row }) => <IconButton icon="more-horizontal-outline" />,
})
```

Update the module augmentation:

```tsx
interface ColumnMeta<TData extends RowData, TValue> {
  srOnly?: boolean
  flushLeft?: boolean
  flushRight?: boolean
  actions?: boolean // shorthand for srOnly + flushRight + fixed width
}
```

**Step 2: Update barrel export**

Make sure all public types are exported.

**Step 3: Type-check**

Run: `pnpm exec tsc -b`

---

## Task 11: KitchenSink story — all features combined

**Files:**

- Modify: `src/experimental/data-grid/data-grid.stories.tsx`

**Step 1: Create KitchenSink story**

Combines ALL features:

- Sorting on Name and Email columns
- Pagination with 127 users, limitOptions [5, 10, 25]
- Row selection with BulkBar
- Row expansion with UserDetail
- Row links
- Actions column
- Wrapped in `<DataTableToolbar>` with search input and filter selects

This is the definitive demo showing feature parity with the existing DataTable KitchenSink story.

**Step 2: Verify**

Check Storybook: all features work together without conflicts

---

## Task 12: Write unit tests

**Files:**

- Create: `src/experimental/data-grid/data-grid.test.tsx`

**Step 1: Write comprehensive tests**

Test groups:

1. **Core rendering**: renders columns and rows, applies className, forwards ref
2. **Spacing variants**: compact/cozy apply correct CSS variables
3. **Column width**: `size` property sets header width
4. **Sorting**: sort buttons render, aria-sort updates, onSortingChange fires
5. **Pagination**: footer appears when count > minLimit, page navigation works, limit change resets page
6. **Selection**: checkboxes render, select-all works, row highlight, onRowSelectionChange fires
7. **Expansion**: expand button renders, detail panel appears, accordion behavior
8. **Row link**: anchor renders, hover state, click delegation
9. **BulkBar**: appears when rows selected, disappears on clear
10. **Actions column**: meta.actions applies correct classes

Follow existing test patterns:

- `describe("DataGrid", () => { ... })`
- `it("should ...")` naming
- Testing Library queries
- `userEvent.setup()` in `beforeEach`
- Import from barrel `@/experimental/data-grid`

**Step 2: Run tests**

Run: `pnpm test`
Expected: All tests PASS

---

## Task 13: Final type-check and cleanup

**Step 1: Full type-check**

Run: `pnpm exec tsc -b`
Expected: PASS

**Step 2: Lint**

Run: `pnpm lint`
Expected: PASS (or only pre-existing warnings)

**Step 3: Final Storybook review**

Run: `pnpm sb`
Verify all stories under "Experimental/DataGrid" render correctly
