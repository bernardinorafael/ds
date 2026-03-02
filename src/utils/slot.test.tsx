import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Slot } from "@/utils/slot"

describe("Slot", () => {
  it("should render the child element with merged props", () => {
    render(
      <Slot data-testid="slot" className="from-slot">
        <button className="from-child">Click</button>
      </Slot>,
    )

    const button = screen.getByTestId("slot")
    expect(button.tagName).toBe("BUTTON")
    expect(button).toHaveTextContent("Click")
    expect(button.className).toContain("from-slot")
    expect(button.className).toContain("from-child")
  })

  it("should forward ref to the child element", () => {
    const ref = createRef<HTMLButtonElement>()

    render(
      <Slot ref={ref}>
        <button>Click</button>
      </Slot>,
    )

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should compose event handlers from both slot and child", async () => {
    const slotClick = vi.fn()
    const childClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Slot onClick={slotClick}>
        <button onClick={childClick}>Click</button>
      </Slot>,
    )

    await user.click(screen.getByRole("button"))

    expect(childClick).toHaveBeenCalledOnce()
    expect(slotClick).toHaveBeenCalledOnce()
  })

  it("should return null when no valid element child is provided", () => {
    const { container } = render(<Slot>plain text</Slot>)
    expect(container.innerHTML).toBe("")
  })
})
