import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "@/components/input"

describe("Input", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render a text input by default", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("should render placeholder text", () => {
    render(<Input placeholder="Enter value" />)
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument()
  })

  it("should forward ref to the input element", () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("should set aria-invalid when aria-invalid is true", () => {
    render(<Input aria-invalid={true} />)
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })

  it("should render search icon for type search", () => {
    render(<Input type="search" />)
    const input = screen.getByRole("searchbox")
    expect(input).toBeInTheDocument()
    expect(document.querySelector("svg")).toBeInTheDocument()
  })

  it("should render spinner instead of search icon when loading", () => {
    render(<Input type="search" loading />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("should apply custom className to the root wrapper", () => {
    const { container } = render(<Input className="custom-class" />)
    expect(container.firstChild).toHaveClass("custom-class")
  })

  it("should render prefix text", () => {
    render(<Input prefix="http://" />)
    expect(screen.getByText("http://")).toBeInTheDocument()
  })

  it("should render suffix text", () => {
    render(<Input suffix="@domain.com" />)
    expect(screen.getByText("@domain.com")).toBeInTheDocument()
  })

  it("should render both prefix and suffix", () => {
    render(<Input prefix="http://" suffix=".com" />)
    expect(screen.getByText("http://")).toBeInTheDocument()
    expect(screen.getByText(".com")).toBeInTheDocument()
  })

  it("should toggle password visibility when clicking the eye icon", async () => {
    render(<Input type="password" defaultValue="secret" />)
    const input = document.querySelector("input")!
    expect(input).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(input).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: "Hide password" }))
    expect(input).toHaveAttribute("type", "password")
  })

  it("should have aria-label 'Show password' by default", () => {
    render(<Input type="password" />)
    expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument()
  })

  it("should change aria-label to 'Hide password' when toggled", async () => {
    render(<Input type="password" />)
    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument()
  })
})
