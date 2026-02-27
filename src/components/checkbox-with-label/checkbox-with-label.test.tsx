import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CheckboxWithLabel } from "@/components/checkbox-with-label"

describe("CheckboxWithLabel", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render a checkbox with label text", () => {
    render(<CheckboxWithLabel id="terms">Accept terms</CheckboxWithLabel>)
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
    expect(screen.getByText("Accept terms")).toBeInTheDocument()
  })

  it("should forward ref to the checkbox", () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <CheckboxWithLabel ref={ref} id="terms">
        Accept
      </CheckboxWithLabel>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should associate label with checkbox via id", () => {
    render(<CheckboxWithLabel id="terms">Accept</CheckboxWithLabel>)
    expect(screen.getByRole("checkbox")).toHaveAttribute("id", "terms")
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-labelledby", "terms-label")
  })

  it("should toggle when clicking the label", async () => {
    render(<CheckboxWithLabel id="terms">Accept terms</CheckboxWithLabel>)
    await user.click(screen.getByText("Accept terms"))
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("should render description when provided", () => {
    render(
      <CheckboxWithLabel id="terms" description="Read the fine print">
        Accept
      </CheckboxWithLabel>
    )
    expect(screen.getByText("Read the fine print")).toBeInTheDocument()
    expect(screen.getByText("Read the fine print").tagName).toBe("P")
  })

  it("should not render description when not provided", () => {
    const { container } = render(<CheckboxWithLabel id="terms">Accept</CheckboxWithLabel>)
    expect(container.querySelector("p")).not.toBeInTheDocument()
  })

  it("should be disabled when disabled prop is passed", () => {
    render(
      <CheckboxWithLabel id="terms" disabled>
        Accept
      </CheckboxWithLabel>
    )
    expect(screen.getByRole("checkbox")).toBeDisabled()
  })

  it("should be checked when defaultChecked is true", () => {
    render(
      <CheckboxWithLabel id="terms" defaultChecked>
        Accept
      </CheckboxWithLabel>
    )
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("should call onCheckedChange when toggled", async () => {
    const onCheckedChange = vi.fn()
    render(
      <CheckboxWithLabel id="terms" onCheckedChange={onCheckedChange}>
        Accept
      </CheckboxWithLabel>
    )
    await user.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("should apply disabled styling to the label text", () => {
    render(
      <CheckboxWithLabel id="terms" disabled>
        Accept
      </CheckboxWithLabel>
    )
    expect(screen.getByText("Accept")).toHaveClass("opacity-50")
  })

  it("should apply disabled styling to the description", () => {
    render(
      <CheckboxWithLabel id="terms" disabled description="Details">
        Accept
      </CheckboxWithLabel>
    )
    expect(screen.getByText("Details")).toHaveClass("opacity-50")
  })

  it("should show cursor-not-allowed when disabled", () => {
    const { container } = render(
      <CheckboxWithLabel id="terms" disabled>
        Accept
      </CheckboxWithLabel>
    )
    expect(container.querySelector("label")).toHaveClass("cursor-not-allowed")
  })

  it("should show cursor-pointer when enabled", () => {
    const { container } = render(<CheckboxWithLabel id="terms">Accept</CheckboxWithLabel>)
    expect(container.querySelector("label")).toHaveClass("cursor-pointer")
  })

  it("should merge custom className on the label", () => {
    const { container } = render(
      <CheckboxWithLabel id="terms" className="custom-class">
        Accept
      </CheckboxWithLabel>
    )
    expect(container.querySelector("label")).toHaveClass("custom-class")
  })
})
