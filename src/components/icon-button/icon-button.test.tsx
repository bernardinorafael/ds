import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { IconSprite } from "@/components/icon"
import { TooltipProvider } from "@/components/tooltip"

import { IconButton } from "./icon-button"

function setup(ui: React.ReactElement) {
  return render(
    <>
      <IconSprite />
      {ui}
    </>
  )
}

describe("IconButton", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render with aria-label", () => {
    setup(<IconButton icon="trash" aria-label="Delete" />)
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("should forward ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>()
    setup(<IconButton ref={ref} icon="trash" aria-label="Delete" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should apply custom className", () => {
    setup(<IconButton icon="trash" aria-label="Delete" className="custom-class" />)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })

  it("should be disabled when disabled prop is set", () => {
    setup(<IconButton icon="trash" aria-label="Delete" disabled />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("should call onClick when clicked", async () => {
    const onClick = vi.fn()
    setup(<IconButton icon="trash" aria-label="Delete" onClick={onClick} />)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("should not call onClick when disabled", async () => {
    const onClick = vi.fn()
    setup(<IconButton icon="trash" aria-label="Delete" disabled onClick={onClick} />)
    await user.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("should render tooltip when tooltip prop is provided", async () => {
    setup(
      <TooltipProvider>
        <IconButton icon="trash" aria-label="Delete" tooltip="Delete item" />
      </TooltipProvider>
    )
    await user.hover(screen.getByRole("button"))
    expect(
      await screen.findByRole("tooltip", { name: "Delete item" })
    ).toBeInTheDocument()
  })

  it("should render without tooltip when tooltip prop is omitted", () => {
    setup(<IconButton icon="trash" aria-label="Delete" />)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })
})
