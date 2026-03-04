import { createRef } from "react"

import { getLocalTimeZone, today } from "@internationalized/date"
import { render, screen } from "@testing-library/react"

import { DatePicker } from "@/components/date-picker"
import { Provider } from "@/components/provider"

const renderPicker = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>)

describe("DatePicker", () => {
  it("should render with sr-only label", () => {
    renderPicker(<DatePicker label="Start date" />)
    const label = screen.getByText("Start date")
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass("sr-only")
  })

  it("should render default label when not provided", () => {
    renderPicker(<DatePicker />)
    expect(screen.getByText("Date")).toBeInTheDocument()
  })

  it("should forward ref to group element", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DatePicker ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should render calendar icon button", () => {
    renderPicker(<DatePicker />)
    expect(document.querySelector("[data-icon]")).toBeInTheDocument()
  })

  it("should render date segments", () => {
    renderPicker(<DatePicker />)
    const group = screen.getByRole("group")
    expect(group).toBeInTheDocument()
  })

  it("should merge custom className", () => {
    renderPicker(<DatePicker className="custom-class" />)
    const picker = document.querySelector(".custom-class")
    expect(picker).toBeInTheDocument()
  })

  it("should apply disabled styling", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DatePicker ref={ref} isDisabled />)
    expect(ref.current).toHaveClass("opacity-50")
    expect(ref.current).toHaveClass("cursor-not-allowed")
  })

  it("should apply invalid ring styling", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DatePicker ref={ref} isInvalid />)
    expect(ref.current).toHaveClass("ring-destructive")
  })

  it("should apply normal ring when not invalid", () => {
    const ref = createRef<HTMLDivElement>()
    renderPicker(<DatePicker ref={ref} />)
    expect(ref.current).not.toHaveClass("ring-destructive")
  })

  it("should render with controlled value", () => {
    const now = today(getLocalTimeZone())
    renderPicker(<DatePicker value={now} onChange={() => {}} />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should render with default value", () => {
    const now = today(getLocalTimeZone())
    renderPicker(<DatePicker defaultValue={now} />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should pass id to the component", () => {
    renderPicker(<DatePicker id="my-datepicker" />)
    const picker = document.getElementById("my-datepicker")
    expect(picker).toBeInTheDocument()
  })

  it("should pass aria-label", () => {
    renderPicker(<DatePicker aria-label="Pick a date" />)
    const group = screen.getByRole("group")
    expect(group).toBeInTheDocument()
  })

  it("should render with pt-BR locale", () => {
    renderPicker(<DatePicker locale="pt-BR" />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("should render with minValue and maxValue", () => {
    const now = today(getLocalTimeZone())
    renderPicker(
      <DatePicker
        minValue={now.subtract({ days: 30 })}
        maxValue={now.add({ days: 30 })}
      />
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
  })
})
