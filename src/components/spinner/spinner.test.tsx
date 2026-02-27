import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Spinner } from "@/components/spinner"

describe("Spinner", () => {
  it("should render with status role", () => {
    render(<Spinner />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("should have default aria-label", () => {
    render(<Spinner />)
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading")
  })

  it("should accept custom label", () => {
    render(<Spinner label="Saving" />)
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Saving")
  })

  it("should render 12 blades", () => {
    const { container } = render(<Spinner />)
    expect(container.querySelectorAll(".spinner-blade")).toHaveLength(12)
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLDivElement>()
    render(<Spinner ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should merge custom className", () => {
    render(<Spinner className="text-primary" />)
    expect(screen.getByRole("status")).toHaveClass("text-primary")
  })
})
