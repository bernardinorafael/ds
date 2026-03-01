import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/button"
import { Sheet } from "@/components/sheet"

describe("Sheet", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render the trigger", () => {
    render(
      <Sheet trigger={<Button>Open</Button>}>
        <Sheet.Content>
          <Sheet.Header title="Title" />
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument()
  })

  it("should open the sheet when trigger is clicked", async () => {
    render(
      <Sheet trigger={<Button>Open</Button>}>
        <Sheet.Content>
          <Sheet.Header title="My Sheet" />
        </Sheet.Content>
      </Sheet>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("My Sheet")).toBeInTheDocument()
  })

  it("should render in controlled open state", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="Controlled" />
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should forward ref to the panel", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Sheet ref={ref} open>
        <Sheet.Content>
          <Sheet.Header title="Ref test" />
        </Sheet.Content>
      </Sheet>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should call onOpenChange when opened", async () => {
    const onOpenChange = vi.fn()
    render(
      <Sheet trigger={<Button>Open</Button>} onOpenChange={onOpenChange}>
        <Sheet.Content>
          <Sheet.Header title="Title" />
        </Sheet.Content>
      </Sheet>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})

describe("Sheet.Header", () => {
  it("should render title", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="Sheet Title" />
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByText("Sheet Title")).toBeInTheDocument()
  })

  it("should render description when provided", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="Title" description="A description" />
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByText("A description")).toBeInTheDocument()
  })

  it("should not render description when not provided", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="Title" />
        </Sheet.Content>
      </Sheet>
    )
    expect(document.querySelector("[data-sheet-header] p")).not.toBeInTheDocument()
  })

  it("should render close button", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="Title" />
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("should close the sheet when close button is clicked", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <Sheet.Content>
          <Sheet.Header title="Title" />
        </Sheet.Content>
      </Sheet>
    )
    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("should apply border when hasBorder is true", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="Title" />
        </Sheet.Content>
      </Sheet>
    )
    expect(document.querySelector("[data-sheet-header]")).toHaveClass("border-b")
  })
})

describe("Sheet.Content", () => {
  it("should render children", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <p>Content here</p>
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByText("Content here")).toBeInTheDocument()
  })

  it("should merge custom className", () => {
    render(
      <Sheet open>
        <Sheet.Content className="custom-class">
          <Sheet.Header title="T" />
        </Sheet.Content>
      </Sheet>
    )
    expect(document.querySelector("[data-sheet-content]")).toHaveClass("custom-class")
  })
})

describe("Sheet.Section", () => {
  it("should render children", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="T" />
          <Sheet.Section>
            <p>Section content</p>
          </Sheet.Section>
        </Sheet.Content>
      </Sheet>
    )
    expect(screen.getByText("Section content")).toBeInTheDocument()
  })
})

describe("Sheet.Footer", () => {
  it("should render children", () => {
    render(
      <Sheet open>
        <Sheet.Content>
          <Sheet.Header title="T" />
        </Sheet.Content>
        <Sheet.Footer>
          <Button>Save</Button>
        </Sheet.Footer>
      </Sheet>
    )
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })
})

describe("Sheet.Close", () => {
  it("should close the sheet when clicked", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <Sheet.Content>
          <Sheet.Header title="T" />
        </Sheet.Content>
        <Sheet.Footer>
          <Sheet.Close>Cancel</Sheet.Close>
        </Sheet.Footer>
      </Sheet>
    )
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
