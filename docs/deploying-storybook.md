# Deploy do Storybook

Guia para publicar o Storybook como site estatico, servindo de documentacao viva do Design System.

## Build estatico

O Storybook gera um site estatico pronto para deploy:

```bash
pnpm build-storybook
```

Isso cria a pasta `storybook-static/` na raiz do projeto. Esse diretorio contem HTML, CSS e JS — basta servir como site estatico em qualquer plataforma.

> **Nota**: A pasta `storybook-static/` ja esta no `.gitignore`. Nao commite ela.

## Opcao 1: Chromatic (recomendado)

O projeto ja usa `@chromatic-com/storybook` como addon. O Chromatic e a plataforma oficial do Storybook para deploy, visual testing e review de UI.

### Setup

1. Crie uma conta em [chromatic.com](https://www.chromatic.com) e conecte o repositorio
2. Copie o **project token** gerado

### Deploy manual

```bash
pnpm add -D chromatic
npx chromatic --project-token=<TOKEN>
```

### Deploy via CI (GitHub Actions)

Crie `.github/workflows/chromatic.yml`:

```yaml
name: Chromatic

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

Adicione `CHROMATIC_PROJECT_TOKEN` nos secrets do repositorio (Settings > Secrets > Actions).

Cada push gera um link unico com o Storybook publicado. PRs recebem um comentario automatico com o link e diff visual.

## Opcao 2: Vercel

### Setup

1. Importe o repositorio em [vercel.com](https://vercel.com)
2. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build-storybook`
   - **Output Directory**: `storybook-static`
   - **Install Command**: `pnpm install --frozen-lockfile`

Cada push na `main` faz deploy automatico. PRs geram preview deploys.

### Via CLI

```bash
pnpm add -D vercel
npx vercel --prod
```

## Opcao 3: GitHub Pages

### Via GitHub Actions

Crie `.github/workflows/storybook.yml`:

```yaml
name: Storybook to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm build-storybook

      - uses: actions/upload-pages-artifact@v3
        with:
          path: storybook-static

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Ative o GitHub Pages no repositorio: Settings > Pages > Source: **GitHub Actions**.

O Storybook ficara disponivel em `https://<org>.github.io/<repo>/`.

## Opcao 4: Netlify

### Setup

1. Importe o repositorio em [netlify.com](https://www.netlify.com)
2. Configure:
   - **Build Command**: `pnpm build-storybook`
   - **Publish Directory**: `storybook-static`

### Via CLI

```bash
pnpm add -D netlify-cli
npx netlify deploy --prod --dir=storybook-static
```

## Comparativo

| Plataforma   | CI automatico | Preview por PR | Visual testing | Custo              |
| ------------ | ------------- | -------------- | -------------- | ------------------ |
| Chromatic    | Sim           | Sim            | Sim            | Free tier generoso |
| Vercel       | Sim           | Sim            | Nao            | Free tier generoso |
| GitHub Pages | Via workflow  | Nao            | Nao            | Gratis             |
| Netlify      | Sim           | Sim            | Nao            | Free tier generoso |

## Checklist antes do deploy

- [ ] Build do Storybook sem erros (`pnpm build-storybook`)
- [ ] Todas as stories renderizando corretamente (`pnpm storybook`)
- [ ] Testes passando (`pnpm test`)
- [ ] Lint sem erros (`pnpm lint`)
