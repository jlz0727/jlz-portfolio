# John Lord Zambrano — Portfolio

A single-page, light-themed editorial portfolio built with **vanilla HTML, CSS, and JavaScript**. No frameworks, no build step.

## Features
- Clean, editorial design inspired by Tomasz Gajda-style portfolios
- Sticky nav with smooth-scroll anchors + mobile hamburger
- Hero with large display type, subtitle, social icons
- About with definition-list metadata
- Skills grid with "Using Now" / "Learning Next" sections and real brand icons
- Project cards with devicon tech tags
- **Clickable certification cards** that open your real certificate in a **lightbox**
- Two scheduling modals (Meeting / Interview) wired to **EmailJS**
- Floating **AI chatbot** powered by **Google Gemini 1.5 Flash**
- Scroll-reveal animations (IntersectionObserver), reduced-motion safe
- Resume PDF download from the nav

## File structure
```
portfolio/
├── index.html
├── style.css
├── script.js              # nav, modals, reveals, cert lightbox
├── chatbot.js             # Gemini FAQ bot (+ local fallback)
├── emailjs-handler.js     # scheduling modal email dispatch
├── assets/
│   ├── john-lord-zambrano-resume.pdf
│   ├── favicon.ico
│   └── certificates/
│       ├── cisco-network-defense.jpg
│       ├── cisco-network-support-security.jpg
│       ├── cisco-intro-cybersecurity.jpg
│       ├── isc2-certified-in-cybersecurity.jpg
│       ├── stellar-unitour-blockchain.jpg
│       └── htb-cybersecurity-fundamentals.jpg
└── README.md
```

## Quick start
1. Drop your resume into `assets/john-lord-zambrano-resume.pdf`.
2. Drop your certificate images into `assets/certificates/` (see names above).
3. Open `index.html` in a browser — everything works immediately.

## Configure EmailJS (scheduling)
1. Create a free account at [emailjs.com](https://www.emailjs.com/).
2. Add an Email Service and note the **Service ID**.
3. Create two templates:
   - Meeting → `template_69odoxo`
   - Interview → `template_emhb2fg`
4. Copy your **Public Key** (Account → API Keys).
5. Open `emailjs-handler.js` and set:
   ```js
   const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
   ```

## Configure the AI chatbot (Gemini)
1. Get a free API key at [aistudio.google.com](https://aistudio.google.com/).
2. Open `chatbot.js` and set:
   ```js
   const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
   ```
3. Save. The bot answers via Gemini using a strict system prompt grounded in John's facts.

## Certification images
Place your certificate screenshots/scans in `assets/certificates/` with these exact filenames:

| Filename | Certification |
|---|---|
| `cisco-network-defense.jpg` | Cisco Network Defense |
| `cisco-network-support-security.jpg` | Cisco Network Support & Security |
| `cisco-intro-cybersecurity.jpg` | Cisco Introduction to Cybersecurity |
| `isc2-certified-in-cybersecurity.jpg` | ISC2 Certified in Cybersecurity (CC) |
| `stellar-unitour-blockchain.jpg` | Stellar UniTour Bootcamp — Blockchain |
| `htb-cybersecurity-fundamentals.jpg` | HTB Cybersecurity Fundamentals |

Supported formats: `.jpg`, `.png`, `.webp`

## Deploy
Static files — host anywhere:
- **GitHub Pages** — push to a repo, enable Pages on `main` branch root
- **Netlify / Vercel** — drag-and-drop the folder, or connect the repo

## Customization
| Change | File | Look for |
|---|---|---|
| Colors | `style.css` | `:root` variables (`--bg`, `--ink`, `--accent`, etc.) |
| Projects | `index.html` | `<!-- PROJECTS -->` |
| Certifications | `index.html` | `<!-- CERTIFICATIONS -->` |
| Cert images | `assets/certificates/` | Rename files to match `data-cert` attributes |
| Bot facts | `chatbot.js` | `SYSTEM_PROMPT` |
| Quick prompts | `chatbot.js` | `QUICK_PROMPTS` |

---

© 2025 John Lord G. Zambrano · Built with care.
