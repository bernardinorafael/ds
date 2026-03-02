# RowLink + Slot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `DataTable.RowLink` stretched-link component and `Slot`/`composeRef` general-purpose utilities.

**Architecture:** RowLink is an `<a>` placed inside a Cell whose `::before` pseudo covers the entire Row. Row detects RowLink via `has-[[data-table-row-link]]` CSS selectors. `Slot` enables `asChild` composition with router Links.

**Tech Stack:** React 19, Tailwind CSS v4, CVA, Vitest + Testing Library

---

### Task 1: Create `composeRef` utility

**Files:**
- Create: `src/utils/compose-ref.ts`
- Test: `src/utils/compose-ref.test.ts`

**Step 1: Write the failing test**

```ts
// src/utils/compose-ref.test.ts
import { createRef } from "react"

import { composeRef } from "@/utils/compose-ref"

describe("composeRef", () => {
  it("should call function refs with the value", () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const composed = composeRef([fn1, fn2])

    composed("hello")

    expect(fn1).toHaveBeenCalledWith("hello")
    expect(fn2).toHaveBeenCalledWith("hello")
  })

  it("should set .current on mutable ref objects", () => {
    const ref = createRef<string>()
    const composed = composeRef([ref])

    composed("world")

    expect(ref.current).toBe("world")
  })

  it("should skip null and undefined refs", () => {
    const fn = vi.fn()
    const composed = composeRef([null, undefined, fn])

    composed("ok")

    expect(fn).toHaveBeenCalledWith("ok")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/utils/compose-ref.test.ts`
Expected: FAIL — module not found

**Step 3: Write implementation**

```ts
// src/utils/compose-ref.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as React from "react"

export function composeRef<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>,
): React.RefCallback<T> {
  return (v) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(v)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = v
      }
    })
  }
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/utils/compose-ref.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/compose-ref.ts src/utils/compose-ref.test.ts
git commit -m "feat: add composeRef utility"
```

---

### Task 2: Create `Slot` utility

**Files:**
- Create: `src/utils/slot.ts`
- Test: `src/utils/slot.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/utils/slot.test.tsx
import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Slot } from "@/utils/slot"

describe("Slot", () => {
  it("should render the child element with merged props", () => {
    render(
      <Slot data-testid="slot" className="from-slot">
        <button className="from-child">Click</button>
      </Slot>,
    )

    const button = screen.getByTestId("slot")
    expect(button.tagName).toBe("BUTTON")
    expect(button).toHaveTextContent("Click")
    expect(button.className).toContain("from-slot")
    expect(button.className).toContain("from-child")
  })

  it("should forward ref to the child element", () => {
    const ref = createRef<HTMLButtonElement>()

    render(
      <Slot ref={ref}>
        <button>Click</button>
      </Slot>,
    )

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should compose event handlers from both slot and child", async () => {
    const slotClick = vi.fn()
    const childClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Slot onClick={slotClick}>
        <button onClick={childClick}>Click</button>
      </Slot>,
    )

    await user.click(screen.getByRole("button"))

    expect(childClick).toHaveBeenCalledOnce()
    expect(slotClick).toHaveBeenCalledOnce()
  })

  it("should return null when no valid element child is provided", () => {
    const { container } = render(<Slot>plain text</Slot>)
    expect(container.innerHTML).toBe("")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/utils/slot.test.tsx`
Expected: FAIL — module not found

**Step 3: Write implementation**

Port the legacy `Slot` verbatim, changing only the import path for `composeRef`:

