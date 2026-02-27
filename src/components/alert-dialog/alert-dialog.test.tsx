import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AlertDialog } from "@/components/alert-dialog"
import { Button } from "@/components/button"

describe("AlertDialog", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render the trigger", () => {
    render(
      <AlertDialog trigger={<Button>Delete</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header title="Title" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("should open the alert dialog when trigger is clicked", async () => {
    render(
      <AlertDialog trigger={<Button>Delete</Button>}>
        <AlertDialog.Content>
          <AlertDialog.Header title="Confirm deletion" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Confirm deletion")).toBeInTheDocument()
  })

  it("should render in controlled open state", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="Controlled" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
  })

  it("should call onOpenChange when opened", async () => {
    const onOpenChange = vi.fn()
    render(
      <AlertDialog trigger={<Button>Open</Button>} onOpenChange={onOpenChange}>
        <AlertDialog.Content>
          <AlertDialog.Header title="Title" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})

describe("AlertDialog.Header", () => {
  it("should render title", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="Alert Title" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByText("Alert Title")).toBeInTheDocument()
  })

  it("should render description when provided", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="Title" description="A description" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByText("A description")).toBeInTheDocument()
  })

  it("should not render description when not provided", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="Title" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(document.querySelector("[data-alert-dialog-header] p")).not.toBeInTheDocument()
  })

  it("should apply border when hasBorder is true", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="Title" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(document.querySelector("[data-alert-dialog-header]")).toHaveClass("border-b")
  })
})

describe("AlertDialog.Content", () => {
  it("should render children", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <p>Content here</p>
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByText("Content here")).toBeInTheDocument()
  })

  it("should merge custom className", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content className="custom-class">
          <AlertDialog.Header title="T" />
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(document.querySelector("[data-alert-dialog-content]")).toHaveClass(
      "custom-class"
    )
  })
})

describe("AlertDialog.Section", () => {
  it("should render children", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
          <AlertDialog.Section>
            <p>Section content</p>
          </AlertDialog.Section>
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByText("Section content")).toBeInTheDocument()
  })
})

describe("AlertDialog.Footer", () => {
  it("should render children", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <Button>Save</Button>
        </AlertDialog.Footer>
      </AlertDialog>
    )
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })
})

describe("AlertDialog.Action", () => {
  it("should render as a danger button", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Action>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog>
    )
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })
})

describe("AlertDialog.Cancel", () => {
  it("should render with default Cancel text", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel />
        </AlertDialog.Footer>
      </AlertDialog>
    )
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should close the alert dialog when clicked", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <AlertDialog open onOpenChange={onOpenChange}>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
        </AlertDialog.Content>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Go back</AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog>
    )
    await user.click(screen.getByRole("button", { name: "Go back" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

describe("AlertDialog.Notice", () => {
  it("should render children", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
          <AlertDialog.Section>
            <AlertDialog.Notice>Warning message</AlertDialog.Notice>
          </AlertDialog.Section>
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(screen.getByText("Warning message")).toBeInTheDocument()
  })

  it("should have data-alert-dialog-notice attribute", () => {
    render(
      <AlertDialog open>
        <AlertDialog.Content>
          <AlertDialog.Header title="T" />
          <AlertDialog.Section>
            <AlertDialog.Notice intent="danger">Alert</AlertDialog.Notice>
          </AlertDialog.Section>
        </AlertDialog.Content>
      </AlertDialog>
    )
    expect(document.querySelector("[data-alert-dialog-notice]")).toBeInTheDocument()
  })
})
