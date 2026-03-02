# RadioGroup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a flat RadioGroup component wrapping `@radix-ui/react-radio-group` with options array API, badge support, Field integration, and animated indicator.

**Architecture:** Single `RadioGroup` component receives `options: RadioGroupOption[]`. Internally renders Radix `Root` + one `Item` per option with label, optional description, and optional Badge. Uses CVA for radio circle variants (size, disabled, validity). Integrates with `useFieldControl()` for form context.

**Tech Stack:** React 19, @radix-ui/react-radio-group, motion/react, class-variance-authority, Tailwind CSS v4

---

### Task 1: Install dependency

**Step 1: Install @radix-ui/react-radio-group**

Run: `pnpm add @radix-ui/react-radio-group`

**Step 2: Export BadgeProps from badge barrel**

**Files:**
- Modify: `src/components/badge/index.ts`

Add `type BadgeProps` to the barrel export so RadioGroup can import it:

```ts
export { Badge } from "./badge"
export type { BadgeProps } from "./badge"
```

This requires exporting `BadgeProps` from `badge.tsx` too. Currently `BadgeProps` is a local type — add `export` keyword:

**Files:**
- Modify: `src/components/badge/badge.tsx:161`

Change:
```ts
type BadgeProps = Pick<React.ComponentProps<"span">, "id" | "aria-label" | "className"> &
```
To:
```ts
export type BadgeProps = Pick<React.ComponentProps<"span">, "id" | "aria-label" | "className"> &
```

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/badge/badge.tsx src/components/badge/index.ts
git commit -m "chore: install @radix-ui/react-radio-group, export BadgeProps"
```

---

### Task 2: Write failing tests

**Files:**
- Create: `src/components/radio-group/radio-group.test.tsx`

```tsx
import { createRef } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { RadioGroup } from "@/components/radio-group"

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
]

