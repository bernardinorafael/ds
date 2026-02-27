import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"

describe("Dialog", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render the trigger", () => {
    render(
      <Dialog trigger={<Button>Open</Button>}>
        <Dialog.Content>
          <Dialog.Header title="Title" />
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument()
  })

  it("should open the dialog when trigger is clicked", async () => {
    render(
      <Dialog trigger={<Button>Open</Button>}>
        <Dialog.Content>
          <Dialog.Header title="My Dialog" />
        </Dialog.Content>
      </Dialog>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("My Dialog")).toBeInTheDocument()
  })

  it("should render in controlled open state", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="Controlled" />
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should forward ref to the panel", async () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Dialog ref={ref} open>
        <Dialog.Content>
          <Dialog.Header title="Ref test" />
        </Dialog.Content>
      </Dialog>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should call onOpenChange when opened", async () => {
    const onOpenChange = vi.fn()
    render(
      <Dialog trigger={<Button>Open</Button>} onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Header title="Title" />
        </Dialog.Content>
      </Dialog>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})

describe("Dialog.Header", () => {
  it("should render title", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="Dialog Title" />
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByText("Dialog Title")).toBeInTheDocument()
  })

  it("should render description when provided", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="Title" description="A description" />
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByText("A description")).toBeInTheDocument()
  })

  it("should not render description when not provided", () => {
    const { container } = render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="Title" />
        </Dialog.Content>
      </Dialog>
    )
    expect(container.querySelector("[data-dialog-header] p")).not.toBeInTheDocument()
  })

  it("should apply border when hasBorder is true", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="Title" />
        </Dialog.Content>
      </Dialog>
    )
    expect(document.querySelector("[data-dialog-header]")).toHaveClass("border-b")
  })
})

describe("Dialog.Content", () => {
  it("should render children", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <p>Content here</p>
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByText("Content here")).toBeInTheDocument()
  })

  it("should merge custom className", () => {
    render(
      <Dialog open>
        <Dialog.Content className="custom-class">
          <Dialog.Header title="T" />
          <p>Content</p>
        </Dialog.Content>
      </Dialog>
    )
    expect(document.querySelector("[data-dialog-content]")).toHaveClass("custom-class")
  })
})

describe("Dialog.Section", () => {
  it("should render children", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="T" />
          <Dialog.Section>
            <p>Section content</p>
          </Dialog.Section>
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByText("Section content")).toBeInTheDocument()
  })
})

describe("Dialog.Footer", () => {
  it("should render children", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="T" />
        </Dialog.Content>
        <Dialog.Footer>
          <Button>Save</Button>
        </Dialog.Footer>
      </Dialog>
    )
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })
})

describe("Dialog.Close", () => {
  it("should close the dialog when clicked", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Header title="T" />
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Footer>
      </Dialog>
    )
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

describe("Dialog.Notice", () => {
  it("should render children", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="T" />
          <Dialog.Section>
            <Dialog.Notice>Warning message</Dialog.Notice>
          </Dialog.Section>
        </Dialog.Content>
      </Dialog>
    )
    expect(screen.getByText("Warning message")).toBeInTheDocument()
  })

  it("should have data-dialog-notice attribute", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="T" />
          <Dialog.Section>
            <Dialog.Notice intent="danger">Alert</Dialog.Notice>
          </Dialog.Section>
        </Dialog.Content>
      </Dialog>
    )
    expect(document.querySelector("[data-dialog-notice]")).toBeInTheDocument()
  })
})
