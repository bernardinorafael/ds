# DataTable BulkBar — Design

## Summary

Add a `DataTable.BulkBar` compound component that shows a fixed-bottom action bar when rows are selected. Introduce a selection context inside `DataTable.Root` to eliminate manual prop wiring for SelectHeader, SelectCell, Row selection highlight, and BulkBar.

## Decisions

- **Positioning**: Fixed to viewport bottom (like Gmail bulk actions)
- **Coupling**: Acoplada ao DataTable via internal context
- **Backward compatibility**: SelectHeader/SelectCell still accept explicit props. Context is opt-in via `selection` prop on Root

## API

### Selection Context

`DataTable.Root` gains an optional `selection` prop accepting the return value of `useRowSelection`:

```tsx
const selection = useRowSelection(users, { key: "id" })
<DataTable selection={selection}>...</DataTable>
```

When provided, a React context distributes selection state to:
- `DataTable.SelectHeader` — reads `isAllSelected`, `isPartialSelected`, `toggleAll`
- `DataTable.SelectCell` — reads `isSelected`, `toggleRow` (row ID from Row context)
- `DataTable.Row` — reads `isSelected` for `data-selected` highlight
- `DataTable.BulkBar` — reads `selectedIds.size`, `clearSelection`

When not provided, context is `null` and components require explicit props (no breaking change).

### Row ID Propagation

`DataTable.Row` gains an optional `rowId` prop. When inside a selection context, Row:
1. Sets `data-selected` automatically via `selection.isSelected(rowId)`
2. Provides `rowId` to children via a small RowContext so `SelectCell` knows which row to toggle

```tsx
<DataTable.Row key={user.id} rowId={user.id}>
  <DataTable.SelectCell />  {/* no props needed */}
</DataTable.Row>
```

### DataTable.BulkBar

```tsx
type DataTableBulkBarProps = {
  children: React.ReactNode
  /** Override the count label. Default: "{n} selected" */
  label?: (count: number) => string
  /** Override clear button text. Default: "Clear" */
  clearLabel?: string
  className?: string
}
```

Rendered via `ReactDOM.createPortal` to `document.body`. Animated with `motion/react` (slide up + fade in on enter, slide down + fade out on exit).

Layout:
```
┌──────────────────────────────────────────────────────────────┐
│  3 selected    [Clear]                  [Delete]  [Export]   │
└──────────────────────────────────────────────────────────────┘
```

- Left: count label (SlidingNumber animation) + Clear button
- Right: consumer-provided action buttons (children)
- `aria-live="polite"` for screen reader announcements
- z-index: 50

### Visual Design

- Background: `bg-gray-1200` (dark, high contrast)
- Text: `text-white`
- Rounded: `rounded-xl`
- Shadow: `shadow-lg`
- Max width constrained, centered horizontally
- Bottom offset: ~1rem from viewport bottom

### Full Consumer Example

```tsx
function UsersTable() {
  const selection = useRowSelection(users, { key: "id" })

  return (
    <DataTable selection={selection}>
      <DataTable.Head>
        <DataTable.SelectHeader />
        <DataTable.Header>Name</DataTable.Header>
        <DataTable.Header>Role</DataTable.Header>
      </DataTable.Head>
      <DataTable.Body>
        {users.map((user) => (
          <DataTable.Row key={user.id} rowId={user.id}>
            <DataTable.SelectCell />
            <DataTable.Cell>{user.name}</DataTable.Cell>
            <DataTable.Cell>{user.role}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable.Body>
      <DataTable.BulkBar>
        <Button
          intent="destructive"
          size="sm"
          onClick={() => deleteUsers(selection.selectedIds)}
        >
          Delete
        </Button>
        <Button intent="secondary" size="sm">
          Export
        </Button>
      </DataTable.BulkBar>
    </DataTable>
  )
}
```

### Backward Compatible Usage

```tsx
<DataTable.SelectHeader
  checked={isAllSelected}
  indeterminate={isPartialSelected}
  onChange={toggleAll}
/>
```

Explicit props still work when no `selection` context is provided.

## Implementation Notes

- Two new contexts: `SelectionContext` (from Root) and `RowContext` (from Row)
- BulkBar uses `createPortal(document.body)` + `AnimatePresence` + `motion.div`
- BulkBar only renders when inside a selection context with `selectedIds.size > 0`
- SelectHeader/SelectCell: check context first, fall back to props
- Row: if `rowId` provided and context exists, auto-derive `selected`
