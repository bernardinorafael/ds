# Adding Icons

Icons live in `src/components/icon/icons.tsx` as static SVG path definitions. The system uses a sprite approach — all icons are compiled into a single hidden `<svg>` at runtime, referenced by `<use href="#id">` with zero JS bundle cost per icon.

---

## Before You Start

Every icon requires **two separate sets of paths**:

| Variant | viewBox     | CSS size |
| ------- | ----------- | -------- |
| `sm`    | `0 0 16 16` | 16×16px  |
| `base`  | `0 0 20 20` | 20×20px  |

Paths are **not scaled** from one size to the other. Each variant must be drawn (or exported from Figma) at its target canvas size. Scaling a 20px path down to 16px produces thinner strokes and softer corners — visually incorrect at small sizes.

---

## SVG Requirements

All icons are **stroke-based**. The `<Icon>` component sets `stroke="currentColor"` and `fill="none"` on the SVG root, so your paths must follow the same contract:

- Draw with strokes only — no filled shapes (except two-tone, see below)
- Do **not** set `stroke` or `fill` directly on path elements
- Use only: `<path>`, `<circle>`, `<rect>`, `<line>`, `<polyline>`, `<polygon>`
- Remove all `style`, `id`, `class`, `data-*`, and `xmlns` attributes exported by Figma
- Do **not** include a wrapping `<svg>` — only the inner elements go into `_SYMBOLS`

### Figma export checklist

1. Select the icon frame at the correct size (16 or 20px)
2. Export as SVG
3. Open the file — copy only the contents inside `<svg>`, discarding the `<svg>` tag itself
4. Strip: `fill="none"`, `stroke="#000"`, `stroke-width="..."` — the component handles these
5. Verify the paths look correct in a viewer before adding

---

## Adding a Single-Color Icon

Open `src/components/icon/icons.tsx` and add an entry to `_SYMBOLS`:

```tsx
// Single path
"arrow-right": {
  base: <path d="M4 10h12M11 5l5 5-5 5" />,
  sm:   <path d="M3 8h10M9 4l4 4-4 4" />,
},

// Multiple elements — wrap in a Fragment
"lock": {
  base: (
    <>
      <rect x="5" y="9" width="10" height="8" rx="1.5" />
      <path d="M8 9V7a2 2 0 0 1 4 0v2" />
    </>
  ),
  sm: (
    <>
      <rect x="4" y="7.5" width="8" height="6.5" rx="1" />
      <path d="M6.5 7.5V6a1.5 1.5 0 0 1 3 0v1.5" />
    </>
  ),
},
```

That's it. The TypeScript type `IconName` updates automatically — no manual type changes needed.

---

## Adding a Two-Tone Icon

Two-tone icons have a primary stroke and a secondary filled area at 15% opacity. The secondary path uses a CSS custom property so the `<Icon fill="transparent">` prop can suppress it without any prop drilling into the sprite.

Apply these two attributes to the **secondary path only**:

```tsx
className="fill-[--icon-fill,currentColor]"
fillOpacity={0.15}
```

Example — a notification bell with a filled background:

```tsx
"bell": {
  base: (
    <>
      {/* secondary: filled background at 15% opacity */}
      <path
        d="M10 2a6 6 0 0 1 6 6v3l1.5 2H2.5L4 11V8a6 6 0 0 1 6-6z"
        className="fill-[--icon-fill,currentColor]"
        fillOpacity={0.15}
      />
      {/* primary: stroke outline */}
      <path d="M10 2a6 6 0 0 1 6 6v3l1.5 2H2.5L4 11V8a6 6 0 0 1 6-6zM8 18a2 2 0 0 0 4 0" />
    </>
  ),
  sm: (
    <>
      <path
        d="M8 1.5a5 5 0 0 1 5 5v2.5l1 1.5H2L3 9V6.5a5 5 0 0 1 5-5z"
        className="fill-[--icon-fill,currentColor]"
        fillOpacity={0.15}
      />
      <path d="M8 1.5a5 5 0 0 1 5 5v2.5l1 1.5H2L3 9V6.5a5 5 0 0 1 5-5zM6.5 14a1.5 1.5 0 0 0 3 0" />
    </>
  ),
},
```

Usage:

```tsx
<Icon name="bell" />                    {/* secondary fill visible */}
<Icon name="bell" fill="transparent" /> {/* secondary fill hidden */}
```

---

## Naming Conventions

- Lowercase, hyphen-separated: `arrow-right`, `chevron-down`, `eye-off`
- Descriptive of shape, not meaning: `circle-check` not `success`, `triangle-warning` not `alert`
- Avoid abbreviations: `information` not `info` (or keep consistent with what's already there)
- Directional variants share a prefix: `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right`

---

## Updating the Story

After adding the icon, add its name to `ALL_ICONS` in `icon.stories.tsx` so it appears in the Storybook catalog:

```ts
// src/components/icon/icon.stories.tsx
const ALL_ICONS: IconName[] = [
  // ...existing
  "your-new-icon",
]
```

---

## Checklist

- [ ] `base` paths drawn on a `20×20` canvas
- [ ] `sm` paths drawn on a `16×16` canvas (not scaled from base)
- [ ] No `stroke`, `fill`, `stroke-width` on individual elements
- [ ] No wrapping `<svg>` tag
- [ ] Name added to `ALL_ICONS` in `icon.stories.tsx`
- [ ] Two-tone secondary paths use `className="fill-[--icon-fill,currentColor]"` + `fillOpacity={0.15}`
