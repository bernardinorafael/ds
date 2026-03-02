import React, { createRef } from "react"

import { act, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  DataTable,
  useRowExpansion,
  useRowSelection,
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

  it("should set data-selected when selection context provides selected state", () => {
    function Demo() {
      const selection = useRowSelection([{ id: "1" }, { id: "2" }], { key: "id" })
      React.useEffect(() => {
        selection.toggleRow("1")
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

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

  it("should call onSort with clear when direction is desc and clicked", async () => {
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

// ---------------------------------------------------------------------------
// DataTable.SelectHeader (context)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// DataTable.SelectCell (context)
// ---------------------------------------------------------------------------

describe("DataTable.SelectCell (context)", () => {
  it("should toggle row selection via context when clicked", async () => {
    const user = userEvent.setup()

    function Demo() {
      const selection = useRowSelection([{ id: "1" }, { id: "2" }], { key: "id" })
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

// ---------------------------------------------------------------------------
// DataTable.BulkBar
// ---------------------------------------------------------------------------

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
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
  })

  it("should render with count when rows are selected", async () => {
    const user = userEvent.setup()

    function Demo() {
      const selection = useRowSelection([{ id: "1" }, { id: "2" }], { key: "id" })
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

// ---------------------------------------------------------------------------
// useRowExpansion
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Expandable Row
// ---------------------------------------------------------------------------

describe("Expandable Row", () => {
  function ExpandableDemo() {
    const expansion = useRowExpansion()
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
    await user.click(rows[1])
    await user.click(rows[2])
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

// ---------------------------------------------------------------------------
// Expand header column
// ---------------------------------------------------------------------------

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
    expect(headers[0].querySelector("span")).toHaveClass("sr-only")
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
