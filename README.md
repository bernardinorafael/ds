## Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| UI Framework    | React 19 + TypeScript (strict mode)     |
| Styling         | Tailwind CSS v4 + CVA + tailwind-merge  |
| Primitives      | Radix UI (Dialog, Checkbox, Tooltip)    |
| Animations      | Motion (Framer Motion) + CSS @keyframes |
| Icons           | Lucide React                            |
| Documentation   | Storybook 10 (autodocs + a11y addon)    |
| Testing         | Vitest 4 + Testing Library + Playwright |
| Build           | Vite 8                                  |
| Lint/Format     | ESLint + Prettier + Commitlint + Husky  |
| Package Manager | pnpm                                    |

## Prerequisites

- **Node.js** v24+
- **pnpm** (package manager)

## Installation

```bash
pnpm install
```

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `pnpm storybook`       | Start Storybook on port 6006 (dev) |
| `pnpm build`           | Type-check (tsc) + build with Vite |
| `pnpm build-storybook` | Generate static Storybook build    |
| `pnpm test`            | Run unit tests (Vitest)            |
| `pnpm test:watch`      | Run tests in watch mode            |
| `pnpm lint`            | Check for lint errors (ESLint)     |
| `pnpm lint:fix`        | Auto-fix lint errors               |
| `pnpm format`          | Format all files (Prettier)        |

### Compound Components

`Card`, `Dialog`, and `AlertDialog` use the compound component pattern:

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

## Structure

```
src/
├── components/          # Components organized by folder
│   ├── alert-dialog/    #   ├── component.tsx
│   ├── badge/           #   ├── component.test.tsx
│   ├── button/          #   ├── component.stories.tsx
│   ├── ...              #   └── index.ts (barrel export)
├── css/
│   └── index.css        # Design tokens (@theme) + keyframes
├── hooks/
│   ├── use-controllable-state.ts  # Controlled/uncontrolled state
│   └── index.ts
├── test/
│   └── setup.ts         # Vitest + Testing Library setup
└── utils/
    └── cn.ts            # clsx + tailwind-merge
```

### File Conventions

| File                    | Content                                         |
| ----------------------- | ----------------------------------------------- |
| `component.tsx`         | Implementation with `forwardRef`, CVA, `Pick<>` |
| `component.test.tsx`    | Unit tests (Vitest + Testing Library)           |
| `component.stories.tsx` | Storybook stories (autodocs)                    |
| `index.ts`              | Barrel export                                   |
