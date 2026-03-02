# PageLayout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a `PageLayout` component that provides a consistent page header (title, description, badges, actions, back navigation) with a full-width divider and body area.

**Architecture:** Flat props-based component (not compound). Uses `<article>` root, `<header>` for the top section, `<h2>` for the title. Body div tagged with `data-page-layout-body` for future sidebar integration.

**Tech Stack:** React 19, forwardRef, cn() utility, Tailwind CSS v4

---

### Task 1: Create PageLayout component

**Files:**
- Create: `src/components/page-layout/page-layout.tsx`
- Create: `src/components/page-layout/index.ts`

**Step 1: Write the component**

Create `src/components/page-layout/page-layout.tsx`:

```tsx
import React from "react"

import { cn } from "@/utils/cn"

type PageLayoutProps = Pick<
  React.ComponentProps<"article">,
  "id" | "aria-label" | "className"
> & {
  /** Page title rendered as an h2 */
  title?: React.ReactNode
  /** Badge displayed inline with the title */
  titleBadge?: React.ReactNode
  /** Page description rendered below the title */
  description?: React.ReactNode
  /** Metadata badges next to description, separated by vertical dividers */
  badges?: React.ReactNode
  /** Content rendered below description */
  afterDescription?: React.ReactNode
  /** Action buttons aligned to the right of the header */
  actions?: React.ReactNode
  /** Slot for back navigation (router-agnostic) */
  backAction?: React.ReactNode
  /** Page body content */
  children?: React.ReactNode
}

const PageLayout = React.forwardRef<HTMLElement, PageLayoutProps>(
  (
    {
      className,
      title,
      titleBadge,
      description,
      badges,
      afterDescription,
      actions,
      backAction,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const hasHeader = title || description

    return (
      <article
        ref={forwardedRef}
        className={cn("group h-full space-y-8", className)}
        {...props}
      >
        {hasHeader && (
          <header className="relative flex w-full flex-col gap-4 pb-6">
            {backAction && <div className="mb-2">{backAction}</div>}

            <div className="flex items-center gap-4">
              <div className="flex w-full items-end justify-between gap-4">
                <div className={cn("flex flex-col", titleBadge ? "gap-2" : "gap-0.5")}>
                  {title && (
                    <div className={cn(titleBadge && "flex items-center gap-2")}>
                      <h2 className="truncate text-2xl font-medium tracking-tight [&+*]:shrink-0">
                        {title}
                      </h2>
                      {titleBadge && <span>{titleBadge}</span>}
                    </div>
                  )}

                  {(description || badges) && (
                    <div className="flex gap-2">
                      {description && (
                        <div className="text-word-secondary">{description}</div>
                      )}

                      {badges && (
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            description && "border-l border-gray-400 pl-2"
                          )}
                        >
                          {React.Children.toArray(badges).map((badge, index, array) => (
                            <React.Fragment key={index}>
                              {badge}
                              {index < array.length - 1 && (
                                <div className="h-3 w-px bg-gray-400" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {afterDescription && <div className="mt-2">{afterDescription}</div>}
                </div>

                {actions && (
                  <div className="flex shrink-0 items-center gap-3">{actions}</div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-gray-400" />
          </header>
        )}

        <div data-page-layout-body="" className="h-full">
          {children}
        </div>
      </article>
    )
  }
)

PageLayout.displayName = "PageLayout"

export { PageLayout }
export type { PageLayoutProps }
```

**Step 2: Create barrel export**

Create `src/components/page-layout/index.ts`:

```ts
export { PageLayout } from "./page-layout"

export type { PageLayoutProps } from "./page-layout"
```

**Step 3: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/page-layout/
git commit -m "feat(page-layout): add PageLayout component"
```

---

### Task 2: Write tests

**Files:**
- Create: `src/components/page-layout/page-layout.test.tsx`

**Step 1: Write the tests**

Create `src/components/page-layout/page-layout.test.tsx`:

```tsx
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
    const dividers = container.querySelectorAll(".bg-gray-400.w-px")
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
```

**Step 2: Run tests**

Run: `pnpm test src/components/page-layout/page-layout.test.tsx`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/components/page-layout/page-layout.test.tsx
git commit -m "test(page-layout): add PageLayout tests"
```

---

### Task 3: Write Storybook stories

**Files:**
- Create: `src/components/page-layout/page-layout.stories.tsx`

**Step 1: Write the stories**

Create `src/components/page-layout/page-layout.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { IconSprite } from "@/components/icon"
import { PageLayout } from "@/components/page-layout"

const meta = {
  title: "PageLayout",
  component: PageLayout,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof PageLayout>

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {
  render: () => (
    <PageLayout title="Users">
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <PageLayout title="Users" description="Manage your team members and their roles.">
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithActions: Story = {
  render: () => (
    <PageLayout
      title="Users"
      description="Manage your team members and their roles."
      actions={
        <>
          <Button intent="secondary">Export</Button>
          <Button intent="primary" leftIcon="plus-outline">
            Add User
          </Button>
        </>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithTitleBadge: Story = {
  render: () => (
    <PageLayout
      title="Users"
      titleBadge={<Badge intent="pro" size="sm">Pro</Badge>}
      description="Manage your team members and their roles."
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <PageLayout
      title="Users"
      description="Manage your team members and their roles."
      badges={
        <>
          <Badge intent="success" size="sm">Active: 12</Badge>
          <Badge intent="secondary" size="sm">Inactive: 3</Badge>
        </>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const WithBackAction: Story = {
  render: () => (
    <PageLayout
      title="User Details"
      description="View and edit user information."
      backAction={
        <Button intent="ghost" size="sm" leftIcon="arrow-left-outline">
          Back
        </Button>
      }
    >
      <p className="text-word-secondary">Page content goes here.</p>
    </PageLayout>
  ),
}

export const KitchenSink: Story = {
  render: () => (
    <PageLayout
      title="Team Members"
      titleBadge={<Badge intent="pro" size="sm">Pro</Badge>}
      description="Manage your organization's team members."
      badges={
        <>
          <Badge intent="success" size="sm">Active: 12</Badge>
          <Badge intent="secondary" size="sm">Invited: 5</Badge>
          <Badge intent="danger" size="sm">Suspended: 1</Badge>
        </>
      }
      afterDescription={<p className="text-sm text-word-tertiary">Last updated 2 hours ago</p>}
      actions={
        <>
          <Button intent="secondary">Export</Button>
          <Button intent="primary" leftIcon="plus-outline">
            Invite Member
          </Button>
        </>
      }
      backAction={
        <Button intent="ghost" size="sm" leftIcon="arrow-left-outline">
          Back
        </Button>
      }
    >
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-400">
        <p className="text-word-tertiary">Page content area</p>
      </div>
    </PageLayout>
  ),
}

export const BodyOnly: Story = {
  render: () => (
    <PageLayout>
      <p className="text-word-secondary">
        No header rendered — just the body content.
      </p>
    </PageLayout>
  ),
}
```

**Step 2: Type check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 3: Verify in Storybook** (manual)

Run: `pnpm storybook`
Check: All stories render correctly at `http://localhost:6006`

**Step 4: Commit**

```bash
git add src/components/page-layout/page-layout.stories.tsx
git commit -m "docs(page-layout): add Storybook stories"
```