```tsx
// src/utils/slot.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"

import { composeRef } from "@/utils/compose-ref"

export type AsChildProp = {
  asChild?: boolean
}

// ─── Slot ───────────────────────────────────────────────────────────────────

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props

  if (isSlottable(children)) {
    const slottable = children

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement<React.PropsWithChildren<unknown>>(slottable.props.child)
          ? React.cloneElement(
              slottable.props.child,
              undefined,
              slottable.props.children(slottable.props.child.props.children),
            )
          : null}
      </SlotClone>
    )
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  )
})

Slot.displayName = "Slot"

// ─── SlotClone ──────────────────────────────────────────────────────────────

interface SlotCloneProps {
  children: React.ReactNode
}

const SlotClone = React.forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props

  if (React.isValidElement<React.RefAttributes<unknown>>(children)) {
    return React.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      ref: forwardedRef
        ? composeRef([forwardedRef, (children as any).ref])
        : (children as any).ref,
    })
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null
})

SlotClone.displayName = "SlotClone"

// ─── Slottable ──────────────────────────────────────────────────────────────

type SlottableProps = {
  child: React.ReactNode
  children: (child: React.ReactNode) => JSX.Element
}

const Slottable = ({ child, children }: SlottableProps) => {
  return children(child)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type AnyProps = Record<string, any>

function isSlottable(
  child: React.ReactNode,
): child is React.ReactElement<SlottableProps> {
  return React.isValidElement(child) && child.type === Slottable
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    const isHandler = /^on[A-Z]/.test(propName)
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args)
          slotPropValue(...args)
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue }
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ")
    }
  }

  return { ...slotProps, ...overrideProps }
}

const Root = Slot

export { Root, Slot, Slottable }
export type { SlotProps }
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/utils/slot.test.tsx`
Expected: PASS

**Step 5: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 6: Commit**

```bash
git add src/utils/slot.ts src/utils/slot.test.tsx
git commit -m "feat: add Slot utility for asChild composition"
```

---

### Task 3: Add RowLink component + Row/Cell modifications

**Files:**
- Modify: `src/components/data-table/data-table.tsx`
  - Lines 1-11: add Slot import
  - Lines 206-258: rootVariants — add `--data-table-cell-bg-hover` CSS var
  - Lines 261-305: cellVariants — change cell bg to use fallback var
  - Lines 760-768: Row `<tr>` className — add `has-[[data-table-row-link]]` selectors
  - Lines 1203-1214: compound export — add RowLink
- Modify: `src/components/data-table/index.ts` — add type export

**Step 1: Add import**

At top of `data-table.tsx` (line 11), add:

```ts
import { Slot, type AsChildProp } from "@/utils/slot"
```

**Step 2: Add CSS var to rootVariants**

After line 246 (`[--data-table-expand-col-w:2.5rem]`), add:

```ts
    // row link
    "[--data-table-cell-bg-hover:var(--color-gray-100)]",
```

**Step 3: Update cellVariants background**

Change line 277 from:
```ts
    "bg-(--data-table-cell-bg)",
```
To:
```ts
    "bg-[var(--data-table-row-bg,var(--data-table-cell-bg))]",
```

**Step 4: Add RowLink-aware classes to Row**

Change the Row `<tr>` className (lines 764-768) from:
```ts
        className={cn(
          "group/table-row text-base",
          "[&+&>*]:border-t [[data-table-detail]+&>*]:border-t",
          className
        )}
```
To:
```ts
        className={cn(
          "group/table-row text-base",
          "[&+&>*]:border-t [[data-table-detail]+&>*]:border-t",
          // RowLink support
          "has-[[data-table-row-link]]:relative",
          "has-[[data-table-row-link]]:isolate",
          "has-[[data-table-row-link]]:[clip-path:inset(0)]",
          "has-[[data-table-row-link]]:hover:[--data-table-row-bg:var(--data-table-cell-bg-hover)]",
          "has-[[data-table-row-link]]:focus-within:[--data-table-row-bg:var(--data-table-cell-bg-hover)]",
          "[&:has([data-table-row-link])_:where(a,button)]:z-[1]",
          className
        )}
```

**Step 5: Add DataTableRowLink component**

Before the compound export section (before line 1199), add:

