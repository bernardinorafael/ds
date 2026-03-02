# DataTable BulkBar — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a selection context to DataTable and a fixed-bottom BulkBar compound component for bulk actions on selected rows.

**Architecture:** Two new React contexts (SelectionContext from Root, RowContext from Row) enable zero-config wiring of SelectHeader, SelectCell, Row highlight, and BulkBar. The BulkBar renders via `createPortal` to `document.body` with motion animations. All existing explicit-prop usage remains backward compatible.

**Tech Stack:** React 19, motion/react, createPortal, cva, cn, Vitest + Testing Library

---

### Task 1: Add SelectionContext and RowContext

**Files:**
- Modify: `src/components/data-table/data-table.tsx`

**Step 1: Define context types and create contexts**

Add after the existing `Types` section (after line 104):

```tsx
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
```

**Step 2: Add `selection` prop to DataTableRootProps**

Update the `DataTableRootProps` type to add:

```tsx
export type DataTableRootProps = Pick<
  React.ComponentProps<"section">,
  "id" | "className" | "aria-label" | "aria-labelledby"
> &
  VariantProps<typeof rootVariants> & {
    children: React.ReactNode
    pagination?: PaginationProps
    limitOptions?: number[]
    /**
     * Row selection state from `useRowSelection`. When provided, SelectHeader,
     * SelectCell, Row highlight, and BulkBar read from context automatically.
     */
    selection?: SelectionContextValue
  }
```

**Step 3: Wrap Root children with SelectionContext.Provider**

In `DataTableRoot`, destructure `selection` from props and wrap the return JSX:

```tsx
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
    // ... existing useMemo/useCallback code ...

    const content = (
      <section /* ... existing section JSX ... */>
        {/* ... all existing JSX unchanged ... */}
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
```

**Step 4: Run type check**

Run: `pnpm exec tsc -b`
Expected: PASS (no type errors — `selection` is optional, no consumers use it yet)

**Step 5: Run existing tests**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: All existing tests PASS (no behavioral change)

**Step 6: Commit**

```
feat(data-table): add SelectionContext and RowContext
```

---

### Task 2: Wire Row with RowContext and auto-selected

**Files:**
- Modify: `src/components/data-table/data-table.tsx` (DataTableRow)
- Modify: `src/components/data-table/data-table.test.tsx`

**Step 1: Write failing tests for Row with rowId and auto-selection**

Add to `data-table.test.tsx` inside the `DataTable.Row` describe block. Import `useRowSelection` at the top alongside existing imports.

```tsx
it("should set data-selected when selection context provides selected state", () => {
  function Demo() {
    const selection = useRowSelection(
      [{ id: "1" }, { id: "2" }],
      { key: "id" }
    )
    // Pre-select row 1 by toggling it
    React.useEffect(() => { selection.toggleRow("1") }, [])

    return (
      <DataTable selection={selection}>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row rowId="1">
            <DataTable.Cell>Alice</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row rowId="2">
            <DataTable.Cell>Bob</DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>
    )
  }

  render(<Demo />)
  const rows = screen.getAllByRole("row")
  // rows[0] is the thead row, rows[1] is Alice, rows[2] is Bob
  expect(rows[1]).toHaveAttribute("data-selected", "")
  expect(rows[2]).not.toHaveAttribute("data-selected")
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: FAIL — Row doesn't read from context yet

**Step 3: Update DataTableRow to accept `rowId` and use contexts**

```tsx
const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  Pick<React.ComponentProps<"tr">, "children" | "className"> & {
    /** Highlights the row as selected */
    selected?: boolean
    /** Row identifier for selection context. When inside a `selection` context, the row auto-derives `selected` and provides the ID to child SelectCell. */
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
```

**Step 4: Run tests**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: All PASS

**Step 5: Commit**

```
feat(data-table): wire Row with RowContext and auto-selected
```

---

### Task 3: Wire SelectHeader and SelectCell with context fallback

**Files:**
- Modify: `src/components/data-table/data-table.tsx` (SelectHeader, SelectCell)
- Modify: `src/components/data-table/data-table.test.tsx`

**Step 1: Write failing tests for context-driven SelectHeader**

```tsx
describe("DataTable.SelectHeader (context)", () => {
  it("should render select-all checkbox from context without props", () => {
    function Demo() {
      const selection = useRowSelection([{ id: "1" }], { key: "id" })
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>
      )
    }

    render(<Demo />)
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeInTheDocument()
  })
})
```

**Step 2: Write failing test for context-driven SelectCell**

```tsx
describe("DataTable.SelectCell (context)", () => {
  it("should toggle row selection via context when clicked", async () => {
    const user = userEvent.setup()

    function Demo() {
      const selection = useRowSelection(
        [{ id: "1" }, { id: "2" }],
        { key: "id" }
      )
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row rowId="2">
              <DataTable.SelectCell />
              <DataTable.Cell>Bob</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>
      )
    }

    render(<Demo />)
    const checkboxes = screen.getAllByRole("checkbox", { name: "Select row" })
    await user.click(checkboxes[0])

    const rows = screen.getAllByRole("row")
    expect(rows[1]).toHaveAttribute("data-selected", "")
    expect(rows[2]).not.toHaveAttribute("data-selected")
  })
})
```

**Step 3: Run tests to verify they fail**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: FAIL — SelectHeader/SelectCell don't read context yet

**Step 4: Make SelectHeader props optional and read from context**

```tsx
export type DataTableSelectHeaderProps = {
  checked?: boolean
  indeterminate?: boolean
  onChange?: () => void
  disabled?: boolean
}

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
```

**Step 5: Make SelectCell props optional and read from context**

```tsx
export type DataTableSelectCellProps = {
  checked?: boolean
  onChange?: () => void
  disabled?: boolean
}

