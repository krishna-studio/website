# Krishna Studio website
Plain HTML, CSS and JS. No build step.

## Deploy on GitHub Pages
1. Put everything in this folder at the root of the repo (keep `.github/` and `.nojekyll`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Push to `main`. The workflow publishes the site at `https://krishna-studio.github.io/website/`.
Note: GitHub Pages on a private repo needs a paid GitHub plan, and the published site is public either way.

## Before launch
- Replace `hello@krishna-studio.example` in `contact.html` with the real email.
- Optional: add `assets/Excalifont-Regular.woff2` and uncomment the `@font-face` in `assets/style.css`.
