# Publicando o Design System no npm

Guia passo-a-passo para publicar o pacote no npm registry.

## Pre-requisitos

- Conta no [npmjs.com](https://www.npmjs.com)
- Node.js v24+ e pnpm instalados
- Autenticado no npm via CLI (`npm login`)

## 1. Configurar o package.json

O `package.json` precisa de campos obrigatorios para publicacao. Ajuste os valores conforme o projeto:

```jsonc
{
  "name": "@domingo/ds", // escopo da org (precisa existir no npm)
  "version": "0.0.1",
  "description": "Domingo Design System",
  "license": "MIT",
  "private": false, // REMOVER ou setar false (hoje esta true)
  "type": "module",
  "files": ["dist"], // so publica a pasta dist
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts",
    },
    "./styles.css": "./dist/styles.css",
  },
  "sideEffects": ["**/*.css"],
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
  },
}
```

> **Nota**: `react` e `react-dom` devem ser `peerDependencies`, nao `dependencies`. Quem consome o DS ja tem o React instalado.

## 2. Configurar o build de biblioteca

Vite tem um modo de biblioteca (`lib mode`). Instale o plugin para gerar tipos:

```bash
pnpm add -D vite-plugin-dts
```

Crie ou ajuste o `vite.config.ts` com a config de build:

```ts
import { resolve } from "node:path"

import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  // ... plugins e config existente
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  plugins: [
    // ... plugins existentes (react, tailwindcss)
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.*", "src/**/*.stories.*", "src/test/**"],
    }),
  ],
})
```

## 3. Criar o entrypoint

Crie `src/index.ts` exportando todos os componentes:

```ts
export { Button } from "./components/button"
// futuros componentes aqui
```

## 4. Ajustar o script de build

No `package.json`, confirme que o script de build gera a pasta `dist`:

```json
{
  "scripts": {
    "build": "tsc -b && vite build"
  }
}
```

## 5. Testar o build localmente

```bash
pnpm build
```

Verifique a pasta `dist/`:

- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (tipos)
- `styles.css` (Tailwind compilado)

## 6. Testar localmente antes de publicar

Use `pnpm pack` para gerar um tarball e instalar em outro projeto:

```bash
# no DS
pnpm pack

# no projeto consumidor
pnpm add ../ds/domingo-ds-0.0.1.tgz
```

Valide que os imports e estilos funcionam corretamente.

## 7. Criar conta/org no npm (se ainda nao tiver)

```bash
# criar conta
npm adduser

# ou apenas logar
npm login

# verificar quem esta logado
npm whoami
```

Se usar escopo (`@domingo/ds`), crie a org em https://www.npmjs.com/org/create.

## 8. Publicar

```bash
# primeira publicacao com escopo precisa ser publica
pnpm publish --access public

# publicacoes subsequentes
pnpm publish
```

## 9. Versionamento

Siga [semver](https://semver.org):

| Tipo de mudanca | Comando              | Exemplo        |
| --------------- | -------------------- | -------------- |
| Bug fix         | `pnpm version patch` | 0.0.1 -> 0.0.2 |
| Nova feature    | `pnpm version minor` | 0.1.0 -> 0.2.0 |
| Breaking change | `pnpm version major` | 1.0.0 -> 2.0.0 |

```bash
# bump version, commit e tag
pnpm version patch

# publicar
pnpm publish
```

## 10. Checklist antes de cada release

- [ ] Todos os testes passando (`pnpm test`)
- [ ] Lint sem erros (`pnpm lint`)
- [ ] Build sem erros (`pnpm build`)
- [ ] Testado localmente com `pnpm pack` em projeto consumidor
- [ ] Version bump aplicado (`pnpm version <patch|minor|major>`)
- [ ] CHANGELOG atualizado (se houver)

## Consumindo o pacote

No projeto consumidor:

```bash
pnpm add @domingo/ds
```

```tsx
import { Button } from "@domingo/ds"

import "@domingo/ds/styles.css"
```

> O projeto consumidor e responsavel por carregar as fontes (Inter) e configurar o Tailwind CSS v4.
