import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { IconSprite } from "@/components/icon"

import { Dropdown } from "./dropdown"

function renderWithSprite(ui: React.ReactNode) {
  return render(
    <>
      <IconSprite />
      {ui}
    </>
  )
}

describe("Dropdown", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render trigger", () => {
    renderWithSprite(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument()
  })

  it("should forward ref to content", async () => {
    const ref = createRef<HTMLDivElement>()
    renderWithSprite(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content ref={ref}>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should render items when opened", async () => {
    renderWithSprite(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument()
  })

  it("should call onSelect when item clicked", async () => {
    const onSelect = vi.fn()
    renderWithSprite(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    await user.click(screen.getByRole("menuitem", { name: "Edit" }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it("should render checkbox items with checked state", async () => {
    renderWithSprite(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem checked>Status</Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown>
    )
    const checkbox = screen.getByRole("menuitemcheckbox", { name: "Status" })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("aria-checked", "true")
  })

  it("should render separator", async () => {
    renderWithSprite(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
    expect(screen.getByRole("separator")).toBeInTheDocument()
  })

  it("should render group label", async () => {
    renderWithSprite(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Actions</Dropdown.Label>
            <Dropdown.Item>Edit</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    )
    expect(screen.getByText("Actions")).toBeInTheDocument()
  })

  it("should apply destructive styling", async () => {
    renderWithSprite(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item destructive>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveClass("text-destructive")
  })
})
