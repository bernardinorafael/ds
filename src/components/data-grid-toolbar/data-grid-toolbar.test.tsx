import { render, screen } from "@testing-library/react"

import { DataGridToolbar } from "@/components/data-grid-toolbar"

describe("DataGridToolbar", () => {
  it("should render children", () => {
    render(
      <DataGridToolbar>
        <table data-testid="table" />
      </DataGridToolbar>
    )
    expect(screen.getByTestId("table")).toBeInTheDocument()
  })

  it("should render search slot", () => {
    render(
      <DataGridToolbar search={<input placeholder="Search" />}>
        <table />
      </DataGridToolbar>
    )
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument()
  })

  it("should render filter slot", () => {
    render(
      <DataGridToolbar filter={<div data-testid="filter">Filter</div>}>
        <table />
      </DataGridToolbar>
    )
    expect(screen.getByTestId("filter")).toBeInTheDocument()
  })

  it("should render sort slot", () => {
    render(
      <DataGridToolbar sort={<div data-testid="sort">Sort</div>}>
        <table />
      </DataGridToolbar>
    )
    expect(screen.getByTestId("sort")).toBeInTheDocument()
  })

  it("should render action slot", () => {
    render(
      <DataGridToolbar action={<button>Add</button>}>
        <table />
      </DataGridToolbar>
    )
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument()
  })

  it("should hide toolbar header when no slots are provided", () => {
    render(
      <DataGridToolbar>
        <table />
      </DataGridToolbar>
    )
    expect(screen.queryByRole("banner")).not.toBeInTheDocument()
  })

  it("should show toolbar header when any control slot is provided", () => {
    render(
      <DataGridToolbar filter={<div>Filter</div>}>
        <table />
      </DataGridToolbar>
    )
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("should show toolbar header when only action is provided", () => {
    render(
      <DataGridToolbar action={<button>Add</button>}>
        <table />
      </DataGridToolbar>
    )
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })

  it("should merge custom className", () => {
    const { container } = render(
      <DataGridToolbar className="max-w-lg">
        <table />
      </DataGridToolbar>
    )
    expect(container.firstChild).toHaveClass("max-w-lg")
  })
})