describe("RadioGroup", () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render a radiogroup", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getByRole("radiogroup", { name: "Choices" })).toBeInTheDocument()
  })

  it("should render all radio options", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("should render labels for each option", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getByText("Option A")).toBeInTheDocument()
    expect(screen.getByText("Option B")).toBeInTheDocument()
    expect(screen.getByText("Option C")).toBeInTheDocument()
  })

  it("should forward ref to the root element", () => {
    const ref = createRef<HTMLDivElement>()
    render(<RadioGroup ref={ref} options={OPTIONS} aria-label="Choices" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("should merge custom className", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" className="custom" />)
    expect(screen.getByRole("radiogroup")).toHaveClass("custom")
  })

  it("should select defaultValue on mount", () => {
    render(<RadioGroup options={OPTIONS} defaultValue="b" aria-label="Choices" />)
    expect(screen.getByRole("radio", { name: "Option B" })).toBeChecked()
  })

  it("should select an option when clicked", async () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    await user.click(screen.getByRole("radio", { name: "Option A" }))
    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked()
  })

  it("should call onValueChange when selection changes", async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup options={OPTIONS} onValueChange={onValueChange} aria-label="Choices" />
    )
    await user.click(screen.getByRole("radio", { name: "Option B" }))
    expect(onValueChange).toHaveBeenCalledWith("b")
  })

  it("should support controlled value", () => {
    const { rerender } = render(
      <RadioGroup options={OPTIONS} value="a" onValueChange={() => {}} aria-label="Choices" />
    )
    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked()

    rerender(
      <RadioGroup options={OPTIONS} value="c" onValueChange={() => {}} aria-label="Choices" />
    )
    expect(screen.getByRole("radio", { name: "Option C" })).toBeChecked()
  })

  it("should disable all options when disabled", () => {
    render(<RadioGroup options={OPTIONS} disabled aria-label="Choices" />)
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled()
    })
  })

  it("should disable individual options", () => {
    const options = [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B", disabled: true },
    ]
    render(<RadioGroup options={options} aria-label="Choices" />)
    expect(screen.getByRole("radio", { name: "Option A" })).not.toBeDisabled()
    expect(screen.getByRole("radio", { name: "Option B" })).toBeDisabled()
  })

  it("should render description when provided", () => {
    const options = [
      { value: "a", label: "Option A", description: "First option details" },
    ]
    render(<RadioGroup options={options} aria-label="Choices" />)
    expect(screen.getByText("First option details")).toBeInTheDocument()
  })

  it("should render badge when badgeProps provided", () => {
    const options = [
      { value: "a", label: "Option A", badgeProps: { children: "Pro" as React.ReactNode } },
    ]
    render(<RadioGroup options={options} aria-label="Choices" />)
    expect(screen.getByText("Pro")).toBeInTheDocument()
  })

  it("should apply sm size variant by default", () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    expect(screen.getAllByRole("radio")[0]).toHaveClass("size-4")
  })

  it("should apply md size variant", () => {
    render(<RadioGroup options={OPTIONS} size="md" aria-label="Choices" />)
    expect(screen.getAllByRole("radio")[0]).toHaveClass("size-5")
  })

  it("should navigate with keyboard", async () => {
    render(<RadioGroup options={OPTIONS} aria-label="Choices" />)
    const firstRadio = screen.getByRole("radio", { name: "Option A" })
    firstRadio.focus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveFocus()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test src/components/radio-group/radio-group.test.tsx`
Expected: FAIL — module `@/components/radio-group` not found

**Step 3: Commit**

```bash
git add src/components/radio-group/radio-group.test.tsx
git commit -m "test(radio-group): add RadioGroup tests"
```

---

### Task 3: Implement RadioGroup component

**Files:**
- Create: `src/components/radio-group/radio-group.tsx`

```tsx
import React from "react"

import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"

import { Badge, type BadgeProps } from "@/components/badge"
import { useFieldControl } from "@/components/field"
import { cn } from "@/utils/cn"

const radioItemVariants = cva(
  [
    // layout
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",

    // visual
    "rounded-full",
    "border",
    "border-(--radio-border-color)",
    "bg-white",
    "text-word-primary",
    "shadow-sm",

    // checked
    "data-[state=checked]:border-word-primary",
    "data-[state=checked]:[--radio-border-color:var(--color-word-primary)]",
    "data-[state=checked]:[--radio-ring-color:color-mix(in_srgb,var(--color-word-primary)_20%,transparent)]",

    // transitions
    "transition-colors",
    "duration-150",

    // focus
    "outline-none",
    "focus-visible:ring-(--radio-ring-color)",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-(--radio-border-color)",
  ],
  {
    variants: {
      size: {
        sm: ["size-4", "focus-visible:ring-1"],
        md: ["size-5", "focus-visible:ring-[1.5px]"],
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "cursor-pointer",
      },
      validity: {
        initial: [
          "[--radio-border-color:var(--color-border)]",
          "[--radio-ring-color:color-mix(in_srgb,black_13%,transparent)]",
        ],
        error: [
          "[--radio-border-color:var(--color-destructive)]",
          "[--radio-ring-color:color-mix(in_srgb,var(--color-destructive)_20%,transparent)]",
        ],
        warning: [
          "[--radio-border-color:var(--color-orange-900)]",
          "[--radio-ring-color:color-mix(in_srgb,var(--color-orange-900)_20%,transparent)]",
        ],
        success: [
          "[--radio-border-color:var(--color-green-900)]",
          "[--radio-ring-color:color-mix(in_srgb,var(--color-green-900)_20%,transparent)]",
        ],
      },
    },
    defaultVariants: {
      size: "sm",
      disabled: false,
      validity: "initial",
    },
  }
)

const dotSizeMap = {
  sm: "size-1.5",
  md: "size-2",
} as const

const descriptionPaddingMap = {
  sm: "pl-6",
  md: "pl-7",
} as const

export type RadioGroupOption = {
  /** Option value */
  value: string
  /** Label text */
  label: string
  /** Helper text below the label */
  description?: string
  /** Disable this individual option */
  disabled?: boolean
  /** Badge rendered inline after the label */
  badgeProps?: BadgeProps
}

export type RadioGroupProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className"
> &
  VariantProps<typeof radioItemVariants> & {
    /** Form field name */
    name?: string
    /** Controlled value */
    value?: string
    /** Initial value (uncontrolled) */
    defaultValue?: string
    /** Called when selection changes */
    onValueChange?: (value: string) => void
    /** Disable all options */
    disabled?: boolean
    /** Mark as required */
    required?: boolean
    /** Radio options to render */
    options: RadioGroupOption[]
    /** Visual validity state. Overrides Field context detection. */
    validity?: "initial" | "error" | "warning" | "success"
  }

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      disabled = false,
      size = "sm",
      validity: validityProp,
      "aria-label": ariaLabel,
      options,
      ...props
    },
    forwardedRef
  ) => {
    const field = useFieldControl({ props: { id: props.id } })
    const ariaInvalid = field["aria-invalid"]
    const validity =
      validityProp ?? field.messageIntent ?? (ariaInvalid === true ? "error" : "initial")

    return (
      <RadixRadioGroup.Root
        ref={forwardedRef}
        className={cn("flex flex-col gap-3", className)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={ariaInvalid}
        {...props}
      >
        {options.map((option) => {
          const itemId = `${field.id ?? props.id ?? ""}-${option.value}`

          return (
            <label
              key={option.value}
              htmlFor={itemId}
              className={cn(
                "group flex flex-col gap-0.5",
                disabled || option.disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <div className="flex items-center gap-2">
                <RadixRadioGroup.Item
                  id={itemId}
                  value={option.value}
                  disabled={option.disabled}
                  className={radioItemVariants({
                    size,
                    disabled: disabled || option.disabled || false,
                    validity,
                  })}
                >
                  <RadixRadioGroup.Indicator asChild>
                    <motion.span
                      className={cn("rounded-full bg-current", dotSizeMap[size ?? "sm"])}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  </RadixRadioGroup.Indicator>
                </RadixRadioGroup.Item>

                <span
                  className={cn(
                    "text-word-primary text-base font-medium transition-colors select-none",
                    disabled || option.disabled
                      ? "opacity-50"
                      : "opacity-80 group-hover:opacity-100"
                  )}
                >
                  {option.label}
                </span>

                {option.badgeProps && <Badge {...option.badgeProps} />}
              </div>

              {option.description && (
                <p
                  className={cn(
                    "text-word-secondary text-sm font-normal transition-colors select-none",
                    descriptionPaddingMap[size ?? "sm"],
                    (disabled || option.disabled) && "opacity-50"
                  )}
                >
                  {option.description}
                </p>
              )}
            </label>
          )
        })}
      </RadixRadioGroup.Root>
    )
  }
)

RadioGroup.displayName = "RadioGroup"
```

**Step 2: Create barrel export**

**Files:**
- Create: `src/components/radio-group/index.ts`

```ts
export { RadioGroup, type RadioGroupProps, type RadioGroupOption } from "./radio-group"
```

**Step 3: Run tests**

Run: `pnpm test src/components/radio-group/radio-group.test.tsx`
Expected: All tests PASS

**Step 4: Type-check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 5: Commit**

```bash
git add src/components/radio-group/radio-group.tsx src/components/radio-group/index.ts
git commit -m "feat(radio-group): add RadioGroup component"
```

---

### Task 4: Write Storybook stories

**Files:**
- Create: `src/components/radio-group/radio-group.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/badge"
import { Card } from "@/components/card"
import { RadioGroup } from "@/components/radio-group"

const meta = {
  title: "RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    "aria-label": "Radio group",
    options: [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
      { value: "c", label: "Option C" },
    ],
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

const SIZES = ["sm", "md"] as const

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-start gap-3">
          <span className="text-word-secondary w-8 pt-0.5 text-sm">{size}</span>
          <RadioGroup
            size={size}
            defaultValue="a"
            aria-label={`Size ${size}`}
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
              { value: "c", label: "Option C" },
            ]}
          />
        </div>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex items-start gap-12">
      <div className="flex flex-col gap-1">
        <span className="text-word-secondary text-sm">Default</span>
        <RadioGroup
          aria-label="Default"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-word-secondary text-sm">Selected</span>
        <RadioGroup
          defaultValue="a"
          aria-label="Selected"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-word-secondary text-sm">Disabled</span>
        <RadioGroup
          disabled
          defaultValue="a"
          aria-label="Disabled"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
        />
      </div>
    </div>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup
      defaultValue="unlimited"
      aria-label="Membership limit"
      options={[
        {
          value: "unlimited",
          label: "Unlimited membership",
          badgeProps: { intent: "pro", children: "Pro" },
          description:
            "Organizations can have an unlimited number of members and pending invitations",
        },
        {
          value: "limited",
          label: "Limited membership",
          description:
            "Organizations are limited to the following number of members, including pending invitations.",
        },
      ]}
    />
  ),
}

