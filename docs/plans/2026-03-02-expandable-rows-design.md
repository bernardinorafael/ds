# DataTable Expandable Rows — Design

## Summary

Add expandable row support to `DataTable.Row` via a `detail` prop. When provided, the row becomes clickable and reveals a detail panel below it with animated height transition. Accordion behavior — only one row expanded at a time.

## Decisions

- **Mode**: Accordion (single expanded row). Expanding one collapses the previous.
- **Trigger**: Click anywhere on the row (except buttons/inputs/links) + visible chevron indicator
- **API surface**: Minimal — one new hook (`useRowExpansion`), one new prop on Row (`detail`), one auto-generated column (chevron)
- **Selection coexistence**: Checkbox click selects, row click expands. Both contexts coexist in Root.
- **Animation**: `height: 0→auto` + `opacity`, `duration: 0.2s` — matches existing pagination footer pattern
- **Breaking changes**: Zero

## API

### Expansion Hook

```tsx
const expansion = useRowExpansion()
```

Returns:

```tsx
type ExpansionContextValue = {
  expandedId: string | null
  isExpanded: (id: string) => boolean
  toggle: (id: string) => void
  collapse: () => void
}
```

- `expandedId` — ID of the currently expanded row, or null
- `isExpanded(id)` — check if a specific row is expanded
- `toggle(id)` — expand row (collapsing any other), or collapse if already expanded
- `collapse()` — close any open row

### Root Wiring

```tsx
<DataTable expansion={expansion} selection={selection}>
```

`expansion` is optional. When provided, Root creates an `ExpansionContext.Provider`. When not provided, context is null and all rows behave as before.

### Row Props

```tsx
type DataTableRowProps = {
  children: React.ReactNode
  className?: string
  selected?: boolean
  rowId?: string
  detail?: React.ReactNode  // NEW — content for the detail panel
}
```

- `detail` is the only new prop. When present, the row becomes expandable.
- `rowId` is required when `detail` is present (dev-time console warning if missing).

### Consumer Usage

```tsx
const expansion = useRowExpansion()
const selection = useRowSelection(users, { key: "id" })

<DataTable expansion={expansion} selection={selection}>
  <DataTable.Head>
    <DataTable.SelectHeader />
    <DataTable.Header>Name</DataTable.Header>
    <DataTable.Header>Email</DataTable.Header>
  </DataTable.Head>
  <DataTable.Body>
    {users.map(user => (
      <DataTable.Row
        key={user.id}
        rowId={user.id}
        detail={<UserDetailPanel user={user} />}
      >
        <DataTable.SelectCell />
        <DataTable.Cell>{user.name}</DataTable.Cell>
        <DataTable.Cell>{user.email}</DataTable.Cell>
      </DataTable.Row>
    ))}
  </DataTable.Body>
</DataTable>
```

## Rendering

### HTML Structure

Each expandable row renders two `<tr>` elements:

```html
<tr data-expanded aria-expanded="true" tabindex="0" class="group/table-row cursor-pointer">
  <td style="width: var(--data-table-expand-col-w)">
    <button aria-label="Collapse row">
      <svg class="rotate-90 transition-transform duration-200"><!-- chevron --></svg>
    </button>
  </td>
  <td>Name</td>
  <td>Email</td>
</tr>
<tr>
  <td colspan="3">
    <div style="overflow: hidden"> <!-- motion wrapper -->
      <div class="px-(--data-table-cell-px) py-(--data-table-cell-py)">
        {detail content}
      </div>
    </div>
  </td>
</tr>
```

### Chevron Column

- Auto-injected as the first column when `ExpansionContext` exists
- `Head` renders an empty `<th>` with `sr-only` label
- Width: `--data-table-expand-col-w: 2.5rem` (matches select column width)
- Chevron icon: `chevron-right` from DS icon set
- Rotation: `rotate-0` (collapsed) → `rotate-90` (expanded) via CSS transition

### Column Order (with selection)

```
[checkbox] [chevron] [Name] [Email] [Actions]
```

Checkbox column first, chevron column second.

### Detail Panel

- `<td colSpan={totalColumns}>` spans full width
- Background: `--data-table-cell-bg` (continuity with row above)
- No top border (merges with row), normal bottom border
- Padding: `px-(--data-table-cell-px) py-(--data-table-cell-py)`

## Interaction

### Click Behavior

Row with `detail` receives an `onClick` handler that calls `expansion.toggle(rowId)`.

Click does NOT trigger expansion on:
- `<button>`, `<a>`, `<input>` elements and their descendants
- Elements with `[data-no-expand]` attribute (escape hatch)

Implementation: `event.target.closest("button, a, input, [data-no-expand]")` check.

### Keyboard

- Expandable rows are focusable: `tabIndex={0}`
- `Enter` or `Space` toggles expansion
- Chevron button is independently focusable and keyboard-accessible

### Accessibility

- `aria-expanded="true|false"` on the main row `<tr>`
- Chevron button: `aria-label="Expand row"` / `"Collapse row"`
- Detail panel presence controlled by `AnimatePresence` (no `aria-hidden` needed)
- `data-expanded` attribute on row for CSS styling hooks

## Animation

### Detail Panel

```tsx
<AnimatePresence initial={false}>
  {isExpanded && (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <td colSpan={totalColumns}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: "hidden" }}
        >
          <div className="px-(--data-table-cell-px) py-(--data-table-cell-py)">
            {detail}
          </div>
        </motion.div>
      </td>
    </motion.tr>
  )}
</AnimatePresence>
```

### Chevron

CSS transition only (no motion):
- `transition-transform duration-200`
- Collapsed: `rotate-0`
- Expanded: `rotate-90`

### Accordion Transition

When clicking a different row:
1. Current row closes (exit animation)
2. New row opens (enter animation)
3. Both animate simultaneously (no `mode="wait"`) for fluid feel

## CSS Custom Properties

New tokens added to `rootVariants`:

```
--data-table-expand-col-w: 2.5rem
--data-table-expanded-bg: var(--color-surface-100)  /* optional: distinct bg for detail */
```

## Exports

New exports from `@/components/data-table`:

```tsx
export { useRowExpansion }
export type { ExpansionContextValue }
```
