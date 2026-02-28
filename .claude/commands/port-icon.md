# Port Icon

Port one or more SVG icons into the DS icon system.

## Input

The user will provide:

- **Icon name(s)**: the key to use in `_SYMBOLS` (e.g. `arrow-right`, `house-off`)
- **SVG source(s)**: a React component, raw SVG file, or path string (24×24 Lucide or custom)

If the user pastes multiple icons at once, port all of them in a single pass.

## Files to edit

- `src/components/icon/icons.tsx` — add to `_SYMBOLS`
- `src/components/icon/icon.stories.tsx` — add name(s) to `ALL_ICONS`

## Step-by-step

### 1. Read current state

Read both files before making any changes.

### 2. Identify icon type

**Stroke icon** — paths rely on `stroke="currentColor" fill="none"` inherited from the SVG root:

- Do NOT add `fill` or `stroke` attributes to path elements
- Most Lucide icons are stroke-based

**Fill icon** — uses solid filled areas (often with `fillRule="evenodd"` cutouts):

- Add `fill="currentColor" stroke="none"` to every path/shape element
- Add `fillRule="evenodd" clipRule="evenodd"` when compound subpaths create cutouts

### 3. Determine canvas size

Each icon needs two variants:

| Variant | viewBox     |
| ------- | ----------- |
| `base`  | `0 0 20 20` |
| `sm`    | `0 0 16 16` |

Source icons are almost always 24×24. Scale all coordinates mathematically — never use CSS/SVG `transform: scale()`.

**Scale factors from 24×24:**

- → `base` (20×20): multiply all coordinates by **5/6 ≈ 0.8333**
- → `sm` (16×16): multiply all coordinates by **2/3 ≈ 0.6667**

What to scale: absolute coords (M, L, H, V, A, C, Q), relative coords (m, l, h, v, a, c, q), arc radii (rx, ry), bezier control points. Round to 2 decimal places.

### 4. Clean up Figma/source artifacts

Strip from every element: `fill="none"`, `stroke="#000"`, `stroke-width`, `style`, `xmlns`, `id`, `class`, `data-*`

Remove the outer `<svg>` wrapper — only inner elements go into `_SYMBOLS`.

Collapse `<g>` wrappers with no semantic value.

**H-chain artifacts** (Figma approximating curves as dozens of tiny `H` segments): rewrite as clean Bezier or arc commands.

**Circle formula** (4-Bezier, avoids degenerate arc edge cases):

```
cp = radius × 0.5523
M cx cy-r
C cx+cp cy-r, cx+r cy-cp, cx+r cy
C cx+r cy+cp, cx+cp cy+r, cx cy+r
C cx-cp cy+r, cx-r cy+cp, cx-r cy
C cx-r cy-cp, cx-cp cy-r, cx cy-r Z
```

### 5. Add to `_SYMBOLS`

```tsx
// Stroke icon — single path
"arrow-right": {
  base: <path d="M4 10h12M11 5l5 5-5 5" />,
  sm:   <path d="M3 8h10M9 4l4 4-4 4" />,
},

// Stroke icon — multiple elements (Fragment)
"house": {
  base: (
    <>
      <path d="..." />
      <path d="..." />
    </>
  ),
  sm: (
    <>
      <path d="..." />
      <path d="..." />
    </>
  ),
},

// Fill icon
"info": {
  base: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      clipRule="evenodd"
      d="..."
    />
  ),
  sm: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      clipRule="evenodd"
      d="..."
    />
  ),
},
```

Mixed elements (`<rect>`, `<circle>`) are allowed — wrap in Fragment when there are multiple.

### 6. Update `ALL_ICONS` in the story

Add the new icon name(s) to the `ALL_ICONS` array in `src/components/icon/icon.stories.tsx`.

### 7. Verify

Run `pnpm exec tsc -b`. Fix any type errors before reporting done.

If the source SVG looks wrong (e.g. copy-pasted the same icon twice, or the SVG doesn't match the name), flag it and use the correct Lucide equivalent based on the icon name.
