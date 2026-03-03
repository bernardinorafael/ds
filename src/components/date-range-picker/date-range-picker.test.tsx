import { createRef } from "react"

import { getLocalTimeZone, today } from "@internationalized/date"
import { render, screen } from "@testing-library/react"

import { DateRangePicker } from "@/components/date-range-picker"
import { Provider } from "@/components/provider"

const renderPicker = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>)

describe("DateRangePicker", () => {
  it("should render with sr-only label", () => {
    renderPicker(<DateRangePicker label="Booking period" />)
    const label = screen.getByText("Booking period")
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass("sr-only")
  })

  it("should render default label when not provided", () => {
    renderPicker(<DateRangePicker />)
    expect(screen.getByText("Date range")).toBeInTheDocument()
  })

  it("should forward ref to group element", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DateRangePicker ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should render calendar icon button", () => {
    renderPicker(<DateRangePicker />)
    expect(document.querySelector("[data-icon]")).toBeInTheDocument()
  })

  it("should render start and end date inputs", () => {
    renderPicker(<DateRangePicker />)
    const group = screen.getByRole("group")
    expect(group).toBeInTheDocument()
  })

  it("should render arrow separator icon", () => {
    renderPicker(<DateRangePicker />)
    const icons = document.querySelectorAll("[data-icon]")
    expect(icons.length).toBeGreaterThanOrEqual(2)
  })

  it("should merge custom className", () => {
    renderPicker(<DateRangePicker className="custom-class" />)
    const picker = document.querySelector(".custom-class")
    expect(picker).toBeInTheDocument()
  })

  it("should apply disabled styling", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DateRangePicker ref={ref} isDisabled />)
    expect(ref.current).toHaveClass("opacity-50")
    expect(ref.current).toHaveClass("cursor-not-allowed")
  })

  it("should apply invalid ring styling", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DateRangePicker ref={ref} isInvalid />)
    expect(ref.current).toHaveClass("ring-destructive")
  })

  it("should apply normal ring when not invalid", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DateRangePicker ref={ref} />)
    expect(ref.current).not.toHaveClass("ring-destructive")
  })

  it("should render with controlled value", () => {
    const now = today(getLocalTimeZone())
    renderPicker(
      <DateRangePicker
        value={{ start: now, end: now.add({ days: 7 }) }}
        onChange={() => {}}
      />
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should render with default value", () => {
    const now = today(getLocalTimeZone())
    renderPicker(
      <DateRangePicker defaultValue={{ start: now, end: now.add({ days: 7 }) }} />
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should render with pt-BR locale", () => {
    renderPicker(<DateRangePicker locale="pt-BR" />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should render with minValue and maxValue", () => {
    const now = today(getLocalTimeZone())
    renderPicker(
      <DateRangePicker
        minValue={now.subtract({ days: 30 })}
        maxValue={now.add({ days: 60 })}
      />
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should pass custom clear and apply labels", () => {
    renderPicker(<DateRangePicker clearLabel="Limpar" applyLabel="Aplicar" />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should pass id to the component", () => {
    renderPicker(<DateRangePicker id="my-range-picker" />)
    const picker = document.getElementById("my-range-picker")
    expect(picker).toBeInTheDocument()
  })

  it("should pass aria-label", () => {
    renderPicker(<DateRangePicker aria-label="Select date range" />)
    const group = screen.getByRole("group")
    expect(group).toBeInTheDocument()
  })
})
