import { render, screen } from "@testing-library/react"

import { Label } from "@/components/label"

describe("Label", () => {
  it("should render with children", () => {
    render(<Label htmlFor="field">Email</Label>)
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("should associate label with control via htmlFor", () => {
    render(<Label htmlFor="email-input">Email</Label>)
    expect(screen.getByText("Email").closest("label")).toHaveAttribute(
      "for",
      "email-input"
    )
  })

  it("should apply sr-only when omitLabel", () => {
    render(
      <Label htmlFor="field" omitLabel>
        Email
      </Label>
    )
    expect(screen.getByText("Email").closest("label")).toHaveClass("sr-only")
  })

  it("should apply text-gray-400 when disabled", () => {
    render(
      <Label htmlFor="field" disabled>
        Email
      </Label>
    )
    expect(screen.getByText("Email").closest("label")).toHaveClass("text-gray-400")
  })

  it("should render optional badge with default label when optional", () => {
    render(
      <Label htmlFor="field" optional>
        Email
      </Label>
    )
    expect(screen.getByText("Optional")).toBeInTheDocument()
  })

  it("should render optional badge with custom optionalLabel", () => {
    render(
      <Label htmlFor="field" optional optionalLabel="Opcional">
        Email
      </Label>
    )
    expect(screen.getByText("Opcional")).toBeInTheDocument()
  })

  it("should not render optional badge when optional is not set", () => {
    render(<Label htmlFor="field">Email</Label>)
    expect(screen.queryByText("Optional")).not.toBeInTheDocument()
  })

  it("should merge custom className onto the label element", () => {
    render(
      <Label htmlFor="field" className="mt-2">
        Email
      </Label>
    )
    expect(screen.getByText("Email").closest("label")).toHaveClass("mt-2")
  })

  it("should render wrapper div with flex layout", () => {
    const { container } = render(<Label htmlFor="field">Email</Label>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe("DIV")
    expect(wrapper).toHaveClass("flex", "items-center", "justify-between")
  })
})
