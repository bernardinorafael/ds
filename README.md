# @bernardinorafael/ds

Design System built with React 19, Tailwind CSS v4, and Radix UI.

## Installation

```bash
pnpm add @bernardinorafael/ds
```

**Peer dependencies** (React 19):

```bash
pnpm add react@^19.0.0 react-dom@^19.0.0
```

## Setup

### 1. Import the CSS

Import the stylesheet in your app's entry point. It includes all component styles, design tokens, and fonts (Suisse Intl + Söhne Mono).

```tsx
import "@bernardinorafael/ds/styles.css"
```

### 2. Wrap your app with Provider

The `Provider` is required. It sets up the icon sprite, tooltip behavior, and toast notifications.

```tsx
import { Provider } from "@bernardinorafael/ds"

import "@bernardinorafael/ds/styles.css"

export default function App() {
  return (
    <Provider>
      <YourApp />
    </Provider>
  )
}
```

### 3. Use components

```tsx
import { Badge, Button, Card, Field, Input } from "@bernardinorafael/ds"

function Example() {
  return (
    <Card background="soft" spacing="cozy">
      <Card.Header>
        <Card.Title>Create account</Card.Title>
      </Card.Header>
      <Card.Body>
        <Field label="Email">
          <Input placeholder="you@example.com" />
        </Field>
        <Button intent="primary">Submit</Button>
      </Card.Body>
    </Card>
  )
}
```

## Components

| Category     | Components                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form**     | `Input`, `Textarea`, `CurrencyInput`, `Select`, `Checkbox`, `CheckboxWithLabel`, `Switch`, `SwitchWithLabel`, `RadioGroup`, `DatePicker`, `DateRangePicker`, `Calendar` |
| **Layout**   | `Card`, `PageLayout`, `Breadcrumb`, `Tabs`, `Fieldset`, `Label`, `Field`                                                                                                |
| **Data**     | `DataGrid`, `DataGridToolbar`                                                                                                                                           |
| **Feedback** | `Badge`, `Chip`, `Spinner`, `EmptyState`, `Toaster`, `toast()`                                                                                                          |
| **Overlay**  | `Dialog`, `AlertDialog`, `Sheet`, `Dropdown`, `Tooltip`                                                                                                                 |
| **Action**   | `Button`, `IconButton`, `CopyTrigger`                                                                                                                                   |
| **Display**  | `Avatar`, `Icon`, `IconSprite`                                                                                                                                          |
| **Utility**  | `cn()`, `composeRef()`                                                                                                                                                  |

### Compound Components

`Card`, `Dialog`, `AlertDialog`, `DataGrid`, `Breadcrumb`, and `Tabs` use the compound component pattern:

```tsx
<Card background="soft" spacing="cozy">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
    <Card.Actions>
      <Button size="sm">Action</Button>
    </Card.Actions>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

### Toast

```tsx
import { toast } from "@bernardinorafael/ds"

toast("Account created successfully")
```

### Icons

Icons render via an SVG sprite injected by `Provider`. Use the `Icon` component with a valid `IconName`:

```tsx
import { Icon, IconButton } from "@bernardinorafael/ds"

<Icon name="arrow-right" size="base" />
<IconButton icon="trash" intent="destructive" aria-label="Delete" />
```

## TypeScript

All component prop types are exported:

```tsx
import type {
  ButtonProps,
  CardRootProps,
  IconName,
  SelectProps,
} from "@bernardinorafael/ds"
```

DataGrid column types from TanStack Table are re-exported:

```tsx
import type { ColumnDef, SortingState, VisibilityState } from "@bernardinorafael/ds"
```

## Design Tokens

The CSS file provides semantic tokens via Tailwind v4 `@theme`. Use these in your own components for consistency:

```css
/* Colors */
var(--color-primary)
var(--color-background)
var(--color-foreground)
var(--color-destructive)
var(--color-word-primary)
var(--color-word-secondary)
var(--color-surface-100)

/* Typography */
var(--text-sm)
var(--text-base)
var(--text-lg)

/* Radius */
var(--radius-sm)
var(--radius-md)
var(--radius-lg)

/* Shadows */
var(--shadow-xs)
var(--shadow-sm)
var(--shadow-md)
```

## Development

### Prerequisites

- Node.js v24+
- pnpm

### Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `pnpm sb`         | Start Storybook on port 6006 |
| `pnpm build`      | Type-check + build with Vite |
| `pnpm test`       | Run unit tests (Vitest)      |
| `pnpm test:watch` | Run tests in watch mode      |
| `pnpm lint`       | Check for lint errors        |
| `pnpm lint:fix`   | Auto-fix lint errors         |
| `pnpm format`     | Format all files (Prettier)  |

### Project Structure

```
src/
├── components/          # One folder per component
│   ├── button/          #   ├── button.tsx
│   ├── card/            #   ├── button.test.tsx
│   ├── ...              #   ├── button.stories.tsx
│   │                    #   └── index.ts
├── css/
│   └── index.css        # Design tokens + keyframes + fonts
├── hooks/
│   └── use-controllable-state.ts
└── utils/
    └── cn.ts            # clsx + tailwind-merge
```

### Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| UI Framework  | React 19 + TypeScript (strict)         |
| Styling       | Tailwind CSS v4 + CVA + tailwind-merge |
| Primitives    | Radix UI                               |
| Animations    | Motion + CSS @keyframes                |
| Documentation | Storybook 10 (autodocs + a11y)         |
| Testing       | Vitest 4 + Testing Library             |
| Build         | Vite 8 (library mode)                  |
| CI/CD         | GitHub Actions + Changesets            |

## License

Private — internal use only.
