import { act } from "react"

import { render, screen } from "@testing-library/react"

import { toast, Toaster } from "@/components/toast"
import { __resetStore } from "@/components/toast/toast"

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    li: "li",
    div: "div",
  },
  useReducedMotion: () => false,
}))

describe("Toast", () => {
  afterEach(() => {
    act(() => {
      __resetStore()
    })
  })

  it("should render a toast with message", () => {
    render(<Toaster />)
    act(() => {
      toast("Hello world")
    })
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("should render correct icon per intent", () => {
    render(<Toaster />)
    act(() => {
      toast.success("Success msg")
    })
    const toastEl = screen.getByText("Success msg").closest("li")
    expect(toastEl?.querySelector("svg")).toBeInTheDocument()
  })

  it("should render action button", () => {
    render(<Toaster />)
    act(() => {
      toast("With action", { action: { label: "Undo" } })
    })
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
  })

  it("should render confirm and deny buttons", () => {
    render(<Toaster />)
    act(() => {
      toast("Confirm?", {
        confirm: { label: "Yes" },
        deny: { label: "No" },
      })
    })
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument()
  })

  it("should render icon buttons", () => {
    render(<Toaster />)
    act(() => {
      toast("Delete?", {
        confirmIcon: { label: "Confirm delete" },
        denyIcon: { label: "Cancel delete" },
      })
    })
    expect(screen.getByLabelText("Confirm delete")).toBeInTheDocument()
    expect(screen.getByLabelText("Cancel delete")).toBeInTheDocument()
  })

  it("should render muted action", () => {
    render(<Toaster />)
    act(() => {
      toast("Done", { mutedAction: { label: "Copy link" } })
    })
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument()
  })

  it("should auto-dismiss after duration", () => {
    vi.useFakeTimers()
    render(<Toaster />)
    act(() => {
      toast("Bye", { duration: 1000 })
    })
    expect(screen.getByText("Bye")).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(screen.queryByText("Bye")).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it("should not auto-dismiss with Infinity duration", () => {
    vi.useFakeTimers()
    render(<Toaster />)
    act(() => {
      toast("Stay", { duration: Infinity })
    })
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(screen.getByText("Stay")).toBeInTheDocument()
    vi.useRealTimers()
  })

  it("should dismiss programmatically", () => {
    render(<Toaster />)
    let id: string
    act(() => {
      id = toast("Dismiss me")
    })
    expect(screen.getByText("Dismiss me")).toBeInTheDocument()
    act(() => {
      toast.dismiss(id!)
    })
    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument()
  })

  it("should update existing toast", () => {
    render(<Toaster />)
    let id: string
    act(() => {
      id = toast("Loading...")
    })
    expect(screen.getByText("Loading...")).toBeInTheDocument()
    act(() => {
      toast.update(id!, { message: "Done!" })
    })
    expect(screen.getByText("Done!")).toBeInTheDocument()
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
  })

  it("should limit to 3 toasts", () => {
    render(<Toaster />)
    act(() => {
      toast("First")
      toast("Second")
      toast("Third")
      toast("Fourth")
    })
    expect(screen.queryByText("First")).not.toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
    expect(screen.getByText("Third")).toBeInTheDocument()
    expect(screen.getByText("Fourth")).toBeInTheDocument()
  })

  it("should disable button when disabled", () => {
    render(<Toaster />)
    act(() => {
      toast("Disabled", {
        disabled: true,
        action: { label: "Click" },
      })
    })
    expect(screen.getByRole("button", { name: "Click" })).toBeDisabled()
  })
})
