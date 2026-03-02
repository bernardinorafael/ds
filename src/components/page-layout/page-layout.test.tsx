import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { PageLayout } from "@/components/page-layout"

describe("PageLayout", () => {
  it("should render as an article element", () => {
    const { container } = render(<PageLayout>Content</PageLayout>)
    expect(container.querySelector("article")).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLElement>()
    render(<PageLayout ref={ref}>Content</PageLayout>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("ARTICLE")
  })

  it("should merge custom className", () => {
    const { container } = render(<PageLayout className="w-full">Content</PageLayout>)
    expect(container.querySelector("article")).toHaveClass("w-full")
  })

  it("should render title as h2", () => {
    render(<PageLayout title="Users">Content</PageLayout>)
    expect(screen.getByRole("heading", { level: 2, name: "Users" })).toBeInTheDocument()
  })

  it("should render description", () => {
    render(
      <PageLayout title="Users" description="Manage your team">
        Content
      </PageLayout>
    )
    expect(screen.getByText("Manage your team")).toBeInTheDocument()
  })

  it("should render titleBadge inline with title", () => {
    render(
      <PageLayout title="Users" titleBadge={<span data-testid="title-badge">Pro</span>}>
        Content
      </PageLayout>
    )
    expect(screen.getByTestId("title-badge")).toBeInTheDocument()
  })

  it("should render actions", () => {
    render(
      <PageLayout title="Users" actions={<button>Add User</button>}>
        Content
      </PageLayout>
    )
    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument()
  })

  it("should render backAction", () => {
    render(
      <PageLayout title="Users" backAction={<button>Back</button>}>
        Content
      </PageLayout>
    )
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
  })

  it("should render badges with vertical dividers", () => {
    const { container } = render(
      <PageLayout
        title="Users"
        badges={
          <>
            <span>Active: 5</span>
            <span>Inactive: 2</span>
          </>
        }
      >
        Content
      </PageLayout>
    )
    const dividers = container.querySelectorAll("[role='separator']")
    expect(dividers).toHaveLength(1)
  })

  it("should render afterDescription", () => {
    render(
      <PageLayout title="Users" afterDescription={<span>Extra info</span>}>
        Content
      </PageLayout>
    )
    expect(screen.getByText("Extra info")).toBeInTheDocument()
  })

  it("should not render header when no title or description", () => {
    const { container } = render(<PageLayout>Content</PageLayout>)
    expect(container.querySelector("header")).not.toBeInTheDocument()
  })

  it("should render body with data-page-layout-body attribute", () => {
    const { container } = render(<PageLayout>Content</PageLayout>)
    expect(container.querySelector("[data-page-layout-body]")).toBeInTheDocument()
    expect(container.querySelector("[data-page-layout-body]")).toHaveTextContent("Content")
  })

  it("should add border-l divider between description and badges", () => {
    const { container } = render(
      <PageLayout
        title="Users"
        description="Manage your team"
        badges={<span>Active</span>}
      >
        Content
      </PageLayout>
    )
    const badgeContainer = container.querySelector(".border-l")
    expect(badgeContainer).toBeInTheDocument()
  })
})
