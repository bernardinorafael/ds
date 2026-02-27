import { createRef } from "react"

import { render, screen, waitFor } from "@testing-library/react"

import { Card } from "@/components/card"

describe("Card", () => {
  it("should render as a section element", () => {
    const { container } = render(<Card>Content</Card>)
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveTextContent("Content")
  })

  it("should forward ref to the section element", () => {
    const ref = createRef<HTMLElement>()
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("SECTION")
  })

  it("should apply soft background by default", () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector("section")).toHaveClass("bg-surface-100")
  })

  it("should apply intense background", () => {
    const { container } = render(<Card background="intense">Content</Card>)
    expect(container.querySelector("section")).toHaveClass("bg-surface-50")
  })

  it("should merge custom className", () => {
    const { container } = render(<Card className="w-96">Content</Card>)
    expect(container.querySelector("section")).toHaveClass("w-96")
  })
})

describe("Card.Header", () => {
  it("should render children", () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
      </Card>
    )
    expect(screen.getByText("Header content")).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLElement>()
    render(
      <Card>
        <Card.Header ref={ref}>Header</Card.Header>
      </Card>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("HEADER")
  })

  it("should have data-card-header attribute", () => {
    const ref = createRef<HTMLElement>()
    render(
      <Card>
        <Card.Header ref={ref}>Header</Card.Header>
      </Card>
    )
    expect(ref.current).toHaveAttribute("data-card-header")
  })
})

describe("Card.Title", () => {
  it("should render as an h2 element", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>My title</Card.Title>
        </Card.Header>
      </Card>
    )
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("My title")
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <Card>
        <Card.Header>
          <Card.Title ref={ref}>Title</Card.Title>
        </Card.Header>
      </Card>
    )
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })

  it("should have data-card-title attribute", () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <Card>
        <Card.Header>
          <Card.Title ref={ref}>Title</Card.Title>
        </Card.Header>
      </Card>
    )
    expect(ref.current).toHaveAttribute("data-card-title")
  })
})

describe("Card.Description", () => {
  it("should render as a p element", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Description>Some description</Card.Description>
        </Card.Header>
      </Card>
    )
    const el = screen.getByText("Some description")
    expect(el.tagName).toBe("P")
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLParagraphElement>()
    render(
      <Card>
        <Card.Header>
          <Card.Description ref={ref}>Description</Card.Description>
        </Card.Header>
      </Card>
    )
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  it("should have data-card-description attribute", () => {
    const ref = createRef<HTMLParagraphElement>()
    render(
      <Card>
        <Card.Header>
          <Card.Description ref={ref}>Description</Card.Description>
        </Card.Header>
      </Card>
    )
    expect(ref.current).toHaveAttribute("data-card-description")
  })
})

describe("Card.Actions", () => {
  it("should render children", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Actions>
            <button>Edit</button>
          </Card.Actions>
        </Card.Header>
      </Card>
    )
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Card.Header>
          <Card.Actions ref={ref}>
            <button>Edit</button>
          </Card.Actions>
        </Card.Header>
      </Card>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should have data-card-actions attribute", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Card.Header>
          <Card.Actions ref={ref}>
            <button>Edit</button>
          </Card.Actions>
        </Card.Header>
      </Card>
    )
    expect(ref.current).toHaveAttribute("data-card-actions")
  })
})

describe("Card.Body", () => {
  it("should render children when open", () => {
    render(
      <Card>
        <Card.Body open>Body content</Card.Body>
      </Card>
    )
    expect(screen.getByText("Body content")).toBeInTheDocument()
  })

  it("should be open by default", () => {
    render(
      <Card>
        <Card.Body>Default open content</Card.Body>
      </Card>
    )
    expect(screen.getByText("Default open content")).toBeInTheDocument()
  })

  it("should hide content when open is false", async () => {
    render(
      <Card>
        <Card.Body open={false}>Hidden content</Card.Body>
      </Card>
    )
    await waitFor(() => {
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument()
    })
  })

  it("should merge custom className on inner container", () => {
    const { container } = render(
      <Card>
        <Card.Body className="custom-class">Content</Card.Body>
      </Card>
    )
    expect(container.querySelector(".custom-class")).toBeInTheDocument()
  })
})

describe("Card.Row", () => {
  it("should render children", () => {
    render(
      <Card>
        <Card.Body>
          <Card.Row>Row content</Card.Row>
        </Card.Body>
      </Card>
    )
    expect(screen.getByText("Row content")).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Card.Body>
          <Card.Row ref={ref}>Row</Card.Row>
        </Card.Body>
      </Card>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should have data-card-row attribute", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Card.Body>
          <Card.Row ref={ref}>Row</Card.Row>
        </Card.Body>
      </Card>
    )
    expect(ref.current).toHaveAttribute("data-card-row")
  })
})

describe("Card.Footer", () => {
  it("should render children when open", () => {
    render(
      <Card>
        <Card.Footer open>Footer content</Card.Footer>
      </Card>
    )
    expect(screen.getByText("Footer content")).toBeInTheDocument()
  })

  it("should be open by default", () => {
    render(
      <Card>
        <Card.Footer>Default footer</Card.Footer>
      </Card>
    )
    expect(screen.getByText("Default footer")).toBeInTheDocument()
  })

  it("should hide content when open is false", async () => {
    render(
      <Card>
        <Card.Footer open={false}>Hidden footer</Card.Footer>
      </Card>
    )
    await waitFor(() => {
      expect(screen.queryByText("Hidden footer")).not.toBeInTheDocument()
    })
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Card.Footer ref={ref}>Footer</Card.Footer>
      </Card>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })
})
