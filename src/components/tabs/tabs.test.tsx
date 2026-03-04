import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tabs } from "@/components/tabs"
import { TooltipProvider } from "@/components/tooltip"

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs defaultValue="one" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="two">Tab Two</Tabs.Trigger>
        <Tabs.Trigger value="three" disabled>
          Tab Three
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">Content One</Tabs.Content>
      <Tabs.Content value="two">Content Two</Tabs.Content>
      <Tabs.Content value="three">Content Three</Tabs.Content>
    </Tabs>
  )
}

describe("Tabs", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render all triggers", () => {
    renderTabs()
    expect(screen.getByRole("tab", { name: "Tab One" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Tab Two" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Tab Three" })).toBeInTheDocument()
  })

  it("should render the tablist", () => {
    renderTabs()
    expect(screen.getByRole("tablist")).toBeInTheDocument()
  })

  it("should show the default tab content", () => {
    renderTabs()
    expect(screen.getByText("Content One")).toBeInTheDocument()
  })

  it("should switch content when a trigger is clicked", async () => {
    renderTabs()
    await user.click(screen.getByRole("tab", { name: "Tab Two" }))
    expect(screen.getByText("Content Two")).toBeInTheDocument()
  })

  it("should call onValueChange when tab changes", async () => {
    const onValueChange = vi.fn()
    renderTabs({ onValueChange })
    await user.click(screen.getByRole("tab", { name: "Tab Two" }))
    expect(onValueChange).toHaveBeenCalledWith("two")
  })

  it("should work in controlled mode", () => {
    render(
      <Tabs value="two">
        <Tabs.List>
          <Tabs.Trigger value="one">Tab One</Tabs.Trigger>
          <Tabs.Trigger value="two">Tab Two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Content One</Tabs.Content>
        <Tabs.Content value="two">Content Two</Tabs.Content>
      </Tabs>
    )
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
      "data-state",
      "active"
    )
    expect(screen.getByText("Content Two")).toBeInTheDocument()
  })

  it("should forward ref to the root element", () => {
    const ref = createRef<HTMLDivElement>()
    renderTabs({ ref })
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should merge custom className on root", () => {
    renderTabs({ className: "custom-root" })
    expect(
      screen.getByRole("tablist").closest("[class*='custom-root']")
    ).toBeInTheDocument()
  })

  it("should disable a trigger when disabled prop is set", () => {
    renderTabs()
    expect(screen.getByRole("tab", { name: "Tab Three" })).toBeDisabled()
  })

  it("should not switch to a disabled trigger on click", async () => {
    renderTabs()
    await user.click(screen.getByRole("tab", { name: "Tab Three" }))
    expect(screen.getByText("Content One")).toBeInTheDocument()
  })

  it("should support keyboard navigation between triggers", async () => {
    renderTabs()
    const tabOne = screen.getByRole("tab", { name: "Tab One" })
    tabOne.focus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveFocus()
  })
})

describe("Tabs.List", () => {
  it("should merge custom className", () => {
    renderTabs()
    const list = screen.getByRole("tablist")
    expect(list).toHaveClass("border-b")
  })

  it("should forward aria-label", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List aria-label="Navigation">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A content</Tabs.Content>
      </Tabs>
    )
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-label", "Navigation")
  })
})

describe("Tabs.Trigger", () => {
  it("should merge custom className", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a" className="custom-trigger">
            A
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A</Tabs.Content>
      </Tabs>
    )
    expect(screen.getByRole("tab", { name: "A" })).toHaveClass("custom-trigger")
  })

  it("should mark the active trigger with data-state active", () => {
    renderTabs()
    expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
      "data-state",
      "active"
    )
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
      "data-state",
      "inactive"
    )
  })

  it("should show tooltip on hover when tooltip prop is set", async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tabs defaultValue="a">
          <Tabs.List>
            <Tabs.Trigger value="a">Active</Tabs.Trigger>
            <Tabs.Trigger value="b" disabled tooltip="Coming soon">
              Disabled
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="a">A</Tabs.Content>
          <Tabs.Content value="b">B</Tabs.Content>
        </Tabs>
      </TooltipProvider>
    )
    await user.hover(screen.getByRole("tab", { name: "Disabled" }))
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Coming soon")
  })
})

describe("Tabs.Content", () => {
  it("should merge custom className", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a" className="custom-content">
          Content
        </Tabs.Content>
      </Tabs>
    )
    expect(screen.getByRole("tabpanel")).toHaveClass("custom-content")
  })

  it("should forward ref to the content panel", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content ref={ref} value="a">
          Content
        </Tabs.Content>
      </Tabs>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
