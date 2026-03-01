import { createRef } from "react"

import { act, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  DataTable,
  useRowSelection,
  useSortState,
  type PaginationProps,
} from "@/components/data-table"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SimpleTable({ children }: { children?: React.ReactNode }) {
  return (
    <DataTable>
      <DataTable.Head>
        <DataTable.Header>Name</DataTable.Header>
        <DataTable.Header>Email</DataTable.Header>
      </DataTable.Head>
      <DataTable.Body>
        <DataTable.Row>
          <DataTable.Cell>Alice</DataTable.Cell>
          <DataTable.Cell>alice@example.com</DataTable.Cell>
        </DataTable.Row>
      </DataTable.Body>
      {children}
    </DataTable>
  )
}

const basePagination: PaginationProps = {
  count: 50,
  page: 1,
  limit: 10,
  hasNextPage: true,
  hasPreviousPage: false,
  onPageChange: vi.fn(),
  onLimitChange: vi.fn(),
}

// ---------------------------------------------------------------------------
// DataTable.Root
// ---------------------------------------------------------------------------

describe("DataTable", () => {
  it("should render a section with data-table-root attribute", () => {
    const { container } = render(<SimpleTable />)
    expect(container.querySelector("[data-table-root]")).toBeInTheDocument()
  })

  it("should render an inner table element", () => {
    render(<SimpleTable />)
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("should forward ref to the inner table element", () => {
    const ref = createRef<HTMLTableElement>()
    render(
      <DataTable ref={ref}>
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
    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })

  it("should not render footer when pagination is not provided", () => {
    const { container } = render(<SimpleTable />)
    expect(container.querySelector("[data-table-footer]")).not.toBeInTheDocument()
  })

  it("should not render footer when count equals minLimitOption", () => {
    render(
      <DataTable
        pagination={{ ...basePagination, count: 10 }}
        limitOptions={[10, 25, 50]}
      >
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
    expect(screen.queryByText("Results per page")).not.toBeInTheDocument()
  })

  it("should render footer when count exceeds minLimitOption", () => {
    render(
      <DataTable
        pagination={{ ...basePagination, count: 50 }}
        limitOptions={[10, 25, 50]}
      >
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
    expect(screen.getByText("Results per page")).toBeInTheDocument()
  })

  it("should display correct range text in footer", () => {
    render(
      <DataTable pagination={{ ...basePagination, count: 50, page: 1, limit: 10 }}>
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
    expect(screen.getByText("1–10 of 50")).toBeInTheDocument()
  })

  it("should display page indicator in footer", () => {
    render(
      <DataTable pagination={{ ...basePagination, count: 50, page: 2, limit: 10 }}>
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
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument() // pageEnd = ceil(50/10)
  })

  it("should disable previous button when hasPreviousPage is false", () => {
    render(
      <DataTable pagination={{ ...basePagination, hasPreviousPage: false }}>
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
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
  })

  it("should disable next button when hasNextPage is false", () => {
    render(
      <DataTable pagination={{ ...basePagination, hasNextPage: false }}>
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
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
  })

  it("should call onPageChange when next page button is clicked", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <DataTable
        pagination={{ ...basePagination, page: 1, hasNextPage: true, onPageChange }}
      >
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
    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("should call onPageChange when previous page button is clicked", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <DataTable
        pagination={{ ...basePagination, page: 3, hasPreviousPage: true, onPageChange }}
      >
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
    await user.click(screen.getByRole("button", { name: "Previous page" }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})

// ---------------------------------------------------------------------------
// DataTable.Header
// ---------------------------------------------------------------------------

describe("DataTable.Header", () => {
  it("should render a th element", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument()
  })

  it("should forward ref to th element", () => {
    const ref = createRef<HTMLTableCellElement>()
    render(
      <table>
        <thead>
          <tr>
            <DataTable.Header ref={ref}>Name</DataTable.Header>
          </tr>
        </thead>
      </table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement)
  })

  it("should apply sr-only to inner span when srOnly is true", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.Header srOnly>Actions</DataTable.Header>
          </tr>
        </thead>
      </table>
    )
    const header = screen.getByRole("columnheader")
    expect(header.querySelector("span")).toHaveClass("sr-only")
  })

  it("should not apply sr-only when srOnly is false", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
        </thead>
      </table>
    )
    const header = screen.getByRole("columnheader")
    expect(header.querySelector("span")).not.toHaveClass("sr-only")
  })
})

// ---------------------------------------------------------------------------
// DataTable.Cell
// ---------------------------------------------------------------------------

describe("DataTable.Cell", () => {
  it("should render a td element", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.Cell>Alice</DataTable.Cell>
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument()
  })

  it("should forward ref to td element", () => {
    const ref = createRef<HTMLTableCellElement>()
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.Cell ref={ref}>Alice</DataTable.Cell>
          </tr>
        </tbody>
      </table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement)
  })

  it("should apply pl-0 when flushLeft is true", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.Cell flushLeft>Alice</DataTable.Cell>
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("cell")).toHaveClass("pl-0")
  })

  it("should apply pr-0 when flushRight is true", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.Cell flushRight>Alice</DataTable.Cell>
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("cell")).toHaveClass("pr-0")
  })

  it("should set data-table-cell attribute", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.Cell>Alice</DataTable.Cell>
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("cell")).toHaveAttribute("data-table-cell")
  })
})

