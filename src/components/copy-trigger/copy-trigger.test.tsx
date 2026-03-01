import { createRef } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CopyTrigger } from "@/components/copy-trigger"

describe("CopyTrigger", () => {
  let user: ReturnType<typeof userEvent.setup>
  let writeTextSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    user = userEvent.setup()
    writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)
  })

  afterEach(() => {
    writeTextSpy.mockRestore()
  })

  it("should render the trigger element", () => {
    render(
      <CopyTrigger text="hello">
        <button>Copy</button>
      </CopyTrigger>
    )
    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByText("Copy")).toBeInTheDocument()
  })

  it("should forward ref to the trigger", () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <CopyTrigger ref={ref} text="hello">
        <button>Copy</button>
      </CopyTrigger>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("should copy text to clipboard when clicked", async () => {
    render(
      <CopyTrigger text="hello world">
        <button>Copy</button>
      </CopyTrigger>
    )
    await user.click(screen.getByRole("button"))
    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith("hello world")
    })
  })

  it("should call onCopy callback after copying", async () => {
    const onCopy = vi.fn()
    render(
      <CopyTrigger text="test" onCopy={onCopy}>
        <button>Copy</button>
      </CopyTrigger>
    )
    await user.click(screen.getByRole("button"))
    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith("test")
    })
  })

  it("should show default label on hover", async () => {
    render(
      <CopyTrigger text="hello">
        <button>Copy</button>
      </CopyTrigger>
    )
    await user.hover(screen.getByRole("button"))
    await waitFor(() => {
      expect(screen.getAllByText("Copy").length).toBeGreaterThanOrEqual(1)
    })
  })

  it("should show copied label after clicking", async () => {
    render(
      <CopyTrigger text="hello">
        <button>Copy</button>
      </CopyTrigger>
    )
    await user.click(screen.getByRole("button"))
    await waitFor(() => {
      expect(screen.getAllByText("Copied").length).toBeGreaterThanOrEqual(1)
    })
  })

  it("should show custom label when provided", async () => {
    render(
      <CopyTrigger text="hello" label="Copy it">
        <button>Copy</button>
      </CopyTrigger>
    )
    await user.hover(screen.getByRole("button"))
    await waitFor(() => {
      expect(screen.getAllByText("Copy it").length).toBeGreaterThanOrEqual(1)
    })
  })

  it("should show custom copiedLabel after clicking", async () => {
    render(
      <CopyTrigger text="hello" copiedLabel="Done!">
        <button>Copy</button>
      </CopyTrigger>
    )
    await user.click(screen.getByRole("button"))
    await waitFor(() => {
      expect(screen.getAllByText("Done!").length).toBeGreaterThanOrEqual(1)
    })
  })

  it("should have aria-label on the trigger", () => {
    render(
      <CopyTrigger text="hello">
        <button>Copy</button>
      </CopyTrigger>
    )
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy text")
  })
})
