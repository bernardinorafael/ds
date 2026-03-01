import { render, screen } from "@testing-library/react"

import { DataTableToolbar } from "@/components/data-table-toolbar"

describe("DataTableToolbar", () => {
  it("should render children", () => {
    render(
      <DataTableToolbar>
        <table data-testid="table" />
      </DataTableToolbar>
    )
    expect(screen.getByTestId("table")).toBeInTheDocument()
  })

  it("should render search slot", () => {
    render(
      <DataTableToolbar search={<input placeholder="Search" />}>
        <table />
      </DataTableToolbar>
    )
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument()
  })

  it("should render filter slot", () => {
    render(
      <DataTableToolbar filter={<div data-testid="filter">Filter</div>}>
        <table />
      </DataTableToolbar>
    )
    expect(screen.getByTestId("filter")).toBeInTheDocument()
  })

  it("should render sort slot", () => {
    render(
      <DataTableToolbar sort={<div data-testid="sort">Sort</div>}>
        <table />
      </DataTableToolbar>
    )
    expect(screen.getByTestId("sort")).toBeInTheDocument()
  })

  it("should render action slot", () => {
    render(
      <DataTableToolbar action={<button>Add</button>}>
        <table />
      </DataTableToolbar>
    )
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument()
  })

  it("should hide toolbar header when no slots are provided", () => {
    render(
      <DataTableToolbar>
        <table />
      </DataTableToolbar>
    )
    expect(screen.queryByRole("banner")).not.toBeInTheDocument()
  })

  it("should show toolbar header when any control slot is provided", () => {
    render(
      <DataTableToolbar filter={<div>Filter</div>}>
        <table />
      </DataTableToolbar>
    )
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("should show toolbar header when only action is provided", () => {
    render(
      <DataTableToolbar action={<button>Add</button>}>
        <table />
      </DataTableToolbar>
    )
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("should merge custom className", () => {
    const { container } = render(
      <DataTableToolbar className="max-w-lg">
        <table />
      </DataTableToolbar>
    )
    expect(container.firstChild).toHaveClass("max-w-lg")
  })
})