function DataTableSelectCell({
  checked: checkedProp,
  onChange: onChangeProp,
  disabled,
}: DataTableSelectCellProps) {
  const selection = useSelectionContext()
  const rowId = useRowContext()

  const checked = checkedProp ?? (selection && rowId ? selection.isSelected(rowId) : false)
  const onChange = onChangeProp ?? (selection && rowId ? () => selection.toggleRow(rowId) : undefined)

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
```

**Step 6: Run tests**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: All PASS (both new context tests and existing explicit-prop tests)

**Step 7: Commit**

```
feat(data-table): wire SelectHeader and SelectCell with context fallback
```

---

### Task 4: Implement DataTable.BulkBar

**Files:**
- Modify: `src/components/data-table/data-table.tsx`
- Modify: `src/components/data-table/data-table.test.tsx`
- Modify: `src/components/data-table/index.ts`

**Step 1: Write failing tests for BulkBar**

```tsx
describe("DataTable.BulkBar", () => {
  it("should not render when no rows are selected", () => {
    function Demo() {
      const selection = useRowSelection([{ id: "1" }], { key: "id" })
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
          <DataTable.BulkBar>
            <button>Delete</button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    render(<Demo />)
    expect(screen.queryByText("selected")).not.toBeInTheDocument()
  })

  it("should render with count when rows are selected", async () => {
    const user = userEvent.setup()

    function Demo() {
      const selection = useRowSelection(
        [{ id: "1" }, { id: "2" }],
        { key: "id" }
      )
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row rowId="2">
              <DataTable.SelectCell />
              <DataTable.Cell>Bob</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
          <DataTable.BulkBar>
            <button>Delete</button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    render(<Demo />)
    const checkboxes = screen.getAllByRole("checkbox", { name: "Select row" })
    await user.click(checkboxes[0])

    expect(screen.getByText("1 selected")).toBeInTheDocument()
    expect(screen.getByText("Delete")).toBeInTheDocument()
  })

  it("should call clearSelection when clear button is clicked", async () => {
    const user = userEvent.setup()

    function Demo() {
      const selection = useRowSelection(
        [{ id: "1" }, { id: "2" }],
        { key: "id" }
      )
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
          <DataTable.BulkBar>
            <button>Delete</button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    render(<Demo />)
    await user.click(screen.getByRole("checkbox", { name: "Select row" }))
    expect(screen.getByText("1 selected")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(screen.queryByText("selected")).not.toBeInTheDocument()
  })

  it("should render children actions", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    function Demo() {
      const selection = useRowSelection([{ id: "1" }], { key: "id" })
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
          <DataTable.BulkBar>
            <button onClick={onDelete}>Delete</button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    render(<Demo />)
    await user.click(screen.getByRole("checkbox", { name: "Select row" }))
    await user.click(screen.getByText("Delete"))
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it("should use custom label when provided", async () => {
    const user = userEvent.setup()

    function Demo() {
      const selection = useRowSelection([{ id: "1" }], { key: "id" })
      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1">
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
          <DataTable.BulkBar label={(n) => `${n} item(s)`}>
            <button>Delete</button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    render(<Demo />)
    await user.click(screen.getByRole("checkbox", { name: "Select row" }))
    expect(screen.getByText("1 item(s)")).toBeInTheDocument()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: FAIL — BulkBar doesn't exist yet

**Step 3: Implement DataTable.BulkBar component**

Add to `data-table.tsx` before the compound export. Import `createPortal` from `react-dom` at the top.

```tsx
import { createPortal } from "react-dom"
```

```tsx
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
          aria-live="polite"
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
          <span className="text-sm font-medium tabular-nums">
            <SlidingNumber value={count} /> {label(count).replace(/^\d+\s*/, "")}
          </span>
          <button
            type="button"
            onClick={selection.clearSelection}
            aria-label={clearLabel}
            className={cn(
              "cursor-pointer rounded-sm px-2 py-1 text-sm font-medium",
              "text-white/70 hover:text-white",
              "outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            )}
          >
            {clearLabel}
          </button>

          {/* Separator */}
          <div className="h-4 w-px bg-white/20" role="separator" />

          {/* Right: consumer actions */}
          <div className="flex items-center gap-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

DataTableBulkBar.displayName = "DataTable.BulkBar"
```

**Step 4: Add BulkBar to compound export**

```tsx
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
```

**Step 5: Update barrel export types in index.ts**

Add `DataTableBulkBarProps` to the type exports:

```tsx
export type {
  DataTableRootProps,
  DataTableHeaderProps,
  DataTableSortHeaderProps,
  DataTableCellProps,
  DataTableSelectHeaderProps,
  DataTableSelectCellProps,
  DataTableBulkBarProps,
  PaginationProps,
  SortDirection,
} from "./data-table"
```

**Step 6: Run tests**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: All PASS

**Step 7: Run type check**

Run: `pnpm exec tsc -b`
Expected: PASS

**Step 8: Commit**

```
feat(data-table): add BulkBar compound component with portal and animation
```

---

### Task 5: Update stories

**Files:**
- Modify: `src/components/data-table/data-table.stories.tsx`

**Step 1: Refactor WithSelection story to use context API**

Replace the existing `WithSelection` story to use the new context-based API:

```tsx
export const WithSelection: Story = {
  render: () => {
    const Demo = () => {
      const selection = useRowSelection(USERS, { key: "id" })

      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header>Email</DataTable.Header>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {USERS.map((user) => (
              <DataTable.Row key={user.id} rowId={user.id}>
                <DataTable.SelectCell />
                <DataTable.Cell>
                  <span className="text-word-primary font-medium">{user.name}</span>
                </DataTable.Cell>
                <DataTable.Cell>{user.email}</DataTable.Cell>
                <DataTable.Cell>{user.role}</DataTable.Cell>
                <DataTable.Cell>
                  <Badge intent={statusIntent[user.status as keyof typeof statusIntent]}>
                    {user.status}
                  </Badge>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable>
      )
    }

    return <Demo />
  },
}
```

**Step 2: Add WithBulkBar story**

Import `Button` from `@/components/button` at the top.

```tsx
export const WithBulkBar: Story = {
  render: () => {
    const Demo = () => {
      const selection = useRowSelection(USERS, { key: "id" })

      return (
        <DataTable selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header>Email</DataTable.Header>
            <DataTable.Header width="6rem">Role</DataTable.Header>
            <DataTable.Header width="6rem">Status</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            {USERS.map((user) => (
              <DataTable.Row key={user.id} rowId={user.id}>
                <DataTable.SelectCell />
                <DataTable.Cell>
                  <span className="text-word-primary font-medium">{user.name}</span>
                </DataTable.Cell>
                <DataTable.Cell>{user.email}</DataTable.Cell>
                <DataTable.Cell>{user.role}</DataTable.Cell>
                <DataTable.Cell>
                  <Badge intent={statusIntent[user.status as keyof typeof statusIntent]}>
                    {user.status}
                  </Badge>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable.Body>
          <DataTable.BulkBar>
            <Button intent="secondary" size="sm">
              Export
            </Button>
            <Button intent="destructive" size="sm">
              Delete
            </Button>
          </DataTable.BulkBar>
        </DataTable>
      )
    }

    return <Demo />
  },
}
```

**Step 3: Run storybook sanity check and type check**

Run: `pnpm exec tsc -b`
Expected: PASS

**Step 4: Commit**

```
feat(data-table): update stories for selection context and add WithBulkBar
```

---

### Task 6: Final verification

**Step 1: Run full test suite**

Run: `pnpm test -- src/components/data-table/data-table.test.tsx`
Expected: All PASS

**Step 2: Run type check**

Run: `pnpm exec tsc -b`
Expected: PASS

**Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS (or only pre-existing warnings)

**Step 4: Visual check in Storybook**

Run: `pnpm storybook`
Verify: WithSelection story works with zero-config API, WithBulkBar shows fixed bottom bar on selection