```tsx
// ---------------------------------------------------------------------------
// DataTableRowLink
// ---------------------------------------------------------------------------

export type DataTableRowLinkProps = Pick<
  React.ComponentProps<"a">,
  "id" | "href" | "target" | "rel" | "aria-label" | "className" | "children"
> &
  AsChildProp

const DataTableRowLink = React.forwardRef<HTMLAnchorElement, DataTableRowLinkProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : "a"

    return (
      <Component
        data-table-row-link=""
        className={cn(
          // positioning
          "static",

          // click target extension
          "-mx-1",
          "-my-0.5",
          "rounded",
          "px-1",
          "py-0.5",
          "appearance-none",

          // focus states
          "outline-none",
          "focus-visible:relative",
          "focus-visible:z-5",
          "focus-visible:ring-[3px]",
          "focus-visible:ring-[color-mix(in_srgb,black_13%,transparent)]",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-[color-mix(in_srgb,black_15%,transparent)]",

          // stretched pseudo — covers the entire row
          "before:pointer-events-auto",
          "before:absolute",
          "before:inset-0",
          "before:z-0",
          "before:block",
          "before:cursor-pointer",

          className,
        )}
        ref={ref}
        {...rest}
      />
    )
  },
)

DataTableRowLink.displayName = "DataTable.RowLink"
```

**Step 6: Add to compound export**

Change the compound export to include RowLink:

```ts
export const DataTable = Object.assign(DataTableRoot, {
  Head: DataTableHead,
  Header: DataTableHeader,
  SortHeader: DataTableSortHeader,
  Body: DataTableBody,
  Row: DataTableRow,
  RowLink: DataTableRowLink,
  Cell: DataTableCell,
  Actions: DataTableActions,
  SelectHeader: DataTableSelectHeader,
  SelectCell: DataTableSelectCell,
  BulkBar: DataTableBulkBar,
})
```

**Step 7: Add type export to index.ts**

Add `DataTableRowLinkProps` to the type exports in `src/components/data-table/index.ts`:

```ts
export type {
  DataTableRootProps,
  DataTableHeaderProps,
  DataTableSortHeaderProps,
  DataTableCellProps,
  DataTableRowLinkProps,
  DataTableSelectHeaderProps,
  DataTableSelectCellProps,
  DataTableBulkBarProps,
  ExpansionContextValue,
  PaginationProps,
  SortDirection,
} from "./data-table"
```

**Step 8: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 9: Commit**

```bash
git add src/components/data-table/data-table.tsx src/components/data-table/index.ts
git commit -m "feat(data-table): add RowLink stretched-link component"
```

---

### Task 4: Write RowLink tests

**Files:**
- Modify: `src/components/data-table/data-table.test.tsx`

**Step 1: Write tests**

Add a new describe block at the end of the test file (inside the outer `describe("DataTable")`):

```tsx
// ---------------------------------------------------------------------------
// DataTable.RowLink
// ---------------------------------------------------------------------------

describe("RowLink", () => {
  it("should render an anchor with data-table-row-link attribute", () => {
    render(
      <DataTable>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>
              <DataTable.RowLink href="/users/1">Alice</DataTable.RowLink>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>,
    )

    const link = screen.getByRole("link", { name: "Alice" })
    expect(link).toHaveAttribute("href", "/users/1")
    expect(link).toHaveAttribute("data-table-row-link", "")
  })

  it("should forward ref to the anchor element", () => {
    const ref = createRef<HTMLAnchorElement>()

    render(
      <DataTable>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>
              <DataTable.RowLink ref={ref} href="/users/1">
                Alice
              </DataTable.RowLink>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>,
    )

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("should merge custom className", () => {
    render(
      <DataTable>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>
              <DataTable.RowLink href="/users/1" className="custom">
                Alice
              </DataTable.RowLink>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>,
    )

    expect(screen.getByRole("link")).toHaveClass("custom")
  })

  it("should render child element when asChild is true", () => {
    render(
      <DataTable>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>
              <DataTable.RowLink asChild>
                <a href="/custom">Alice</a>
              </DataTable.RowLink>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>,
    )

    const link = screen.getByRole("link", { name: "Alice" })
    expect(link).toHaveAttribute("href", "/custom")
    expect(link).toHaveAttribute("data-table-row-link", "")
  })

  it("should pass target and rel props", () => {
    render(
      <DataTable>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>
              <DataTable.RowLink
                href="/users/1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Alice
              </DataTable.RowLink>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})
```

