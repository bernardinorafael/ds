import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Checkbox } from "@/components/checkbox"

describe("Checkbox", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render a checkbox", () => {
    render(<Checkbox aria-label="Accept" />)
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Checkbox ref={ref} aria-label="Accept" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should merge custom className", () => {
    render(<Checkbox aria-label="Accept" className="custom-class" />)
    expect(screen.getByRole("checkbox")).toHaveClass("custom-class")
  })

  it("should be unchecked by default", () => {
    render(<Checkbox aria-label="Accept" />)
    expect(screen.getByRole("checkbox")).not.toBeChecked()
  })

  it("should be checked when defaultChecked is true", () => {
    render(<Checkbox aria-label="Accept" defaultChecked />)
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("should support controlled checked state", () => {
    const { rerender } = render(
      <Checkbox aria-label="Accept" checked={false} onCheckedChange={() => {}} />
    )
    expect(screen.getByRole("checkbox")).not.toBeChecked()

    rerender(<Checkbox aria-label="Accept" checked={true} onCheckedChange={() => {}} />)
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("should toggle when clicked", async () => {
    render(<Checkbox aria-label="Accept" />)
    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it("should call onCheckedChange when toggled", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("should support indeterminate state", () => {
    render(<Checkbox aria-label="Accept" checked="indeterminate" />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("data-state", "indeterminate")
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Checkbox aria-label="Accept" disabled />)
    expect(screen.getByRole("checkbox")).toBeDisabled()
  })

  it("should not toggle when disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Accept" disabled onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("should apply disabled styling when disabled", () => {
    render(<Checkbox aria-label="Accept" disabled />)
    expect(screen.getByRole("checkbox")).toHaveClass("cursor-not-allowed", "opacity-60")
  })

  it("should apply sm size variant by default", () => {
    render(<Checkbox aria-label="Accept" />)
    expect(screen.getByRole("checkbox")).toHaveClass("size-4")
  })

  it("should apply md size variant", () => {
    render(<Checkbox aria-label="Accept" size="md" />)
    expect(screen.getByRole("checkbox")).toHaveClass("size-5")
  })

  it("should apply lg size variant", () => {
    render(<Checkbox aria-label="Accept" size="lg" />)
    expect(screen.getByRole("checkbox")).toHaveClass("size-6")
  })

  it("should set required attribute", () => {
    render(<Checkbox aria-label="Accept" required />)
    expect(screen.getByRole("checkbox")).toBeRequired()
  })

  it("should pass id to the element", () => {
    render(<Checkbox aria-label="Accept" id="terms" />)
    expect(screen.getByRole("checkbox")).toHaveAttribute("id", "terms")
  })

  it("should support aria-labelledby", () => {
    render(
      <>
        <label id="label-id">Terms</label>
        <Checkbox aria-labelledby="label-id" />
      </>
    )
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-labelledby", "label-id")
  })
})
