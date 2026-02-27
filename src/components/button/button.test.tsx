import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/button"

describe("Button", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("should default to type button", () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "button")
  })

  it("should allow overriding type", () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it("should call onClick when clicked", async () => {
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it("should not call onClick when disabled", async () => {
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>
    )

    await user.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("should be disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("should apply primary variant by default", () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-primary")
  })

  it("should apply secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-secondary")
  })

  it("should apply sm size", () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-6")
  })

  it("should merge custom className", () => {
    render(<Button className="mt-4">Custom</Button>)
    expect(screen.getByRole("button")).toHaveClass("mt-4")
  })

  it("should forward additional HTML attributes", () => {
    render(<Button aria-label="Close dialog">✕</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Close dialog")
  })
})
