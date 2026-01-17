# Ankit Singh Portfolio

A responsive full-stack portfolio highlighting projects, skills, and contact links. Built with Create React App, GSAP/ScrollTrigger animations, smooth scrolling via Lenis, and responsive layouts with mobile-friendly fallbacks.

## Live Preview
- Deploy on Vercel (recommended). If you have a live URL, add it here.

## Features
- Hero with contact CTAs and in-page profile lightbox
- Sections: About, Experience, Projects, Skills (orbit + mobile list), Contact CTA
- Smooth scrolling, scroll progress, and entrance animations
- Mobile-first adaptations (orbit swapped for list on small screens; custom cursor hidden on tablet/mobile)
- SOCIAL/SEO meta tags in `public/index.html`

## Tech Stack
- React (CRA)
- GSAP + ScrollTrigger
- Lenis (smooth scrolling)
- CSS (custom, no Tailwind runtime)

## Project Structure
- `src/App.js` – page layout, sections, interactions, asset helper (`process.env.PUBLIC_URL`)
- `src/App.css` – styles and responsive rules
- `public/` – static assets (Profile.jpg, icons, manifest, favicon)

## Getting Started
```bash
npm install
npm start
```
Open [portfolio](https://portfolio-vert-one-mgdn6r1zoc.vercel.app/)

## Scripts
- `npm start` – dev server
- `npm run build` – production build
- `npm test` – CRA test runner

## Deployment (Vercel)
1) Push to GitHub.
2) In Vercel: New Project → import repo.
3) Framework Preset: Create React App.
4) Build command: `npm run build`
5) Output folder: `build`
6) Root: (blank)

If deploying under a subpath (e.g., GitHub Pages), set `homepage` in `package.json` to the public URL and keep `asset('/...')` usage intact.

## Assets & Paths
Static assets are referenced via `process.env.PUBLIC_URL` (see `asset()` helper in `src/App.js`), so they resolve correctly after build on any base path.

## Contact
- Email: mmail2ankit1234@gmail.com
- LinkedIn: https://linkedin.com/in/ankit-singh-638733243
- GitHub: https://github.com/ankit2four
