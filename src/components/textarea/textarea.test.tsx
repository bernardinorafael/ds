import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Textarea } from "@/components/textarea"

describe("Textarea", () => {
  it("should render a textarea element", () => {
    render(<Textarea />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("should render placeholder text", () => {
    render(<Textarea placeholder="Enter value" />)
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument()
  })

  it("should forward ref to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Textarea disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("should set aria-invalid when aria-invalid is true", () => {
    render(<Textarea aria-invalid={true} />)
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })

  it("should apply custom className to the root wrapper", () => {
    const { container } = render(<Textarea className="custom-class" />)
    expect(container.firstChild).toHaveClass("custom-class")
  })

  it("should be read-only when readOnly prop is true", () => {
    render(<Textarea readOnly value="Read only" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
  })
})