// ---------------------------------------------------------------------------
// DataTable.Head
// ---------------------------------------------------------------------------

describe("DataTable.Head", () => {
  it("should render a thead element", () => {
    const { container } = render(
      <table>
        <DataTable.Head>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
      </table>
    )
    expect(container.querySelector("thead")).toBeInTheDocument()
  })

  it("should forward ref to thead element", () => {
    const ref = createRef<HTMLTableSectionElement>()
    render(
      <table>
        <DataTable.Head ref={ref}>
          <DataTable.Header>Name</DataTable.Header>
        </DataTable.Head>
      </table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement)
  })
})

// ---------------------------------------------------------------------------
// DataTable.Body
// ---------------------------------------------------------------------------

describe("DataTable.Body", () => {
  it("should render a tbody element", () => {
    const { container } = render(
      <table>
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell>Alice</DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </table>
    )
    expect(container.querySelector("tbody")).toBeInTheDocument()
  })

  it("should forward ref to tbody element", () => {
    const ref = createRef<HTMLTableSectionElement>()
    render(
      <table>
        <DataTable.Body ref={ref}>
          <DataTable.Row>
            <DataTable.Cell>Alice</DataTable.Cell>
          </DataTable.Row>
        </DataTable.Body>
      </table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement)
  })
})

// ---------------------------------------------------------------------------
// DataTable.Row
// ---------------------------------------------------------------------------

describe("DataTable.Row", () => {
  it("should render a tr element", () => {
    const { container } = render(
      <table>
        <tbody>
          <DataTable.Row>
            <td>Alice</td>
          </DataTable.Row>
        </tbody>
      </table>
    )
    expect(container.querySelector("tr")).toBeInTheDocument()
  })

  it("should forward ref to tr element", () => {
    const ref = createRef<HTMLTableRowElement>()
    render(
      <table>
        <tbody>
          <DataTable.Row ref={ref}>
            <td>Alice</td>
          </DataTable.Row>
        </tbody>
      </table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement)
  })

  it("should add data-selected attribute when selected is true", () => {
    const { container } = render(
      <table>
        <tbody>
          <DataTable.Row selected>
            <td>Alice</td>
          </DataTable.Row>
        </tbody>
      </table>
    )
    expect(container.querySelector("tr")).toHaveAttribute("data-selected")
  })

  it("should not add data-selected attribute when selected is false", () => {
    const { container } = render(
      <table>
        <tbody>
          <DataTable.Row>
            <td>Alice</td>
          </DataTable.Row>
        </tbody>
      </table>
    )
    expect(container.querySelector("tr")).not.toHaveAttribute("data-selected")
  })
})

