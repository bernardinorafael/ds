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

  it("should apply outline variant", () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border", "border-border")
  })

  it("should apply ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).not.toHaveClass("bg-primary")
  })

  it("should apply destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-destructive")
  })

  it("should apply link variant", () => {
    render(<Button variant="link">Link</Button>)
    expect(screen.getByRole("button")).toHaveClass("underline-offset-4")
  })

  it("should apply sm size", () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-8")
  })

  it("should apply lg size", () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-12")
  })

  it("should apply icon size", () => {
    render(<Button size="icon">★</Button>)
    expect(screen.getByRole("button")).toHaveClass("size-10")
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
