# Stackly — AI Solutions

Premium multi-page AI company website. Pure **HTML5 + CSS3 + Vanilla JavaScript + GSAP + ScrollTrigger + AOS** — no frameworks, no jQuery, no Bootstrap, no Tailwind.

## Quick start
Serve the folder statically (the preloader and routing need `http://`, not `file://`):

```bash
cd STACKLY-AI-SOLUTIONS
python -m http.server 8000
# open http://localhost:8000
```

## Pages
| Page | Description |
|---|---|
| index.html | 14-section homepage with cinematic GSAP hero, bento grid, horizontal showcase, stats, pricing, FAQ, blog, CTA |
| about.html | Story, philosophy, expertise, stats, leadership, CTA |
| service.html | 8 services, each with unique editorial split layout |
| blog.html | Featured article + 7 posts, categories, newsletter |
| pricing.html | 4 plans, monthly/yearly toggle with animated numbers, FAQ |
| contact.html | Info card, validated form, FAQ, CTA |
| login.html / register.html | Premium auth with USER/ADMIN role switch, validation, localStorage session |
| dashboard.html / seller-dashboard.html / admin-dashboard.html | Vanilla-canvas charts, KPIs, tables, sidebar |
| 404.html | Creative error page with working back button (`history.back()`) |

## Architecture
- `assets/css/` — style.css · animations.css · responsive.css · dashboard.css
- `assets/js/` — main.js · animations.js · navigation.js · form-validation.js · dashboard.js
- `assets/img/` — 33 unique WEBP images (avg < 35 KB, hero ~120 KB)
- `assets/svg/` + `assets/icons/` — logo, favicon, UI icons

## Features
GSAP hero timeline (preloader → nav → badges → typography → 3D cards → copy → trust), ScrollTrigger horizontal showcase, pinned parallax, magnetic buttons, 3D tilt, custom cursor + spotlight, text/mask reveals, animated counters, marquee, FAQ accordions, pricing toggle, page transitions, mobile glass menu, `prefers-reduced-motion` support, semantic HTML + ARIA, unique SEO meta per page.

## Auth (front-end demo)
Login/register store `stackly_user` in localStorage and route USER → dashboard.html, ADMIN → admin-dashboard.html. Dashboards read the profile back from localStorage. No backend required.

## Imagery
All photography sourced from license-friendly (Unsplash / free-stock) providers, re-processed to optimized WEBP. No watermarked stock previews, no copyrighted artwork.
