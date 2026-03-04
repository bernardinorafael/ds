import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Avatar } from "@/components/avatar"

describe("Avatar", () => {
  it("should render initials from a two-word name", async () => {
    render(<Avatar name="Rafael Bernardino" />)
    expect(await screen.findByText("RB")).toBeInTheDocument()
  })

  it("should render single initial from a one-word name", async () => {
    render(<Avatar name="Rafael" />)
    expect(await screen.findByText("R")).toBeInTheDocument()
  })

  it("should forward ref to the outer span", () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} name="Test User" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("should merge custom className", () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} name="Test User" className="mt-4" />)
    expect(ref.current).toHaveClass("mt-4")
  })

  it("should render fallback even when src is provided and image cannot load", async () => {
    render(<Avatar name="Test User" src="https://example.com/photo.jpg" />)
    expect(await screen.findByText("TU")).toBeInTheDocument()
  })

  it("should render status indicator when status is provided", () => {
    render(<Avatar name="Test User" status="online" />)
    expect(screen.getByLabelText("online")).toBeInTheDocument()
  })

  it("should not render status indicator when status is not provided", () => {
    render(<Avatar name="Test User" />)
    expect(screen.queryByLabelText("online")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("offline")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("busy")).not.toBeInTheDocument()
  })

  it("should uppercase initials", async () => {
    render(<Avatar name="john doe" />)
    expect(await screen.findByText("JD")).toBeInTheDocument()
  })

  it("should render all status variants", () => {
    const { rerender } = render(<Avatar name="User" status="online" />)
    expect(screen.getByLabelText("online")).toBeInTheDocument()

    rerender(<Avatar name="User" status="offline" />)
    expect(screen.getByLabelText("offline")).toBeInTheDocument()

    rerender(<Avatar name="User" status="busy" />)
    expect(screen.getByLabelText("busy")).toBeInTheDocument()
  })
})
