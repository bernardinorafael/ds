import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Switch } from "@/components/switch"

describe("Switch", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render as a switch role", () => {
    render(<Switch aria-label="Toggle" />)
    expect(screen.getByRole("switch", { name: "Toggle" })).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch ref={ref} aria-label="Toggle" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should merge custom className", () => {
    render(<Switch aria-label="Toggle" className="custom-class" />)
    expect(screen.getByRole("switch")).toHaveClass("custom-class")
  })

  it("should toggle checked state on click", async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Toggle" onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole("switch"))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("should not toggle when disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Toggle" disabled onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole("switch"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Switch aria-label="Toggle" disabled />)
    expect(screen.getByRole("switch")).toBeDisabled()
  })

  it("should apply aria-invalid", () => {
    render(<Switch aria-label="Toggle" aria-invalid={true} />)
    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true")
  })

  it("should render as checked when defaultChecked", () => {
    render(<Switch aria-label="Toggle" defaultChecked />)
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked")
  })
})
