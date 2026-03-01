import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DataTable, type PaginationProps } from "@/components/data-table"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SimpleTable({ children }: { children?: React.ReactNode }) {
  return (
    <DataTable>
      <DataTable.Head>
        <tr>
          <DataTable.Header>Name</DataTable.Header>
          <DataTable.Header>Email</DataTable.Header>
        </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
          <tr>
            <DataTable.Header>Name</DataTable.Header>
          </tr>
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
