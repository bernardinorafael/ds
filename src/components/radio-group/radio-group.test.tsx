import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { RadioGroup } from "@/components/radio-group"
import { TooltipProvider } from "@/components/tooltip"

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
]

describe("RadioGroup", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render a radiogroup", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getByRole("radiogroup", { name: "Choices" })).toBeInTheDocument()
  })

  it("should render all radio options", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("should render labels for each option", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getByText("Option A")).toBeInTheDocument()
    expect(screen.getByText("Option B")).toBeInTheDocument()
    expect(screen.getByText("Option C")).toBeInTheDocument()
  })

  it("should forward ref to the root element", () => {
    const ref = createRef<HTMLDivElement>()
    render(<RadioGroup ref={ref} options={OPTIONS} aria-label="Choices" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should merge custom className", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" className="custom" />)
    expect(screen.getByRole("radiogroup")).toHaveClass("custom")
  })

  it("should select defaultValue on mount", () => {
    render(<RadioGroup options={OPTIONS} defaultValue="b" aria-label="Choices" />)
    expect(screen.getByRole("radio", { name: "Option B" })).toBeChecked()
  })

  it("should select an option when clicked", async () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    await user.click(screen.getByRole("radio", { name: "Option A" }))
    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked()
  })

  it("should call onValueChange when selection changes", async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup options={OPTIONS} onValueChange={onValueChange} aria-label="Choices" />,
    )
    await user.click(screen.getByRole("radio", { name: "Option B" }))
    expect(onValueChange).toHaveBeenCalledWith("b")
  })

  it("should support controlled value", () => {
    const { rerender } = render(
      <RadioGroup
        options={OPTIONS}
        value="a"
        onValueChange={() => {}}
        aria-label="Choices"
      />,
    )
    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked()

    rerender(
      <RadioGroup
        options={OPTIONS}
        value="c"
        onValueChange={() => {}}
        aria-label="Choices"
      />,
    )
    expect(screen.getByRole("radio", { name: "Option C" })).toBeChecked()
  })

  it("should disable all options when disabled", () => {
    render(<RadioGroup options={OPTIONS} disabled aria-label="Choices" />)
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled()
    })
  })

  it("should disable individual options", () => {
    const options = [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B", disabled: true },
    ]
    render(<RadioGroup options={options} aria-label="Choices" />)
    expect(screen.getByRole("radio", { name: "Option A" })).not.toBeDisabled()
    expect(screen.getByRole("radio", { name: "Option B" })).toBeDisabled()
  })

  it("should render description when provided", () => {
    const options = [
      { value: "a", label: "Option A", description: "First option details" },
    ]
    render(<RadioGroup options={options} aria-label="Choices" />)
    expect(screen.getByText("First option details")).toBeInTheDocument()
  })

  it("should render badge when badgeProps provided", () => {
    const options = [
      {
        value: "a",
        label: "Option A",
        badgeProps: { children: "Pro" as React.ReactNode },
      },
    ]
    render(<RadioGroup options={options} aria-label="Choices" />)
    expect(screen.getByText("Pro")).toBeInTheDocument()
  })

  it("should apply sm size variant by default", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getAllByRole("radio")[0]).toHaveClass("size-4")
  })

  it("should apply md size variant", () => {
    render(<RadioGroup options={OPTIONS} size="md" aria-label="Choices" />)
    expect(screen.getAllByRole("radio")[0]).toHaveClass("size-5")
  })

  it("should set required attribute", () => {
    render(<RadioGroup options={OPTIONS} required aria-label="Choices" />)
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true")
  })

  it("should set aria-invalid when provided", () => {
    render(<RadioGroup options={OPTIONS} aria-invalid={true} aria-label="Choices" />)
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true")
  })

  it("should support aria-labelledby", () => {
    render(
      <>
        <span id="label-id">Choices</span>
        <RadioGroup options={OPTIONS} aria-labelledby="label-id" />
      </>,
    )
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-labelledby", "label-id")
  })

  it("should support aria-describedby", () => {
    render(
      <RadioGroup options={OPTIONS} aria-describedby="help-text" aria-label="Choices" />,
    )
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-describedby", "help-text")
  })

  it("should navigate with keyboard", async () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    const firstRadio = screen.getByRole("radio", { name: "Option A" })
    firstRadio.focus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveFocus()
  })

  it("should render tooltip when tooltip is provided", async () => {
    const options = [
      {
        value: "a",
        label: "Option A",
        disabled: true,
        tooltip: "This option is unavailable",
      },
    ]
    render(
      <TooltipProvider>
        <RadioGroup options={options} aria-label="Choices" />
      </TooltipProvider>,
    )
    await user.hover(screen.getByText("Option A"))
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "This option is unavailable",
    )
  })
})