export const WithBadge: Story = {
  render: () => (
    <RadioGroup
      defaultValue="free"
      aria-label="Plan"
      options={[
        { value: "free", label: "Free plan" },
        {
          value: "pro",
          label: "Pro plan",
          badgeProps: { intent: "pro", children: "Pro" },
        },
        {
          value: "enterprise",
          label: "Enterprise",
          badgeProps: { intent: "primary", children: "Coming soon" },
          disabled: true,
        },
      ]}
    />
  ),
}

export const InsideCard: Story = {
  render: () => (
    <Card spacing="cozy" className="max-w-lg">
      <Card.Body>
        <Card.Row>
          <Card.Title>Default membership limit</Card.Title>
          <RadioGroup
            defaultValue="unlimited"
            aria-label="Membership limit"
            size="md"
            options={[
              {
                value: "unlimited",
                label: "Unlimited membership",
                badgeProps: { intent: "pro", children: "Pro" },
                description:
                  "Organizations can have an unlimited number of members and pending invitations",
              },
              {
                value: "limited",
                label: "Limited membership",
                description:
                  "Organizations are limited to the following number of members, including pending invitations.",
              },
            ]}
          />
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
```

**Step 2: Verify stories render**

Run: `pnpm storybook` and check RadioGroup page.

**Step 3: Commit**

```bash
git add src/components/radio-group/radio-group.stories.tsx
git commit -m "docs(radio-group): add Storybook stories"
```

---

### Task 5: Final verification

**Step 1: Run all tests**

Run: `pnpm test`
Expected: All pass, no regressions

**Step 2: Type-check**

Run: `pnpm exec tsc -b`
Expected: No errors

**Step 3: Lint**

Run: `pnpm lint`
Expected: No errors