// ---------------------------------------------------------------------------
// DataTable.SortHeader
// ---------------------------------------------------------------------------

describe("DataTable.SortHeader", () => {
  it("should render a th element", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader onSort={vi.fn()}>Name</DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("columnheader")).toBeInTheDocument()
  })

  it("should forward ref to th element", () => {
    const ref = createRef<HTMLTableCellElement>()
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader ref={ref} onSort={vi.fn()}>
              Name
            </DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement)
  })

  it("should set aria-sort none when no direction is provided", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader onSort={vi.fn()}>Name</DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "none")
  })

  it("should set aria-sort ascending when direction is asc", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader direction="asc" onSort={vi.fn()}>
              Name
            </DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "ascending")
  })

  it("should set aria-sort descending when direction is desc", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader direction="desc" onSort={vi.fn()}>
              Name
            </DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "descending")
  })

  it("should call onSort with asc when unsorted and clicked", async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader onSort={onSort}>Name</DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    await user.click(screen.getByRole("button", { name: "Sort Name ascending" }))
    expect(onSort).toHaveBeenCalledWith("asc")
  })

  it("should call onSort with desc when direction is asc and clicked", async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader direction="asc" onSort={onSort}>
              Name
            </DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    await user.click(screen.getByRole("button", { name: "Sort Name descending" }))
    expect(onSort).toHaveBeenCalledWith("desc")
  })

  it("should call onSort with undefined when direction is desc and clicked", async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader direction="desc" onSort={onSort}>
              Name
            </DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    await user.click(screen.getByRole("button", { name: "Clear Name sort" }))
    expect(onSort).toHaveBeenCalledWith(undefined)
  })

  it("should include column name in button aria-label", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader onSort={vi.fn()}>Revenue</DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(
      screen.getByRole("button", { name: "Sort Revenue ascending" })
    ).toBeInTheDocument()
  })

  it("should use label prop in aria-label when children is not a string", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SortHeader label="Revenue" onSort={vi.fn()}>
              <span>Revenue</span>
            </DataTable.SortHeader>
          </tr>
        </thead>
      </table>
    )
    expect(
      screen.getByRole("button", { name: "Sort Revenue ascending" })
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// useSortState
// ---------------------------------------------------------------------------

describe("useSortState", () => {
  it("should return undefined direction for all columns when no initial state", () => {
    const { result } = renderHook(() => useSortState())
    expect(result.current.directionFor("name")).toBeUndefined()
  })

  it("should return direction for the initial column", () => {
    const { result } = renderHook(() =>
      useSortState({ column: "name", direction: "asc" })
    )
    expect(result.current.directionFor("name")).toBe("asc")
    expect(result.current.directionFor("email")).toBeUndefined()
  })

  it("should set sort when handleSort is called", () => {
    const { result } = renderHook(() => useSortState())
    act(() => result.current.handleSort("name")("asc"))
    expect(result.current.directionFor("name")).toBe("asc")
  })

  it("should clear sort when handleSort is called with undefined", () => {
    const { result } = renderHook(() =>
      useSortState({ column: "name", direction: "asc" })
    )
    act(() => result.current.handleSort("name")(undefined))
    expect(result.current.sort).toBeUndefined()
    expect(result.current.directionFor("name")).toBeUndefined()
  })

  it("should switch active column when a different column is sorted", () => {
    const { result } = renderHook(() =>
      useSortState({ column: "name", direction: "asc" })
    )
    act(() => result.current.handleSort("email")("desc"))
    expect(result.current.directionFor("name")).toBeUndefined()
    expect(result.current.directionFor("email")).toBe("desc")
  })
})

// ---------------------------------------------------------------------------
// DataTable.SelectHeader
// ---------------------------------------------------------------------------

describe("DataTable.SelectHeader", () => {
  it("should render a th with a checkbox", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SelectHeader checked={false} onChange={vi.fn()} />
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeInTheDocument()
  })

  it("should render checkbox as checked when checked is true", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SelectHeader checked={true} onChange={vi.fn()} />
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeChecked()
  })

  it("should render checkbox as indeterminate when indeterminate is true", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SelectHeader checked={false} indeterminate onChange={vi.fn()} />
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toHaveAttribute(
      "data-state",
      "indeterminate"
    )
  })

  it("should call onChange when clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SelectHeader checked={false} onChange={onChange} />
          </tr>
        </thead>
      </table>
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it("should disable checkbox when disabled is true", () => {
    render(
      <table>
        <thead>
          <tr>
            <DataTable.SelectHeader checked={false} onChange={vi.fn()} disabled />
          </tr>
        </thead>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// DataTable.SelectCell
// ---------------------------------------------------------------------------

describe("DataTable.SelectCell", () => {
  it("should render a td with a checkbox", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.SelectCell checked={false} onChange={vi.fn()} />
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select row" })).toBeInTheDocument()
  })

  it("should render checkbox as checked when checked is true", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.SelectCell checked={true} onChange={vi.fn()} />
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select row" })).toBeChecked()
  })

  it("should call onChange when clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.SelectCell checked={false} onChange={onChange} />
          </tr>
        </tbody>
      </table>
    )
    await user.click(screen.getByRole("checkbox", { name: "Select row" }))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it("should set data-table-cell attribute", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.SelectCell checked={false} onChange={vi.fn()} />
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("cell")).toHaveAttribute("data-table-cell")
  })

  it("should disable checkbox when disabled is true", () => {
    render(
      <table>
        <tbody>
          <tr>
            <DataTable.SelectCell checked={false} onChange={vi.fn()} disabled />
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByRole("checkbox", { name: "Select row" })).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// useRowSelection
// ---------------------------------------------------------------------------

describe("useRowSelection", () => {
  const rows = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Carol" },
  ]

  it("should start with no selection", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    expect(result.current.selectedIds.size).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
    expect(result.current.isPartialSelected).toBe(false)
  })

  it("should select a row when toggleRow is called", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    act(() => result.current.toggleRow("1"))
    expect(result.current.isSelected("1")).toBe(true)
    expect(result.current.isSelected("2")).toBe(false)
  })

  it("should deselect a row when toggleRow is called on an already selected row", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    act(() => result.current.toggleRow("1"))
    act(() => result.current.toggleRow("1"))
    expect(result.current.isSelected("1")).toBe(false)
  })

  it("should set isPartialSelected when some rows are selected", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    act(() => result.current.toggleRow("1"))
    expect(result.current.isPartialSelected).toBe(true)
    expect(result.current.isAllSelected).toBe(false)
  })

  it("should set isAllSelected when all rows are selected", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    act(() => result.current.toggleAll())
    expect(result.current.isAllSelected).toBe(true)
    expect(result.current.isPartialSelected).toBe(false)
  })

  it("should deselect all rows when toggleAll is called and all are already selected", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    act(() => result.current.toggleAll())
    act(() => result.current.toggleAll())
    expect(result.current.selectedIds.size).toBe(0)
    expect(result.current.isAllSelected).toBe(false)
  })

  it("should clear all selections when clearSelection is called", () => {
    const { result } = renderHook(() => useRowSelection(rows, { key: "id" }))
    act(() => result.current.toggleRow("1"))
    act(() => result.current.toggleRow("2"))
    act(() => result.current.clearSelection())
    expect(result.current.selectedIds.size).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// DataTable.Actions
// ---------------------------------------------------------------------------

describe("DataTable.Actions", () => {
  it("should render a div with flex layout", () => {
    const { container } = render(
      <DataTable.Actions>
        <button>Edit</button>
      </DataTable.Actions>
    )
    const div = container.firstChild as HTMLElement
    expect(div.tagName).toBe("DIV")
    expect(div).toHaveClass("flex", "items-center", "justify-center")
  })

  it("should forward ref to div element", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <DataTable.Actions ref={ref}>
        <button>Edit</button>
      </DataTable.Actions>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