**Step 2: Run tests**

Run: `pnpm vitest run src/components/data-table/data-table.test.tsx`
Expected: All PASS

**Step 3: Commit**

```bash
git add src/components/data-table/data-table.test.tsx
git commit -m "test(data-table): add RowLink tests"
```

---

### Task 5: Add RowLink story

**Files:**
- Modify: `src/components/data-table/data-table.stories.tsx`

**Step 1: Add story**

Add a new story after the existing stories:

```tsx
export const WithRowLink: Story = {
  render: () => (
    <DataTable spacing="cozy">
      <DataTable.Head>
        <DataTable.Header width="40%">Name</DataTable.Header>
        <DataTable.Header>Email</DataTable.Header>
        <DataTable.Header>Role</DataTable.Header>
        <DataTable.Header width={48} srOnly>
          Actions
        </DataTable.Header>
      </DataTable.Head>
      <DataTable.Body>
        {USERS.slice(0, 5).map((user) => (
          <DataTable.Row key={user.id}>
            <DataTable.Cell>
              <DataTable.RowLink href={`#/users/${user.id}`}>
                {user.name}
              </DataTable.RowLink>
            </DataTable.Cell>
            <DataTable.Cell>{user.email}</DataTable.Cell>
            <DataTable.Cell>
              <Badge intent={user.role === "Admin" ? "primary" : "secondary"}>
                {user.role}
              </Badge>
            </DataTable.Cell>
            <DataTable.Cell flushRight>
              <DataTable.Actions>
                <IconButton
                  size="sm"
                  intent="ghost"
                  shape="circle"
                  icon="more-horizontal"
                  aria-label="Actions"
                />
              </DataTable.Actions>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable>
  ),
}
```

**Step 2: Add story with RowLink + Selection + Expansion combined**

```tsx
export const RowLinkWithSelectionAndExpansion: Story = {
  render: function Render() {
    const selection = useRowSelection(USERS.slice(0, 5), { key: "id" })
    const expansion = useRowExpansion()

    return (
      <DataTable spacing="cozy" selection={selection} expansion={expansion}>
        <DataTable.Head>
          <DataTable.SelectHeader />
          <DataTable.Header width="35%">Name</DataTable.Header>
          <DataTable.Header>Email</DataTable.Header>
          <DataTable.Header>Role</DataTable.Header>
        </DataTable.Head>
        <DataTable.Body>
          {USERS.slice(0, 5).map((user) => (
            <DataTable.Row
              key={user.id}
              rowId={user.id}
              detail={
                <div className="flex flex-col gap-1 text-sm">
                  <span>Department: {user.department}</span>
                  <span>Location: {user.location}</span>
                  <span>Joined: {user.joinDate}</span>
                </div>
              }
            >
              <DataTable.SelectCell />
              <DataTable.Cell>
                <DataTable.RowLink href={`#/users/${user.id}`}>
                  {user.name}
                </DataTable.RowLink>
              </DataTable.Cell>
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>
                <Badge intent={user.role === "Admin" ? "primary" : "secondary"}>
                  {user.role}
                </Badge>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable>
    )
  },
}
```

**Step 3: Run Storybook to visually verify**

Run: `pnpm storybook`
Check: Navigate to DataTable > WithRowLink and RowLinkWithSelectionAndExpansion stories.
Verify: Hovering a row highlights the entire row. Clicking the row link text navigates. Clicking a checkbox or expand button does NOT navigate. Focus ring appears on tab.

**Step 4: Commit**

```bash
git add src/components/data-table/data-table.stories.tsx
git commit -m "docs(data-table): add RowLink stories"
```

---

### Task 6: Run full test suite + type check

**Step 1: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 2: Full test suite**

Run: `pnpm test`
Expected: All tests pass

**Step 3: Lint**

Run: `pnpm lint`
Expected: No errors (or only pre-existing warnings)
