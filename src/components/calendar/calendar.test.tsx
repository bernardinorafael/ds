import { createRef } from "react"

import { getLocalTimeZone, today } from "@internationalized/date"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "@/components/calendar"

describe("Calendar", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render with header and grid", () => {
    render(
      <Calendar>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(screen.getByRole("heading")).toBeInTheDocument()
    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("should forward ref to wrapper div", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Calendar ref={ref}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should merge custom className", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Calendar ref={ref} className="custom-class">
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(ref.current).toHaveClass("custom-class")
  })

  it("should render navigation buttons", () => {
    render(
      <Calendar>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument()
    expect(screen.getByLabelText("Next month")).toBeInTheDocument()
  })

  it("should render weekday header cells", () => {
    const { container } = render(
      <Calendar>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    const headerCells = container.querySelectorAll("th")
    expect(headerCells).toHaveLength(7)
  })

  it("should render day cells", () => {
    render(
      <Calendar>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    const cells = screen.getAllByRole("gridcell")
    expect(cells.length).toBeGreaterThan(0)
  })

  it("should call onChange when a day is clicked in single mode", async () => {
    const onChange = vi.fn()
    const now = today(getLocalTimeZone())
    render(
      <Calendar onChange={onChange} defaultValue={now}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    const buttons = screen.getAllByRole("button")
    const dayButton = buttons.find(
      (btn) => btn.textContent === "15" && !btn.closest("[data-outside-month]")
    )
    if (dayButton) {
      await user.click(dayButton)
      expect(onChange).toHaveBeenCalled()
    }
  })

  it("should render in range mode", () => {
    render(
      <Calendar mode="range">
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("should render with pt-BR locale", () => {
    render(
      <Calendar locale="pt-BR">
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(screen.getByRole("heading")).toBeInTheDocument()
  })

  it("should render month heading text", () => {
    render(
      <Calendar>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    const heading = screen.getByRole("heading")
    expect(heading.textContent).toBeTruthy()
  })

  it("should apply disabled state", () => {
    render(
      <Calendar isDisabled>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    const grid = screen.getByRole("grid")
    expect(grid).toHaveAttribute("aria-disabled", "true")
  })

  it("should render with minValue and maxValue", () => {
    const now = today(getLocalTimeZone())
    render(
      <Calendar minValue={now.subtract({ days: 5 })} maxValue={now.add({ days: 5 })}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    )
    expect(screen.getByRole("grid")).toBeInTheDocument()
  })

  it("should support visibleDuration for multiple months", () => {
    render(
      <Calendar visibleDuration={{ months: 2 }}>
        <Calendar.Header />
        <Calendar.Grid />
        <Calendar.Grid offset={{ months: 1 }} />
      </Calendar>
    )
    const grids = screen.getAllByRole("grid")
    expect(grids).toHaveLength(2)
  })

  it("should throw when compound components are used outside Calendar", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Calendar.Grid />)).toThrow(
      "Calendar compound components must be used within <Calendar>"
    )
    consoleSpy.mockRestore()
  })
})
