# Port Icon

Port one or more SVG icons into the DS icon system.

## Input

The user will provide:

- **Icon name(s)**: the key to use in `_SYMBOLS` (e.g. `arrow-right`, `house-off`)
- **SVG source(s)**: a React component, raw SVG file, or path string

If the user pastes multiple icons at once, port all of them in a single pass.

## Files to edit

- `src/components/icon/icons.tsx` — add to `_SYMBOLS`
- `src/components/icon/icon.stories.tsx` — add name(s) to `ALL_ICONS`

## Step-by-step

### 1. Read current state

Read both files before making any changes.

### 2. Identify icon type and naming

**Stroke icon** (`<name>-outline`) — paths rely on `stroke="currentColor" fill="none"` inherited from the SVG root:

- Do NOT add `fill` or `stroke` attributes to path elements
- Most Lucide icons are stroke-based
- Name: always suffix with `-outline` (e.g. `arrow-right-outline`, `check-circle-outline`)

**Fill icon** (`<name>-fill`) — uses solid filled areas (often with `fillRule="evenodd"` cutouts):

- Add `fill="currentColor" stroke="none"` to every path/shape element
- Add `fillRule="evenodd" clipRule="evenodd"` when compound subpaths create cutouts
- Name: always suffix with `-fill` (e.g. `github-fill`, `bookmark-fill`)

**Duo-tone icon** (`<name>-duo`) — uses two layers (primary + secondary at reduced opacity):

- Primary path: `fill="currentColor" stroke="none"`
- Secondary path: `className="fill-[--icon-fill,currentColor]"` + `fillOpacity={0.15}`
- The Icon component controls `--icon-fill` via the `fill` prop
- Name: always suffix with `-duo` (e.g. `info-duo`, `alert-duo`)

### 3. Determine canvas sizes

Each icon requires **two** sizes, with an optional third:

| Key  | viewBox      | Required |
| ---- | ------------ | -------- |
| `sm` | `0 0 16 16`  | yes      |
| `md` | `0 0 20 20`  | yes      |
| `lg` | `0 0 24 24`  | optional |

Use the scaling script to transform path data — never scale manually or via CSS/SVG `transform: scale()`.

```bash
# Usage: node scripts/scale-svg-path.mjs <path-d> <from-size> <to-size>
node scripts/scale-svg-path.mjs "M16,2.345c7.735..." 32 20   # → md path
node scripts/scale-svg-path.mjs "M16,2.345c7.735..." 32 16   # → sm path
node scripts/scale-svg-path.mjs "M16,2.345c7.735..." 32 24   # → lg path
```

The script handles all SVG commands (M, C, c, s, A, etc.), scales coordinates and radii, preserves arc flags, and rounds to 2 decimal places. Run it once per target size and paste the output into `_SYMBOLS`.

### 4. Clean up source artifacts

Strip from every element: `fill="none"`, `stroke="#..."`, `stroke-width`, `style`, `xmlns`, `id`, `class`, `data-*`, `opacity` on wrapper `<g>`.

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

Keys are `sm`, `md`, and optionally `lg`. The object is typed as:
`satisfies Record<string, { sm: ReactNode; md: ReactNode; lg?: ReactNode }>`

```tsx
// Stroke icon — single path (note -outline suffix)
"arrow-right-outline": {
  md: <path d="M4 10h12M11 5l5 5-5 5" />,
  sm: <path d="M3 8h10M9 4l4 4-4 4" />,
},

// Stroke icon — multiple elements (Fragment)
"house-outline": {
  md: (
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

// Fill icon (note -fill suffix)
"github-fill": {
  md: (
    <path
      fill="currentColor"
      stroke="none"
      d="..."
    />
  ),
  sm: (
    <path
      fill="currentColor"
      stroke="none"
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

If the source SVG looks wrong (e.g. copy-pasted the same icon twice, or the SVG doesn't match the name), flag it and use the correct equivalent based on the icon name.
