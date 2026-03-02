# PageLayout Design

## Overview

Page-level layout component that provides a consistent header structure (title, description, badges, actions) with a full-width divider and body area for all pages.

## API

```tsx
type PageLayoutProps = Pick<
  React.ComponentProps<"article">,
  "id" | "aria-label" | "className"
> & {
  title?: React.ReactNode
  titleBadge?: React.ReactNode
  description?: React.ReactNode
  badges?: React.ReactNode
  afterDescription?: React.ReactNode
  actions?: React.ReactNode
  backAction?: React.ReactNode
  children?: React.ReactNode
}
```

## Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│ [backAction]                                            │
│                                                         │
│ Title [titleBadge]                        [actions]     │
│ description  |  badge1  |  badge2                       │
│ [afterDescription]                                      │
│─────────────────────────────────────────────────────────│
│                                                         │
│ [children / body]                                       │
└─────────────────────────────────────────────────────────┘
```

## Decisions

1. **Flat props API** — not compound. Simpler for page-level composition.
2. **`backAction` as ReactNode** — DS stays router-agnostic.
3. **Always-on divider** — `h-px bg-gray-400` full width via `w-screen` centering.
4. **Both badge areas** — `titleBadge` inline with h2, `badges` next to description with `|` dividers.
5. **`data-page-layout-body`** on body div for future sidebar integration.
6. **`space-y-8`** between header and body.
7. **Semantic HTML** — `<article>` root, `<header>`, `<h2>`.
8. **Typography** — title: `text-2xl font-medium tracking-tight`, description: `text-word-secondary`.

## Not Included

- WithSidebar (deferred)
- Tabs integration (no Tabs component yet)
- Responsive badge breakpoints (add when needed)
