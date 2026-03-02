# RadioGroup Design

## Overview

Flat RadioGroup component wrapping `@radix-ui/react-radio-group`. Single export receives `options` array. Each option supports label, description, disabled, and optional `badgeProps`.

## API

```tsx
type RadioGroupOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
  badgeProps?: BadgeProps
}

type RadioGroupProps = Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "className"
> &
  VariantProps<typeof radioGroupItemVariants> & {
    name?: string
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    required?: boolean
    options: RadioGroupOption[]
    validity?: "initial" | "error" | "warning" | "success"
  }
```

## Usage

```tsx
<RadioGroup
  defaultValue="unlimited"
  options={[
    {
      value: "unlimited",
      label: "Unlimited membership",
      badgeProps: { intent: "pro", children: "Pro" },
      description: "Organizations can have an unlimited number of members",
    },
    {
      value: "limited",
      label: "Limited membership",
      description: "Organizations are limited to the following number",
    },
  ]}
/>
```

## Visual States (20px circle reference)

| State | Unchecked | Checked |
|-------|-----------|---------|
| Active | Border gray, empty | Dark ring + white gap + center dot |
| Hover | Darker border + subtle dot | Bolder ring |
| Pressed | Primary tint | — |
| Disabled | opacity-60, cursor not-allowed | opacity-60 |

## Sizes

| Size | Circle | Dot | Gap to label |
|------|--------|-----|-------------|
| sm | 16px (size-4) | 6px | gap-2 |
| md | 20px (size-5) | 8px | gap-2 |

## Indicator

Inner dot via `<span>` with `rounded-full bg-current`. Animated with `motion/react`: scale 0.5→1 + opacity 0→1 (same pattern as Checkbox).

## Field Integration

- `useFieldControl()` for id, aria-describedby, aria-invalid
- validity prop (initial/error/warning/success) affects circle border color
- CSS variables: `--radio-border-color`, `--radio-ring-color`

## File Structure

```
src/components/radio-group/
├── radio-group.tsx
├── radio-group.test.tsx
├── radio-group.stories.tsx
└── index.ts
```

## Dependencies

- `@radix-ui/react-radio-group` (new install)
- `motion/react` (existing)
- `class-variance-authority` (existing)
- `@/components/badge` (existing)
- `@/components/field` (existing)
