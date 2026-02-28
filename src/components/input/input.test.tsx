import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Input } from "@/components/input"

describe("Input", () => {
  it("should render a text input by default", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("should render placeholder text", () => {
    render(<Input placeholder="Enter value" />)
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument()
  })

  it("should forward ref to the input element", () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("should set aria-invalid when aria-invalid is true", () => {
    render(<Input aria-invalid={true} />)
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })

  it("should render search icon for type search", () => {
    render(<Input type="search" />)
    const input = screen.getByRole("searchbox")
    expect(input).toBeInTheDocument()
    expect(document.querySelector("svg")).toBeInTheDocument()
  })

  it("should render spinner instead of search icon when loading", () => {
    render(<Input type="search" loading />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("should apply custom className to the root wrapper", () => {
    const { container } = render(<Input className="custom-class" />)
    expect(container.firstChild).toHaveClass("custom-class")
  })
})
