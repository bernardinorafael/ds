import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SwitchWithLabel } from "@/components/switch-with-label"

describe("SwitchWithLabel", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render a switch with label text", () => {
    render(<SwitchWithLabel id="notifications">Enable notifications</SwitchWithLabel>)
    expect(screen.getByRole("switch")).toBeInTheDocument()
    expect(screen.getByText("Enable notifications")).toBeInTheDocument()
  })

  it("should forward ref to the switch", () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <SwitchWithLabel ref={ref} id="notifications">
        Enable
      </SwitchWithLabel>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should associate label with switch via id", () => {
    render(<SwitchWithLabel id="notifications">Enable</SwitchWithLabel>)
    expect(screen.getByRole("switch")).toHaveAttribute("id", "notifications")
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-labelledby",
      "notifications-label"
    )
  })

  it("should toggle when clicking the label", async () => {
    render(<SwitchWithLabel id="notifications">Enable notifications</SwitchWithLabel>)
    await user.click(screen.getByText("Enable notifications"))
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("should render description when provided", () => {
    render(
      <SwitchWithLabel id="notifications" description="Receive push notifications">
        Enable
      </SwitchWithLabel>
    )
    expect(screen.getByText("Receive push notifications")).toBeInTheDocument()
    expect(screen.getByText("Receive push notifications").tagName).toBe("P")
  })

  it("should not render description when not provided", () => {
    const { container } = render(
      <SwitchWithLabel id="notifications">Enable</SwitchWithLabel>
    )
    expect(container.querySelector("p")).not.toBeInTheDocument()
  })

  it("should be disabled when disabled prop is passed", () => {
    render(
      <SwitchWithLabel id="notifications" disabled>
        Enable
      </SwitchWithLabel>
    )
    expect(screen.getByRole("switch")).toBeDisabled()
  })

  it("should be checked when defaultChecked is true", () => {
    render(
      <SwitchWithLabel id="notifications" defaultChecked>
        Enable
      </SwitchWithLabel>
    )
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("should call onCheckedChange when toggled", async () => {
    const onCheckedChange = vi.fn()
    render(
      <SwitchWithLabel id="notifications" onCheckedChange={onCheckedChange}>
        Enable
      </SwitchWithLabel>
    )
    await user.click(screen.getByRole("switch"))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("should apply disabled styling to the label text", () => {
    render(
      <SwitchWithLabel id="notifications" disabled>
        Enable
      </SwitchWithLabel>
    )
    expect(screen.getByText("Enable")).toHaveClass("opacity-50")
  })

  it("should apply disabled styling to the description", () => {
    render(
      <SwitchWithLabel id="notifications" disabled description="Details">
        Enable
      </SwitchWithLabel>
    )
    expect(screen.getByText("Details")).toHaveClass("opacity-50")
  })

  it("should show cursor-not-allowed when disabled", () => {
    const { container } = render(
      <SwitchWithLabel id="notifications" disabled>
        Enable
      </SwitchWithLabel>
    )
    expect(container.querySelector("label")).toHaveClass("cursor-not-allowed")
  })

  it("should show cursor-pointer when enabled", () => {
    const { container } = render(
      <SwitchWithLabel id="notifications">Enable</SwitchWithLabel>
    )
    expect(container.querySelector("label")).toHaveClass("cursor-pointer")
  })

  it("should merge custom className on the label", () => {
    const { container } = render(
      <SwitchWithLabel id="notifications" className="custom-class">
        Enable
      </SwitchWithLabel>
    )
    expect(container.querySelector("label")).toHaveClass("custom-class")
  })
})
