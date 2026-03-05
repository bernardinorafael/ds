import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { EmptyState } from "@/components/empty-state"

describe("EmptyState", () => {
  it("should render with title", () => {
    render(<EmptyState title="No items found" />)
    expect(screen.getByRole("heading", { name: "No items found" })).toBeInTheDocument()
  })

  it("should render description when provided", () => {
    render(<EmptyState title="No items" description="Try adjusting your filters." />)
    expect(screen.getByText("Try adjusting your filters.")).toBeInTheDocument()
  })

  it("should not render description when not provided", () => {
    const { container } = render(<EmptyState title="No items" />)
    expect(container.querySelector("p")).not.toBeInTheDocument()
  })

  it("should render icon when provided", () => {
    render(<EmptyState icon="inbox-outline" title="No items" />)
    expect(screen.getByRole("heading")).toBeInTheDocument()
    expect(document.querySelector("[data-icon]")).toBeInTheDocument()
  })

  it("should not render icon container when not provided", () => {
    const { container } = render(<EmptyState title="No items" />)
    expect(container.querySelector("[data-icon]")).not.toBeInTheDocument()
  })

  it("should render children when provided", () => {
    render(
      <EmptyState title="No items">
        <button type="button">Add item</button>
      </EmptyState>
    )
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} title="No items" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should apply custom className", () => {
    const ref = createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} title="No items" className="custom-class" />)
    expect(ref.current).toHaveClass("custom-class")
  })
})
