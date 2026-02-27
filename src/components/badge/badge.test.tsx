import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Badge } from "@/components/badge"

describe("Badge", () => {
  it("should render with children", () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("should forward ref to the span element", () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>Ref</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("should merge custom className", () => {
    render(<Badge className="mt-2">Custom</Badge>)
    expect(screen.getByText("Custom").parentElement).toHaveClass("mt-2")
  })

  it("should render shimmer effect for pro intent", () => {
    const { container } = render(<Badge intent="pro">Pro</Badge>)
    expect(container.querySelector(".animate-badge-shimmer")).toBeInTheDocument()
  })

  it("should render dashed border for beta intent", () => {
    const { container } = render(<Badge intent="beta">Beta</Badge>)
    expect(container.querySelectorAll("svg")).toHaveLength(4)
  })

  it("should not render shimmer for non-pro intents", () => {
    const { container } = render(<Badge intent="success">Success</Badge>)
    expect(container.querySelector(".animate-badge-shimmer")).not.toBeInTheDocument()
  })

  it("should not render dashed border for non-beta intents", () => {
    const { container } = render(<Badge intent="info">Info</Badge>)
    expect(container.querySelectorAll("svg")).toHaveLength(0)
  })
})
