# Expandable Rows Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add accordion-style expandable rows to DataTable via a `detail` prop on Row and a `useRowExpansion()` hook.

**Architecture:** New `ExpansionContext` (mirrors SelectionContext pattern). Row renders a second `<tr>` with animated detail panel when expanded. Chevron column auto-injected when expansion context exists. Click on row toggles expansion; click on buttons/checkboxes/links is excluded.

**Tech Stack:** React 19, motion/react (AnimatePresence + motion), CVA, Tailwind CSS v4, Vitest + Testing Library

---

### Task 1: `useRowExpansion` hook

**Files:**
- Modify: `src/components/data-table/data-table.tsx` (after `useRowSelection`, ~line 880)
- Test: `src/components/data-table/data-table.test.tsx`

**Step 1: Write the failing test**

Add at the end of the test file:

```tsx
// ---------------------------------------------------------------------------
// useRowExpansion
// ---------------------------------------------------------------------------

import { renderHook, act } from "@testing-library/react"
import { useRowExpansion } from "@/components/data-table"

describe("useRowExpansion", () => {
  it("should start with no expanded row", () => {
    const { result } = renderHook(() => useRowExpansion())
    expect(result.current.expandedId).toBeNull()
  })

  it("should expand a row when toggle is called", () => {
    const { result } = renderHook(() => useRowExpansion())
    act(() => result.current.toggle("1"))
    expect(result.current.expandedId).toBe("1")
    expect(result.current.isExpanded("1")).toBe(true)
  })

  it("should collapse when toggling the same row", () => {
    const { result } = renderHook(() => useRowExpansion())
    act(() => result.current.toggle("1"))
    act(() => result.current.toggle("1"))
    expect(result.current.expandedId).toBeNull()
  })

  it("should switch to new row when toggling a different row (accordion)", () => {
    const { result } = renderHook(() => useRowExpansion())
    act(() => result.current.toggle("1"))
    act(() => result.current.toggle("2"))
    expect(result.current.expandedId).toBe("2")
    expect(result.current.isExpanded("1")).toBe(false)
  })

  it("should collapse all when collapse is called", () => {
    const { result } = renderHook(() => useRowExpansion())
    act(() => result.current.toggle("1"))
    act(() => result.current.collapse())
    expect(result.current.expandedId).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx --reporter verbose`
Expected: FAIL — `useRowExpansion` is not exported

**Step 3: Write minimal implementation**

In `data-table.tsx`, after the `useRowSelection` hook (~line 880), add:

```tsx
// ---------------------------------------------------------------------------
// useRowExpansion
// ---------------------------------------------------------------------------

export type ExpansionContextValue = {
  expandedId: string | null
  isExpanded: (id: string) => boolean
  toggle: (id: string) => void
  collapse: () => void
}

export function useRowExpansion(): ExpansionContextValue {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const isExpanded = React.useCallback(
    (id: string) => expandedId === id,
    [expandedId]
  )

  const toggle = React.useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const collapse = React.useCallback(() => setExpandedId(null), [])

  return { expandedId, isExpanded, toggle, collapse }
}
```

Add the `ExpansionContext` right after `RowContext` (~line 138):

```tsx
// ---------------------------------------------------------------------------
// Expansion Context
// ---------------------------------------------------------------------------

const ExpansionContext = React.createContext<ExpansionContextValue | null>(null)

function useExpansionContext() {
  return React.useContext(ExpansionContext)
}
```

**Step 4: Export from barrel**

In `src/components/data-table/index.ts`, add `useRowExpansion` to the named export and `ExpansionContextValue` to the type export.

**Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx --reporter verbose`
Expected: All `useRowExpansion` tests PASS

**Step 6: Commit**

```bash
git add src/components/data-table/data-table.tsx src/components/data-table/index.ts src/components/data-table/data-table.test.tsx
git commit -m "feat(data-table): add useRowExpansion hook and ExpansionContext"
```

---

### Task 2: Wire `expansion` prop into Root

**Files:**
- Modify: `src/components/data-table/data-table.tsx` — `DataTableRootProps` (~line 27) and `DataTableRoot` (~line 270)
- Test: `src/components/data-table/data-table.test.tsx`

**Step 1: Write the failing test**

```tsx
describe("DataTable expansion context", () => {
  it("should provide expansion context to children", () => {
    function ExpansionConsumer() {
      const expansion = React.useContext(ExpansionContext)
      return <td data-testid="ctx">{expansion ? "has-context" : "no-context"}</td>
    }

    // Since ExpansionContext is internal, test via Row behavior instead:
    function Demo() {
      const expansion = useRowExpansion()
      return (
        <DataTable expansion={expansion}>
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1" detail={<div>Detail content</div>}>
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>
      )
    }

    render(<Demo />)
    // Row with detail should render aria-expanded attribute
    const rows = screen.getAllByRole("row")
    expect(rows[1]).toHaveAttribute("aria-expanded", "false")
  })
})
```

Note: This test will also fail because Row doesn't handle `detail` yet — that's fine, it validates the wiring end-to-end. We'll make it pass in Task 3.

**Step 2: Add `expansion` prop to `DataTableRootProps`**

In the type definition (~line 27), add:

```tsx
/**
 * Row expansion state from `useRowExpansion`. When provided, rows with a
 * `detail` prop become expandable with accordion behavior.
 */
expansion?: ExpansionContextValue
```

**Step 3: Wrap content with ExpansionContext.Provider**

In `DataTableRoot` (~line 454), update the return to nest both providers:

```tsx
let content = ( /* ...existing JSX... */ )

if (expansion) {
  content = (
    <ExpansionContext.Provider value={expansion}>{content}</ExpansionContext.Provider>
  )
}
if (selection) {
  content = (
    <SelectionContext.Provider value={selection}>{content}</SelectionContext.Provider>
  )
}

return content
```

**Step 4: Commit**

```bash
git add src/components/data-table/data-table.tsx src/components/data-table/data-table.test.tsx
git commit -m "feat(data-table): wire expansion prop into Root via ExpansionContext"
```

---

### Task 3: Expandable Row rendering

**Files:**
- Modify: `src/components/data-table/data-table.tsx` — `DataTableRow` (~line 642)
- Test: `src/components/data-table/data-table.test.tsx`

**Step 1: Write the failing tests**

```tsx
// ---------------------------------------------------------------------------
// Expandable Row
// ---------------------------------------------------------------------------

