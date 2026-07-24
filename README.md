# Portfolio — Ashish Bhatt

Personal portfolio built with **Angular 21** (standalone components), deployed to **GitHub Pages** via CI/CD.

## Features

- **Interactive particle background** — canvas-based animation responding to mouse movement
- **Dark/light theme** — persists preference in `localStorage`, respects `prefers-color-scheme`
- **Resume viewer** — inline PDF viewer (`ng2-pdf-viewer`) with zoom & download; separate theme-aware PDFs
- **Responsive navbar** — Lucide icons, smooth-scroll navigation, bounce animation on section targets
- **Tooltips** — smart positioning that adapts to viewport edges
- **Media fallback** — graceful degradation for missing video/image assets
- **Projects showcase** — card grid with video/image previews, descriptions, and external links
- **Tech stack display** — Iconify skill icons with tooltips

## Stack

| Category | Technologies |
|---|---|
| Framework | Angular 21, TypeScript |
| Styling | CSS custom properties, JetBrains Mono, Poppins |
| Icons | Iconify, Lucide |
| Animation | GSAP, CSS keyframes |
| PDF | ng2-pdf-viewer |
| Deployment | GitHub Actions → GitHub Pages |

## Projects featured

- **CiteCat** — Django + PyTorch content similarity detector
- **Noteapp** — Django + Tailwind note-taking app
- **Storefront** — ecommerce with cart & checkout
- **PDF Annotator** — annotation tool for PDF documents

## Scripts

```bash
pnpm start        # ng serve — dev server at localhost:4200
pnpm build        # ng build — production build to dist/
pnpm test         # ng test — Karma unit tests
pnpm deploy       # ng deploy — deploy to GitHub Pages
```

## Deploy

Pushes to `main` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) which builds and publishes to the `gh-pages` branch via `JamesIves/github-pages-deploy-action`.

The live site is hosted at `https://zzzastro.github.io/portfolio/`.