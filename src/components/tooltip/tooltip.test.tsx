import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tooltip, TooltipProvider } from "@/components/tooltip"

function renderTooltip(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
  return render(
    <TooltipProvider>
      <Tooltip label="Tooltip text" {...props}>
        <button>Trigger</button>
      </Tooltip>
    </TooltipProvider>
  )
}

describe("Tooltip", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render the trigger", () => {
    renderTooltip()
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument()
  })

  it("should not show the tooltip by default", () => {
    renderTooltip()
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("should show the tooltip when open is true", () => {
    renderTooltip({ open: true })
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text")
  })

  it("should show the tooltip when defaultOpen is true", () => {
    renderTooltip({ defaultOpen: true })
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text")
  })

  it("should show the tooltip on hover", async () => {
    renderTooltip({ delayDuration: 0 })
    await user.hover(screen.getByRole("button"))
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Tooltip text")
  })

  it("should call onOpenChange when state changes", async () => {
    const onOpenChange = vi.fn()
    renderTooltip({ onOpenChange, delayDuration: 0 })
    await user.hover(screen.getByRole("button"))
    await vi.waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  it("should set aria-describedby on the trigger when open", () => {
    renderTooltip({ open: true })
    expect(screen.getByRole("button")).toHaveAttribute("aria-describedby")
  })

  it("should render ReactNode as label", () => {
    renderTooltip({ open: true, label: <em>Emphasis</em> })
    const tooltip = screen.getByRole("tooltip")
    expect(tooltip.querySelector("em")).toHaveTextContent("Emphasis")
  })
})

describe("TooltipProvider", () => {
  it("should render children", () => {
    render(
      <TooltipProvider>
        <span>Child content</span>
      </TooltipProvider>
    )
    expect(screen.getByText("Child content")).toBeInTheDocument()
  })
})
