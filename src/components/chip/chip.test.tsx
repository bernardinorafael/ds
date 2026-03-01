import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Chip } from "@/components/chip"

describe("Chip", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render with children", () => {
    render(<Chip>React</Chip>)
    expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Chip ref={ref}>React</Chip>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should merge custom className", () => {
    render(<Chip className="custom-class">React</Chip>)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })

  it("should default to type button", () => {
    render(<Chip>React</Chip>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "button")
  })

  it("should call onClick when clicked", async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>React</Chip>)
    await user.click(screen.getByRole("button", { name: "React" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Chip disabled>React</Chip>)
    expect(screen.getByRole("button", { name: "React" })).toBeDisabled()
  })

  it("should render icon element", () => {
    const { container } = render(<Chip icon="check-circle">React</Chip>)
    expect(container.querySelector("[data-icon]")).toBeInTheDocument()
  })

  it("should render remove button when onRemove is provided", () => {
    render(<Chip onRemove={() => {}}>React</Chip>)
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument()
  })

  it("should call onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>React</Chip>)
    await user.click(screen.getByRole("button", { name: "Remove" }))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it("should not trigger onClick when remove button is clicked", async () => {
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <Chip onClick={onClick} onRemove={onRemove}>
        React
      </Chip>
    )
    await user.click(screen.getByRole("button", { name: "Remove" }))
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onClick).not.toHaveBeenCalled()
  })

  it("should use custom removeLabel", () => {
    render(
      <Chip onRemove={() => {}} removeLabel="Delete">
        React
      </Chip>
    )
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("should disable remove button when chip is disabled", () => {
    render(
      <Chip disabled onRemove={() => {}}>
        React
      </Chip>
    )
    expect(screen.getByRole("button", { name: "Remove" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })
})
