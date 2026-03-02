import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Kbd } from "@/components/kbd"

describe("Kbd", () => {
  it("should render with children", () => {
    render(<Kbd>Cmd</Kbd>)
    expect(screen.getByText("Cmd")).toBeInTheDocument()
  })

  it("should forward ref to kbd element", () => {
    const ref = createRef<HTMLElement>()
    render(<Kbd ref={ref}>Cmd</Kbd>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("KBD")
  })

  it("should merge custom className", () => {
    render(<Kbd className="custom">Ctrl</Kbd>)
    expect(screen.getByText("Ctrl")).toHaveClass("custom")
  })

  it("should apply neutral intent by default", () => {
    render(<Kbd>K</Kbd>)
    const el = screen.getByText("K")
    expect(el).toHaveClass("bg-gray-200", "text-gray-1000")
  })

  it("should apply danger intent classes", () => {
    render(<Kbd intent="danger">Del</Kbd>)
    const el = screen.getByText("Del")
    expect(el).toHaveClass("bg-red-200", "text-red-1000")
  })

  it("should apply primary intent classes", () => {
    render(<Kbd intent="primary">P</Kbd>)
    const el = screen.getByText("P")
    expect(el).toHaveClass("bg-purple-200", "text-purple-1000")
  })

  it("should apply base size by default", () => {
    render(<Kbd>Shift</Kbd>)
    const el = screen.getByText("Shift")
    expect(el).toHaveClass("h-5", "text-xs")
  })

  it("should apply sm size classes", () => {
    render(<Kbd size="sm">Esc</Kbd>)
    const el = screen.getByText("Esc")
    expect(el).toHaveClass("h-4", "text-2xs")
  })

  it("should set aria-label when provided", () => {
    render(
      <Kbd aria-label="Command key" title="Command">
        ⌘
      </Kbd>
    )
    expect(screen.getByLabelText("Command key")).toBeInTheDocument()
  })
})
