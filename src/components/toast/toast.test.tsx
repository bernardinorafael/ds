import { act, fireEvent, render, screen } from "@testing-library/react"

import { toast, Toaster } from "@/components/toast"

// Polyfill for Radix Toast in jsdom
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}

// Mock motion/react to bypass animations in tests
vi.mock("motion/react", async () => {
  const React = await import("react")

  const motionKeys = new Set([
    "initial",
    "animate",
    "exit",
    "transition",
    "layout",
    "onAnimationComplete",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileDrag",
    "whileInView",
    "variants",
    "custom",
  ])

  function createMotionComponent(tag: string) {
    return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<Element>) => {
      const filtered: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(props)) {
        if (!motionKeys.has(key)) filtered[key] = value
      }
      return React.createElement(tag, { ...filtered, ref })
    })
  }

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      li: createMotionComponent("li"),
      div: createMotionComponent("div"),
    },
  }
})

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    toast.dismissAll()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should render toast with message", () => {
    render(<Toaster />)
    act(() => toast.info("Hello world"))
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("should render action button when action is provided", () => {
    render(<Toaster />)
    act(() => toast.info("Saved", { action: { label: "Undo" } }))
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
  })

  it("should call action onClick and dismiss toast on click", () => {
    const onClick = vi.fn()
    render(<Toaster />)
    act(() => toast.info("Saved", { action: { label: "Undo", onClick } }))
    fireEvent.click(screen.getByRole("button", { name: "Undo" }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByText("Saved")).not.toBeInTheDocument()
  })

  it("should render cancel button when cancel is provided", () => {
    render(<Toaster />)
    act(() =>
      toast.warning("Delete?", {
        duration: Infinity,
        cancel: { label: "Cancel" },
      })
    )
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should call cancel onClick and dismiss toast on click", () => {
    const onClick = vi.fn()
    render(<Toaster />)
    act(() =>
      toast.warning("Delete?", {
        duration: Infinity,
        cancel: { label: "Cancel", onClick },
      })
    )
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByText("Delete?")).not.toBeInTheDocument()
  })

  it("should auto-dismiss after default duration", () => {
    render(<Toaster />)
    act(() => toast.info("Temporary"))
    expect(screen.getByText("Temporary")).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByText("Temporary")).not.toBeInTheDocument()
  })

  it("should auto-dismiss after custom duration", () => {
    render(<Toaster />)
    act(() => toast.info("Custom", { duration: 5000 }))
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText("Custom")).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByText("Custom")).not.toBeInTheDocument()
  })

  it("should not auto-dismiss when duration is Infinity", () => {
    render(<Toaster />)
    act(() => toast.info("Sticky", { duration: Infinity }))
    act(() => vi.advanceTimersByTime(60_000))
    expect(screen.getByText("Sticky")).toBeInTheDocument()
  })

  it("should dismiss a specific toast with toast.dismiss()", () => {
    render(<Toaster />)
    let id = ""
    act(() => {
      id = toast.info("First", { duration: Infinity })
      toast.success("Second", { duration: Infinity })
    })
    act(() => toast.dismiss(id))
    expect(screen.queryByText("First")).not.toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
  })

  it("should dismiss all toasts with toast.dismissAll()", () => {
    render(<Toaster />)
    act(() => {
      toast.info("One", { duration: Infinity })
      toast.success("Two", { duration: Infinity })
    })
    act(() => toast.dismissAll())
    expect(screen.queryByText("One")).not.toBeInTheDocument()
    expect(screen.queryByText("Two")).not.toBeInTheDocument()
  })

  it("should return toast data with toast.get()", () => {
    let id = ""
    act(() => {
      id = toast.success("Found it")
    })
    const item = toast.get(id)
    expect(item).toBeDefined()
    expect(item?.message).toBe("Found it")
    expect(item?.intent).toBe("success")
  })

  it("should update existing toast when same id is used", () => {
    render(<Toaster />)
    act(() => toast.warning("Draft", { id: "my-toast", duration: Infinity }))
    expect(screen.getByText("Draft")).toBeInTheDocument()
    act(() => toast.success("Published", { id: "my-toast", duration: Infinity }))
    expect(screen.queryByText("Draft")).not.toBeInTheDocument()
    expect(screen.getByText("Published")).toBeInTheDocument()
  })

  it("should evict oldest toast when exceeding limit of 3", () => {
    render(<Toaster />)
    act(() => {
      toast.info("Toast 1", { duration: Infinity })
      toast.info("Toast 2", { duration: Infinity })
      toast.info("Toast 3", { duration: Infinity })
    })
    expect(screen.getByText("Toast 1")).toBeInTheDocument()
    act(() => toast.info("Toast 4", { duration: Infinity }))
    expect(screen.queryByText("Toast 1")).not.toBeInTheDocument()
    expect(screen.getByText("Toast 4")).toBeInTheDocument()
  })

  it("should render all four intents", () => {
    render(<Toaster />)
    act(() => {
      toast.info("Info msg", { duration: Infinity })
      toast.success("Success msg", { duration: Infinity })
      toast.error("Error msg", { duration: Infinity })
    })
    expect(screen.getByText("Info msg")).toBeInTheDocument()
    expect(screen.getByText("Success msg")).toBeInTheDocument()
    expect(screen.getByText("Error msg")).toBeInTheDocument()
  })
})
