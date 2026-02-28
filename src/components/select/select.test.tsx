import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Select } from "@/components/select"

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
]

describe("Select", () => {
  it("should render trigger with placeholder", () => {
    render(<Select items={items} placeholder="Choose fruit" />)
    expect(screen.getByText("Choose fruit")).toBeInTheDocument()
  })

  it("should forward ref to trigger button", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Select ref={ref} items={items} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should apply id to trigger", () => {
    render(<Select id="fruit-select" items={items} />)
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "fruit-select")
  })

  it("should apply aria-describedby to trigger", () => {
    render(<Select aria-describedby="fruit-hint" items={items} />)
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-describedby", "fruit-hint")
  })

  it("should apply aria-invalid to trigger", () => {
    render(<Select aria-invalid="true" items={items} />)
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true")
  })

  it("should be disabled when disabled prop is set", () => {
    render(<Select disabled items={items} />)
    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  it("should be disabled when loading", () => {
    render(<Select loading items={items} />)
    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  it("should set aria-busy when loading", () => {
    render(<Select loading items={items} />)
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-busy", "true")
  })

  it("should show spinner when loading", () => {
    render(<Select loading items={items} />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("should render prefix text", () => {
    render(<Select prefix="Fruit:" items={items} />)
    expect(screen.getByText("Fruit:")).toBeInTheDocument()
  })

  it("should show selected value", () => {
    render(<Select value="apple" items={items} />)
    expect(screen.getByText("Apple")).toBeInTheDocument()
  })
})
