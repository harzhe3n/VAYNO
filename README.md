# VAYNO website

Lightweight, responsive agency website with a Node.js inquiry endpoint. Each project in the portfolio opens a "See how it works" window that walks through the client’s website and admin panel with screenshots.

The brand is rooted in Kurdistan: **V**ision, **A**mbition, **Y**outh, **N**ew generation, and **O**ptimism.

## Design

A bright, dreamlike world in the two greens of the VAYNO logo, a white navbar and heavy Manrope type. Everything moves, and all of it is drawn in code, with no photos:

- **Background:** an emerald sky with soft white clouds over famous Kurdish places (Erbil Citadel with its gate, the Choli Minaret, a Hawraman village, old town houses, gates and domes) standing in still water that mirrors it with a slow ripple. The buildings stand at three depths that pan at different speeds as the slides move, so the visitor travels through the world. Past the first slide the view tilts up a little, so there is more sky behind the text. Erbil Citadel keeps its natural sandy-brick colour; the golden Kurdish sun turns slowly in the sky. Arabic and Kurdish see the world mirrored. The waterlines are set in `styles.css` (`--horizon` for the first slide, `--horizon-inner` for the rest).
- **Hero:** the headline types its last word ("We build websites", "web apps", "online stores"…). Beside it a glossy dark orb, with liquid green light turning inside, floats over the water with its reflection below; its switch flips on when it is hovered, and pressing it opens the contact slide.
- **Quick links:** two green buttons on the edge of the screen lead to the projects and the contact form. They show their labels on the first slide and fold to icons on the others.
- **Buttons:** a light circles each main button; on hover a white fill sweeps across, the label rolls and the arrow travels.
- **Between slides:** the old slide turns away in 3D while the next turns in, both with a sideways motion blur. One scroll or swipe changes the slide; every slide fits the window on computers, so nothing scrolls first.
- **Details:** each slide's number is outlined in the background, section titles light their last word green, service icons draw themselves, and project discs glow.

Visitors whose system asks for reduced motion get a still page. Any image placed in `assets/` (JPG, PNG, WebP, GIF or SVG) is served automatically.

## Languages

The site is in English, Arabic (العربية) and Kurdish Sorani (کوردی). Visitors switch with the EN · عربي · کوردی control in the navbar; the choice is remembered, and a first visit follows the browser's language. Arabic and Kurdish read right to left, so the layout mirrors and the slides run the other way. The name VAYNO and the value letters V-A-Y-N-O always stay in Latin letters.

All translated text lives in `i18n.js`. Text written in `index.html` carries a `data-i18n` key (or `data-i18n-html` / `data-i18n-attr`); add the Arabic and Kurdish wording for a new key there. Projects and team profiles are written in English in `data/site-content.json`. Their Arabic and Kurdish versions live in the `content` section of `i18n.js`, matched by the exact English wording; text without a translation is shown in English. Have a native speaker review the Arabic and Kurdish copy before launch.

## Local setup

1. Install Node.js 20 or newer.
2. In this directory, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` to receive inquiries in Telegram. Optionally, also set `AGENCY_EMAIL`, `FROM_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` to receive them by email too. Use an email address authorized by your SMTP provider for `FROM_EMAIL`.
5. Add your projects and your public email, WhatsApp, Instagram, and TikTok details to `data/site-content.json` (see [Editing content](#editing-content)).
6. Run `npm start`, then open `http://localhost:3000`.

`SMTP_SECURE=true` is normally used with port 465. For a STARTTLS connection on port 587, use `SMTP_SECURE=false`. Keep `.env` private; it is ignored by Git. The example file contains no credentials.

The server binds to `127.0.0.1` by default for local development. In a hosted environment, set `HOST=0.0.0.0` only when the application is protected by the platform's HTTPS ingress or reverse proxy.

Inquiry form submissions are validated on the server and sent to every configured channel: the Telegram chat, and email if SMTP is set up. A reference number is returned only after at least one channel accepts the message; a failed channel is logged in the terminal. Long project descriptions are split across several Telegram messages. The site does not store inquiry data in a database. With neither Telegram nor SMTP configured, the endpoint responds with an error and does not show a success confirmation.

## Editing content

Projects, team profiles, and contact links all live in `data/site-content.json`. Edit the file, save it, and reload the page; the server reads it on every request, so there is no need to restart. The file has three parts:

```json
{
  "projects": [
    {
      "name": "Project name",
      "category": "Website development",
      "imageUrl": "https://example.com/photo.jpg",
      "portfolioUrl": "https://example.com",
      "tags": ["Web design", "Branding"],
      "details": {
        "summary": "What the project does, in two or three sentences.",
        "sections": [
          { "group": "site", "title": "Home page", "text": "What customers can do here.", "image": "/assets/projects/example/home.jpg" },
          { "group": "admin", "title": "Orders", "text": "What the owner manages here.", "image": "/assets/projects/example/orders.jpg" }
        ]
      }
    }
  ],
  "team": [
    {
      "name": "Full name",
      "role": "Designer",
      "description": "A short biography.",
      "photoUrl": "https://example.com/portrait.jpg",
      "portfolioUrl": "https://example.com"
    }
  ],
  "contact": {
    "email": "hello@example.com",
    "whatsappNumber": "9647501234567",
    "instagramUrl": "https://www.instagram.com/vayno",
    "tiktokUrl": "https://www.tiktok.com/@vayno"
  }
}
```

- **Projects**: up to 40. `name` and `category` are required; `tags` is a list of up to 8 (it can be empty, `[]`). `imageUrl` is the disc artwork and `portfolioUrl` the live site; either can be left as `""`.
- **Project details** (optional) add the "See how it works" button. `sections` is a list of up to 16 screenshots, each with a `title`, a short `text` and an `image`; `group` is `"site"` for what customers see or `"admin"` for the admin panel. Screenshots look best at 1280 × 800. Blur customer names, phone numbers, emails and revenue before adding an admin screenshot.
- **Team**: up to 30. `name`, `role`, and `description` are required. Leave the list empty (`"team": []`) until the team supplies real details.
- **Contact**: any field can be left as `""`, and the site hides that link. `whatsappNumber` is digits only, 8–15 of them, starting with the country code (no `+` or spaces).
- **Links and photos** must start with `https://`. Photos can also be a local image such as `/assets/projects/example/home.jpg`: put the file in `assets/` and write its path. Browsers keep images for a week, so when you replace a picture, save it under a new file name.

If the file has a mistake (a missing comma, a required field left empty, a link without `https://`), the projects section shows "Projects are temporarily unavailable", the contact links are hidden, and the terminal running `npm start` prints what is wrong. Back up this file with the site.
