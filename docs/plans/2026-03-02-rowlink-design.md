# RowLink + Slot Design

## Overview

Add `DataTable.RowLink` — a stretched-link component that makes an entire table row clickable for navigation. Also introduces `Slot` and `composeRef` as general-purpose DS utilities.

## Approach: Stretched Link (Inside Cell)

RowLink renders an `<a>` (or custom element via `asChild`) inside a `<td>`. A `::before` pseudo-element covers the entire row, making it fully clickable. Other interactive elements (buttons, checkboxes, expand chevrons) float above the pseudo via `z-index`.

### Why This Approach

- Semantically valid — `<a>` inside `<td>` is correct HTML
- Link text is the accessible name — no redundant `aria-label`
- Pure CSS hover/focus — no JS click handlers
- `asChild` composes with any router `<Link>` component
- Proven in production (legacy DS)

## New Utilities

### `src/utils/compose-ref.ts`

Merges multiple refs into a single `RefCallback`. Ported from legacy.

```ts
export function composeRef<T>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T>
```

### `src/utils/slot.ts`

Renders the child element with merged props/refs instead of a wrapper. Ported from legacy, adapted to import `composeRef` from `@/utils/compose-ref`.

Exports: `Slot`, `Slottable`, `Root`, types `SlotProps` and `AsChildProp`.

## RowLink Component

### Props

```ts
type DataTableRowLinkProps = Pick<
  React.ComponentProps<"a">,
  "id" | "href" | "target" | "rel" | "aria-label" | "className" | "children"
> & AsChildProp
```

### Rendering

- Renders `<a>` or `Slot` (when `asChild`)
- `data-table-row-link=""` attribute marker for Row selectors
- `static` positioning — text flows normally in the cell
- Negative margin + padding for extended click target: `-mx-1 -my-0.5 px-1 py-0.5 rounded`
- `::before` pseudo: `absolute inset-0 z-0 cursor-pointer` — covers the row
- Focus ring: DS pattern with neutral `color-mix()` (secondary-like)
- `focus-visible:relative focus-visible:z-5` — elevates above everything during focus

## Row Modifications

New classes on `<tr>` via `has-[[data-table-row-link]]`:

| Class | Purpose |
|-------|---------|
| `has-[[data-table-row-link]]:relative` | Containing block for `::before` |
| `has-[[data-table-row-link]]:isolate` | Isolated stacking context |
| `has-[[data-table-row-link]]:[clip-path:inset(0)]` | Safari overflow fix |
| `has-[[data-table-row-link]]:hover:[--data-table-row-bg:...]` | Hover bg |
| `has-[[data-table-row-link]]:focus-within:[--data-table-row-bg:...]` | Focus bg |
| `[&:has([data-table-row-link])_:where(a,button)]:z-[1]` | Float interactives above |

## cellVariants Change

Background changes from:
```
bg-(--data-table-cell-bg)
```
To:
```
bg-[var(--data-table-row-bg,var(--data-table-cell-bg))]
```

`--data-table-row-bg` is undefined by default (falls back to `--data-table-cell-bg`). Row hover/focus-within sets it to the hover color. Selected state (`group-data-selected`) has higher specificity and still wins.

## rootVariants Addition

New CSS var:
```
[--data-table-cell-bg-hover:var(--color-gray-100)]
```

## Exports

- Compound: `RowLink: DataTableRowLink` added to `Object.assign`
- Types: `DataTableRowLinkProps` added to `index.ts`

## Coexistence

RowLink coexists with selection and expansion:
- SelectCell checkbox: `z-[1]` — clickable above the stretched link
- Expand chevron: `z-[1]` — clickable above the stretched link
- Selected bg: higher specificity via `group-data-selected`, not affected by hover
- Detail row: pseudo only covers the main row, not the detail panel

## Usage

```tsx
{/* Basic */}
<DataTable.Row rowId={user.id}>
  <DataTable.Cell>
    <DataTable.RowLink href={`/users/${user.id}`}>
      {user.name}
    </DataTable.RowLink>
  </DataTable.Cell>
  <DataTable.Cell>{user.email}</DataTable.Cell>
</DataTable.Row>

{/* With router Link */}
<DataTable.Cell>
  <DataTable.RowLink asChild>
    <Link to={`/users/${user.id}`}>{user.name}</Link>
  </DataTable.RowLink>
</DataTable.Cell>

{/* With selection + expansion + actions */}
<DataTable.Row rowId={user.id} detail={<UserDetail />}>
  <DataTable.Cell>
    <DataTable.RowLink href={`/users/${user.id}`}>
      {user.name}
    </DataTable.RowLink>
  </DataTable.Cell>
  <DataTable.Cell>{user.email}</DataTable.Cell>
  <DataTable.Cell>
    <DataTable.Actions>
      <IconButton icon="edit" />
    </DataTable.Actions>
  </DataTable.Cell>
</DataTable.Row>
```