describe("Expandable Row", () => {
  function ExpandableDemo({
    onToggle,
  }: {
    onToggle?: () => void
  }) {
    const expansion = useRowExpansion()

    React.useEffect(() => {
      if (onToggle) {
        // expose toggle for external verification if needed
      }
    }, [onToggle])

    return (
      <DataTable expansion={expansion}>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row rowId="1" detail={<div>Detail for Alice</div>}>
            <DataTable.Cell>Alice</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row rowId="2" detail={<div>Detail for Bob</div>}>
            <DataTable.Cell>Bob</DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>
    )
  }

  it("should render aria-expanded=false on expandable rows", () => {
    render(<ExpandableDemo />)
    const rows = screen.getAllByRole("row")
    // rows[0] = thead, rows[1] = Alice, rows[2] = Bob
    expect(rows[1]).toHaveAttribute("aria-expanded", "false")
    expect(rows[2]).toHaveAttribute("aria-expanded", "false")
  })

  it("should not render detail panel when collapsed", () => {
    render(<ExpandableDemo />)
    expect(screen.queryByText("Detail for Alice")).not.toBeInTheDocument()
  })

  it("should expand row and show detail when row is clicked", async () => {
    const user = userEvent.setup()
    render(<ExpandableDemo />)

    const aliceRow = screen.getAllByRole("row")[1]
    await user.click(aliceRow)

    expect(aliceRow).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Detail for Alice")).toBeInTheDocument()
  })

  it("should collapse expanded row when clicked again", async () => {
    const user = userEvent.setup()
    render(<ExpandableDemo />)

    const aliceRow = screen.getAllByRole("row")[1]
    await user.click(aliceRow)
    await user.click(aliceRow)

    expect(aliceRow).toHaveAttribute("aria-expanded", "false")
  })

  it("should close previous row when another row is clicked (accordion)", async () => {
    const user = userEvent.setup()
    render(<ExpandableDemo />)

    const rows = screen.getAllByRole("row")
    await user.click(rows[1]) // expand Alice
    await user.click(rows[2]) // expand Bob

    expect(rows[1]).toHaveAttribute("aria-expanded", "false")
    expect(rows[2]).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Detail for Bob")).toBeInTheDocument()
  })

  it("should not expand when clicking a button inside the row", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    function Demo() {
      const expansion = useRowExpansion()
      return (
        <DataTable expansion={expansion}>
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
            <DataTable.Header srOnly>Actions</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1" detail={<div>Detail</div>}>
              <DataTable.Cell>Alice</DataTable.Cell>
              <DataTable.Cell>
                <button onClick={onClick}>Edit</button>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>
      )
    }

    render(<Demo />)
    await user.click(screen.getByRole("button", { name: "Edit" }))

    const dataRow = screen.getAllByRole("row")[1]
    expect(dataRow).toHaveAttribute("aria-expanded", "false")
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("should not expand when clicking a checkbox (selection coexistence)", async () => {
    const user = userEvent.setup()

    function Demo() {
      const expansion = useRowExpansion()
      const selection = useRowSelection([{ id: "1" }], { key: "id" })
      return (
        <DataTable expansion={expansion} selection={selection}>
          <DataTable.Head>
            <DataTable.SelectHeader />
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1" detail={<div>Detail</div>}>
              <DataTable.SelectCell />
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>
      )
    }

    render(<Demo />)
    await user.click(screen.getByRole("checkbox", { name: "Select row" }))

    const dataRow = screen.getAllByRole("row")[1]
    expect(dataRow).toHaveAttribute("aria-expanded", "false")
    // But selection should work
    expect(dataRow).toHaveAttribute("data-selected", "")
  })

  it("should toggle expansion with Enter key", async () => {
    const user = userEvent.setup()
    render(<ExpandableDemo />)

    const aliceRow = screen.getAllByRole("row")[1]
    aliceRow.focus()
    await user.keyboard("{Enter}")

    expect(aliceRow).toHaveAttribute("aria-expanded", "true")
  })

  it("should toggle expansion with Space key", async () => {
    const user = userEvent.setup()
    render(<ExpandableDemo />)

    const aliceRow = screen.getAllByRole("row")[1]
    aliceRow.focus()
    await user.keyboard(" ")

    expect(aliceRow).toHaveAttribute("aria-expanded", "true")
  })

  it("should render chevron button with correct aria-label", () => {
    render(<ExpandableDemo />)
    expect(screen.getAllByRole("button", { name: "Expand row" })).toHaveLength(2)
  })

  it("should update chevron aria-label when expanded", async () => {
    const user = userEvent.setup()
    render(<ExpandableDemo />)

    await user.click(screen.getAllByRole("row")[1])
    expect(screen.getByRole("button", { name: "Collapse row" })).toBeInTheDocument()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx --reporter verbose`
Expected: FAIL — Row doesn't accept `detail` prop

**Step 3: Implement expandable Row**

Update `DataTableRow` props and implementation:

```tsx
const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  Pick<React.ComponentProps<"tr">, "children" | "className"> & {
    selected?: boolean
    rowId?: string
    /**
     * Content rendered in a detail panel below the row when expanded.
     * Requires `rowId` and an `expansion` context on the parent DataTable.
     */
    detail?: React.ReactNode
  }
>(({ selected, rowId, detail, children, className, ...props }, ref) => {
  const selection = useSelectionContext()
  const expansion = useExpansionContext()

  const isSelected =
    selected ?? (selection && rowId ? selection.isSelected(rowId) : false)

  const isExpandable = !!detail && !!expansion && !!rowId
  const isExpanded = isExpandable && expansion.isExpanded(rowId)

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLTableRowElement>) => {
      if (!isExpandable) return

      const target = event.target as HTMLElement
      if (target.closest("button, a, input, [data-no-expand]")) return

      expansion.toggle(rowId)
    },
    [isExpandable, expansion, rowId]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (!isExpandable) return
      if (event.key !== "Enter" && event.key !== " ") return

      const target = event.target as HTMLElement
      if (target.closest("button, a, input, [data-no-expand]")) return

      // Only handle when the row itself is focused
      if (target !== event.currentTarget) return

      event.preventDefault()
      expansion.toggle(rowId)
    },
    [isExpandable, expansion, rowId]
  )

  const row = (
    <>
      <tr
        data-selected={isSelected ? "" : undefined}
        data-expanded={isExpanded ? "" : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        tabIndex={isExpandable ? 0 : undefined}
        onClick={isExpandable ? handleClick : undefined}
        onKeyDown={isExpandable ? handleKeyDown : undefined}
        className={cn(
          "group/table-row text-base",
          "[&+&>*]:border-t",
          isExpandable && "cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      >
        {isExpandable && (
          <td
            data-table-expand=""
            className={cn(
              cellVariants({ flushLeft: true, flushRight: true }),
              "w-(--data-table-expand-col-w)"
            )}
          >
            <div className="flex items-center justify-center">
              <button
                type="button"
                tabIndex={-1}
                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                onClick={(e) => {
                  e.stopPropagation()
                  expansion!.toggle(rowId!)
                }}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center",
                  "rounded-xs outline-none",
                  "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-1"
                )}
              >
                <Icon
                  name="chevron-right-outline"
                  size="sm"
                  aria-hidden
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>
            </div>
          </td>
        )}
        {children}
      </tr>

      {/* Detail panel */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.tr
            key={`${rowId}-detail`}
            data-table-detail=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <td colSpan={100}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-(--data-table-cell-px) py-(--data-table-cell-py) bg-(--data-table-cell-bg)">
                  {detail}
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  )

  return rowId ? <RowContext.Provider value={rowId}>{row}</RowContext.Provider> : row
})
```

Note: `colSpan={100}` is a pragmatic trick — HTML tables clamp colSpan to actual column count.

**Step 4: Add CSS var to rootVariants**

In the `rootVariants` base array, add after `--data-table-selected-bg`:

```tsx
"[--data-table-expand-col-w:2.5rem]",
```

**Step 5: Run tests**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx --reporter verbose`
Expected: All expandable row tests PASS

**Step 6: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 7: Commit**

```bash
git add src/components/data-table/data-table.tsx src/components/data-table/data-table.test.tsx
git commit -m "feat(data-table): add expandable row with detail panel and accordion behavior"
```

---

### Task 4: Expand Header column

**Files:**
- Modify: `src/components/data-table/data-table.tsx` — `DataTableHead` (~line 468)
- Test: `src/components/data-table/data-table.test.tsx`

**Step 1: Write the failing test**

```tsx
describe("Expand header column", () => {
  it("should render an extra th for expand column when expansion context exists", () => {
    function Demo() {
      const expansion = useRowExpansion()
      return (
        <DataTable expansion={expansion}>
          <DataTable.Head>
            <DataTable.Header>Name</DataTable.Header>
          </DataTable.Head>
          <DataTable.Body>
            <DataTable.Row rowId="1" detail={<div>Detail</div>}>
              <DataTable.Cell>Alice</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable>
      )
    }

    render(<Demo />)
    const headers = screen.getAllByRole("columnheader")
    // First header should be the expand column (sr-only)
    expect(headers[0].querySelector("span")).toHaveClass("sr-only")
    // Second header is "Name"
    expect(headers[1]).toHaveTextContent("Name")
  })

  it("should not render expand header when no expansion context", () => {
    render(
      <DataTable>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>Alice</DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>
    )
    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(1)
    expect(headers[0]).toHaveTextContent("Name")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx --reporter verbose`

**Step 3: Update DataTableHead**

```tsx
const DataTableHead = React.forwardRef<
  HTMLTableSectionElement,
  Pick<React.HTMLAttributes<HTMLTableSectionElement>, "children" | "className">
>(({ children, ...rest }, ref) => {
  const expansion = useExpansionContext()

  return (
    <thead ref={ref} {...rest}>
      <tr>
        {expansion && (
          <th
            data-table-expand=""
            className={cn(
              "overflow-hidden",
              "leading-(--data-table-header-leading)",
              "pt-(--data-table-header-pt)",
              "pb-(--data-table-header-pb)",
              "w-(--data-table-expand-col-w)"
            )}
          >
            <span className="sr-only">Expand</span>
          </th>
        )}
        {children}
      </tr>
    </thead>
  )
})
```

**Step 4: Run tests**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx --reporter verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/data-table/data-table.tsx src/components/data-table/data-table.test.tsx
git commit -m "feat(data-table): auto-inject expand header column when expansion context exists"
```

---

### Task 5: Update barrel exports and type exports

**Files:**
- Modify: `src/components/data-table/index.ts`

**Step 1: Update index.ts**

```ts
export { DataTable, useSortState, useRowSelection, useRowExpansion } from "./data-table"
export type {
  DataTableRootProps,
  DataTableHeaderProps,
  DataTableSortHeaderProps,
  DataTableCellProps,
  DataTableSelectHeaderProps,
  DataTableSelectCellProps,
  DataTableBulkBarProps,
  ExpansionContextValue,
  PaginationProps,
  SortDirection,
} from "./data-table"
```

**Step 2: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/data-table/index.ts
git commit -m "feat(data-table): export useRowExpansion and ExpansionContextValue"
```

---

### Task 6: Storybook stories

**Files:**
- Modify: `src/components/data-table/data-table.stories.tsx`

**Step 1: Read current stories**

Read `src/components/data-table/data-table.stories.tsx` to understand the format and existing stories.

**Step 2: Add expandable rows stories**

Add two new stories:

1. **ExpandableRows** — basic expandable table with detail panel
2. **ExpandableWithSelection** — expandable + selection coexisting

```tsx
export const ExpandableRows: Story = {
  render: () => {
    const expansion = useRowExpansion()
    const users = [
      { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", bio: "Senior engineer with 10 years of experience in distributed systems." },
      { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", bio: "Content strategist focused on technical writing and documentation." },
      { id: "3", name: "Carol Lee", email: "carol@example.com", role: "Viewer", bio: "Product designer specializing in design systems and accessibility." },
    ]

    return (
      <DataTable expansion={expansion} aria-label="Users with details">
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
          <DataTable.Header>Email</DataTable.Header>
          <DataTable.Header>Role</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          {users.map((user) => (
            <DataTable.Row key={user.id} rowId={user.id} detail={
              <div className="flex flex-col gap-1">
                <p className="text-word-secondary text-sm font-medium">Bio</p>
                <p className="text-word-primary text-sm">{user.bio}</p>
              </div>
            }>
              <DataTable.Cell>{user.name}</DataTable.Cell>
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>{user.role}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable>
    )
  },
}

export const ExpandableWithSelection: Story = {
  render: () => {
    const users = [
      { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", bio: "Senior engineer with 10 years of experience in distributed systems." },
      { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", bio: "Content strategist focused on technical writing and documentation." },
      { id: "3", name: "Carol Lee", email: "carol@example.com", role: "Viewer", bio: "Product designer specializing in design systems and accessibility." },
    ]
    const expansion = useRowExpansion()
    const selection = useRowSelection(users, { key: "id" })

    return (
      <DataTable expansion={expansion} selection={selection} aria-label="Users with details and selection">
        <DataTable.Head>
          <DataTable.SelectHeader />
          <DataTable.Header>Name</DataTable.Header>
          <DataTable.Header>Email</DataTable.Header>
          <DataTable.Header>Role</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          {users.map((user) => (
            <DataTable.Row key={user.id} rowId={user.id} detail={
              <div className="flex flex-col gap-1">
                <p className="text-word-secondary text-sm font-medium">Bio</p>
                <p className="text-word-primary text-sm">{user.bio}</p>
              </div>
            }>
              <DataTable.SelectCell />
              <DataTable.Cell>{user.name}</DataTable.Cell>
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>{user.role}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.BulkBar>
          <button className="text-sm text-white underline">Delete</button>
        </DataTable.BulkBar>
      </DataTable>
    )
  },
}
```

**Step 3: Verify Storybook builds**

Run: `pnpm exec tsc -b`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/components/data-table/data-table.stories.tsx
git commit -m "feat(data-table): add expandable rows stories"
```

---

### Task 7: Final verification

**Step 1: Run full test suite**

Run: `pnpm test`
Expected: All tests pass

**Step 2: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 3: Lint**

Run: `pnpm lint`
Expected: No errors (or only pre-existing ones)

**Step 4: Visual check**

Run: `pnpm storybook`
Verify:
- ExpandableRows story: click row → detail appears with slide animation, click again → closes
- ExpandableWithSelection story: checkbox selects, row click expands, accordion behavior works
- Chevron rotates on expand
- No layout shift or visual glitch
