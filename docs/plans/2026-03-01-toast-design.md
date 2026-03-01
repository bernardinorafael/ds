# Toast Component Design

## Overview

Faithful port of the production toast prototype into DS conventions. Uses Zustand for state, Radix Toast primitives for accessibility, and motion/react for animations.

## Decisions

- **All 6 button types**: action, confirm, deny, confirmIcon, denyIcon, mutedAction
- **Inline SVG icons**: not added to Icon system (custom fills/opacities)
- **Blur overlay**: 5-layer progressive backdrop-filter included
- **Toaster inside Provider**: automatic, no manual placement
- **Jiggle animation**: kept for duplicate/update attention
- **Max 3 toasts**: oldest auto-dismissed on overflow
- **Approach**: faithful port (Approach A)

## Public API

```tsx
import { toast } from "@/components/toast"

// Basic
toast("Something happened") // info default
toast.success("Saved")
toast.error("Failed")
toast.warning("Rate limit approaching")

// With action
toast.success("Created", {
  action: { label: "Undo", onClick: () => undo() },
})

// With confirm/deny
toast("Unsaved changes", {
  duration: Infinity,
  confirm: { label: "Save", onClick: () => save() },
  deny: { label: "Discard", onClick: () => discard() },
  disableCloseAction: true,
})

// Icon buttons
toast("Delete?", {
  duration: Infinity,
  confirmIcon: { label: "Confirm", onClick: () => del() },
  denyIcon: { label: "Cancel", onClick: () => {} },
})

// Muted action
toast.success("Exported", {
  action: { label: "Open", onClick: () => open() },
  mutedAction: { label: "Copy link", onClick: () => copy() },
})

// Programmatic
const id = toast("Processing...")
toast.update(id, { message: "Done!" })
toast.dismiss(id)
```

### Exports

- `toast` — imperative API
- `Toaster` — React component (rendered inside Provider)
- `type ToastIntent` — `"info" | "success" | "warning" | "error"`
- `type ToastAction` — `{ label: string; onClick?: (event) => void; form?: string }`
- `type ToastOptions` — consumer-facing options

## Architecture

### Zustand Store (internal)

```
State:
  toasts: IToast[]          // max 3

Actions:
  addToast(toast: IToast)   // push, trim oldest if > 3
  removeToast(id: string)   // filter out
  updateToast(id, opts)     // merge partial
```

### Component Tree

```
<Provider>
  <TooltipProvider>
    <IconSprite />
    <Toaster />
    {children}
  </TooltipProvider>
</Provider>

<Toaster>
  <ToastPrimitive.Provider>
    <LayoutGroup>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => <Toast key={t.id} toast={t} />)}
      </AnimatePresence>
      <AnimatePresence>
        {hasToasts && <BlurOverlay />}
      </AnimatePresence>
    </LayoutGroup>
    <ToastPrimitive.Viewport />
  </ToastPrimitive.Provider>
</Toaster>
```

### File Structure

```
src/components/toast/
├── toast.tsx           # Store, Toaster, Toast, ToastButton, icons, API
├── toast.test.tsx      # Unit tests
├── toast.stories.tsx   # Stories
└── index.ts            # Barrel exports
```

## Visual Design

### Toast Container

- Background: `bg-gradient-to-b from-gray-1100 to-gray-1200`
- Shape: `rounded-[20px]` inner, `rounded-full` outer wrapper
- Shadow: `shadow-xl shadow-black/25`
- Inner highlight: `::before` with `inset-px rounded-full shadow-[inset_0_1px_0] shadow-white/6`
- Min dimensions: `min-h-10 min-w-[21.25rem]`
- Layout: `flex items-center pl-3 pr-2 text-white`

### Button Intents (CSS Custom Properties)

| Intent      | `--button-color-bg` | `--button-color-text`         | `--button-color-border` |
| ----------- | ------------------- | ----------------------------- | ----------------------- |
| action      | `gray-700`          | `white`                       | `white/0.1`             |
| confirm     | `green-900`         | `white`                       | `white/0.1`             |
| deny        | `red-900`           | `white`                       | `white/0.1`             |
| mutedAction | `transparent`       | `gray-500` → `gray-100` hover | `transparent`           |

All buttons: `h-[1.75rem] rounded-full text-sm font-medium`, focus ring `3px`.

### Icons

Inline SVGs, 16x16, per intent:

- **info**: gray circle with "i" — `#D9D9DE`
- **success**: green circle with check — `#22C543`
- **warning**: orange circle with "!" — `#F36B16`
- **error**: red octagon with "!" — `#EF4444`

## Animations

| Animation    | Values                                                       | Reduced Motion   |
| ------------ | ------------------------------------------------------------ | ---------------- |
| Enter        | `opacity 0→1, y 64→0, blur 3px→0, scale 0.9→1` (spring 0.5s) | opacity only     |
| Exit         | `opacity 1→0, blur 0→3px` (0.2s)                             | opacity only     |
| Jiggle       | `rotate [0,-4,4,-3,3,-2,2,-1,1,0]` (tween 1s)                | skipped          |
| Blur overlay | `opacity 0→1` (spring 0.5s)                                  | skipped entirely |
| Layout       | `motion layout` for reflow                                   | kept             |

## Auto-dismiss

- Default: 3000ms
- Pause on hover
- `duration: Infinity` for persistent
- `Cmd+Enter` / `Ctrl+Enter` triggers primary action

## Accessibility

- Radix handles: `role="status"`, `aria-live="polite"`, focus management, Escape, F8
- Icon buttons: `aria-label` from `label` prop
- Action alt text for Radix: `"Press cmd + enter or ctrl + enter to trigger this action"`
- `useReducedMotion` disables decorative animations
- All SVG icons: `aria-hidden`

## Testing

| Test                                   | Verifies               |
| -------------------------------------- | ---------------------- |
| should render a toast with message     | basic rendering        |
| should render correct icon per intent  | 4 intent icons         |
| should render action button            | action slot            |
| should render confirm and deny buttons | both slots             |
| should render icon buttons             | confirmIcon/denyIcon   |
| should render muted action             | mutedAction slot       |
| should auto-dismiss after duration     | timer + removal        |
| should pause on hover                  | hover prevents dismiss |
| should not auto-dismiss with Infinity  | persistent stays       |
| should dismiss programmatically        | `toast.dismiss(id)`    |
| should update existing toast           | `toast.update(id)`     |
| should limit to 3 toasts               | 4th removes oldest     |
| should trigger jiggle on update        | jiggle state           |
| should forward ref                     | ref on Toaster         |
| should disable button when disabled    | disabled propagation   |
| should trigger action on Cmd+Enter     | keyboard shortcut      |

## Stories

| Story           | Shows             |
| --------------- | ----------------- |
| Intents         | All 4 intents     |
| WithAction      | Action button     |
| WithConfirmDeny | Confirm + deny    |
| WithIconButtons | Icon confirm/deny |
| WithMutedAction | Action + muted    |
| AutoDismiss     | 3s disappear      |
| Persistent      | Infinity duration |
| Jiggle          | Shake on update   |
| ToastLimit      | Max 3 behavior    |
