# Narsil — Ad Website Build Prompt

> **What this is:** a complete brief for an AI coding agent to design and build Narsil's ad website, a slide-style "exhibition" whose one job is to get visitors to download the iPhone app.
>
> **How to use it**
> - **Claude Code or Cursor (recommended):** open `E:\Project-dev` and say: *"Read AD-WEBSITE-PROMPT.md and build the site it describes, one milestone at a time (§17)."* With access to the repos, the agent can use the app's real colours, copy and artwork.
> - **v0, Lovable or Bolt:** paste this file, upload the assets listed in §11, and use Vite + React in place of Astro (§10).
>
> Every product fact here was checked against the code and `APPLE-REVIEW.md` on **27 Oct 2026**. Anything marked **(verify)** must be confirmed before launch.

**Contents:** 0 Mission · 1 Context · 2 Claims · 3 Big idea and voice · 4 Design system · 5 Slide system · 6 Slide-by-slide spec · 7 Download links · 8 Campaign variants · 9 Share loop · 10 Tech stack · 11 Assets · 12 Performance · 13 Accessibility · 14 SEO and social · 15 Analytics · 16 Legal and support · 17 Milestones · 18 QA and definition of done · Appendices A–C

---

## 0. Mission

You are a world-class creative developer and conversion designer. Build **the best app-download website in the world** for **Narsil**, a free iPhone app that puts public-domain masterpieces in a full-screen feed, gives every work a museum placard, and judges your eye in a daily art quiz.

"Best" is measurable. The site must be all four at once:

1. **Clear in 5 seconds.** Someone arriving from an Instagram ad knows what Narsil is, that it's free, and where to get it, before they scroll.
2. **Unforgettable.** Award-level art direction: a museum at night, gold light, real masterpieces, and motion that feels expensive and never gets in the way.
3. **Built to convert.** A download link is always one tap away, every slide ends on one, and every click is credited to the ad that brought the visitor.
4. **Fast and honest.** First view in under 2 seconds on a mid-range phone inside an in-app browser. Every claim is true (§2).

### Working rules
- Read the files in §1.4 before writing code. Use the app's real tokens, words and assets. Don't invent a new brand.
- Never invent facts, numbers, testimonials, ratings, press logos or user counts. If you want to say something that isn't in §1.2, ask first.
- Ask before you deploy to production, connect a domain, edit `museum-app/` or `narsil-legal/`, run SQL in Supabase, or add any third-party script.
- Work through the milestones in §17. After each one, run the build and show screenshots at 390×844 and 1440×900.

---

## 1. Context

### 1.1 Narsil in one paragraph
Narsil is "a digital museum in your pocket" (the line on the current public site). It shows public-domain and CC0 artworks from museum open-access collections in a full-screen feed. Tap a title to read the work's story. Learn art history age by age in Discover. Play the daily **Royal Assessment** quiz to earn points, climb seven ranks and compete in the Halls. Order canvas and poster prints, shipped to US addresses. An optional subscription, **The Explorer's Guild**, unlocks endless practice, every trial and full-size downloads.

### 1.2 Facts you may use

| Area | Fact | Source |
|---|---|---|
| Platform | iPhone app, bundle id `com.narsil.museum`. Free to download **(verify the price tier)** | `museum-app/capacitor.config.ts` |
| Catalog | 19,362 works on 24 Oct 2026: The Met 5,418 · Cleveland Museum of Art 5,118 · Wellcome Collection 5,061 · Rijksmuseum 3,765. Only CC0 or public-domain images. Say **"nearly 20,000"** | `APPLE-REVIEW.md` |
| Feed (the "Narsil" tab) | Full-screen, personalised, **no ads**. Swipe up or down: next work. Tap the title: open the placard. Swipe left: the artist's profile. Swipe right: fill the frame. Press and hold: clean view (interface hidden). Side rail: artist, like, save, comment, download | `TutorialCoach.tsx`, `museum-app/README.md` |
| Placard | Title, artist, date, place and the story of the work | `HistoryPlacard.tsx` |
| Discover | A timeline of 9 ages: Ancient Egypt (3100–30 BC), Greek & Roman Antiquity, Medieval & Byzantine, Renaissance, Baroque & Dutch Golden Age, Romanticism & Edo, Modern Masters (1850–1910), Modern Art, Contemporary. Also empires (Egyptian, Greek, Roman) and artist profiles. Free with an account; guests are asked to sign in | `src/data/history.ts` |
| Royal Assessment | Daily quiz, 10 questions by default **(verify in Admin → Quiz)**, generated fresh every night. Points for correct, fast and consecutive answers, plus a bonus for a perfect day. Each result gets a verdict, from "Exiled to the Wastelands" to "Ascended to the Throne" (Appendix C) | `worldCopy.ts`, `lib/quiz/levels.ts` |
| Levels | 7 ranks by total points: Peasant, Scholar, Archivist, Master Archivist, Grand Archivist, High Archivist, Royal Archivist. Each rank has its own heraldic frame | `lib/quiz/levels.ts`, `public/person-levels/` |
| Trials and Seals | Every age and empire has 3 trials: Apprentice, Scholar, Master. Score 100% to earn its seal ("Only a flawless appraisal claims this seal."). Ancient Egypt is free; the rest need the Guild | `worldCopy.ts`, `TutorialCoach.tsx` |
| Halls | Hall of [your rank]s (today, same level) · Monthly Hall (all levels) · Discover Hall (best trials) | `lib/quiz/halls.ts` |
| Practice | "Uncharted Archives": 5 questions a round for free members, endless with the Guild | `ProPaywall.tsx` |
| Reminders | Opt-in daily quiz and streak reminders (push) | `museum-app/README.md` |
| Vault | Saved works | `museum-app/README.md` |
| Prints (the "Gallery" tab) | Canvas $59 / $89 / $129 and posters $29 / $35 / $45, in 12×16, 18×24 and 24×36 in. Some works cost $5 or $10 more. Shipping and tax are included in the price shown. US addresses only. Paid in the app with Apple Pay or card. Live prices: `GET https://d2lvgalchu2nps.cloudfront.net/api/prices` | `src/data/shop.ts`, `APPLE-REVIEW.md` |
| The Explorer's Guild | Optional Apple in-app subscription, monthly and annual **(verify)**. Perks: (1) Uncharted Archives, endless practice; (2) every age and empire trial beyond Ancient Egypt; (3) Master Files, the largest file the museum publishes (free downloads stop at 2,000 px); (4) uploading your own art in Create, reviewed before it's published **(mention only if Create ships at launch)**. The App Store sets the price | `ProPaywall.tsx`, `museum-app/README.md` |
| Accounts | No account needed to start (guest mode). Sign in with Apple or Google to sync saves, levels and progress. Account deletion is in Profile | `APPLE-REVIEW.md` |
| Sharing | Shared links show the painting as a preview in iMessage and WhatsApp and open the app | `museum-app/README.md` |
| Web app | `https://narsil-app-frontend.vercel.app` (fallback only, §7) | deployment notes |
| Contact | `narsil.business@gmail.com` | `narsil-legal/index.html` |

### 1.3 Who the site talks to

| Audience | What they want | Where they come from |
|---|---|---|
| Curious scrollers, 18–40 | A better scroll: beautiful, quick, a little smarter | Instagram, TikTok, Pinterest ads |
| Art and history lovers, 25–65 | Depth: stories, eras, artists | Search, Facebook, newsletters |
| Quiz and streak players | Competition, ranks, a daily ritual | Social ads, shared verdicts |
| Gift and home-decor buyers (US) | A famous painting on their wall | Pinterest and Meta ads |

Primary market: the United States, English, iPhone owners. Most visitors will be on phones, often inside the Instagram, TikTok or Facebook in-app browser. Design for that first.

### 1.4 Read these first (if you have repo access)

| File | What to take from it |
|---|---|
| `museum-app/src/index.css` | Colour tokens, fonts, shadows and animations (`@theme`) |
| `museum-app/index.html` | The "Royal Gold" splash: spotlight gradient, crest glow, gilt rule, gold sweep |
| `museum-app/src/data/worldCopy.ts` | The app's vocabulary and the verdict copy |
| `museum-app/src/components/TutorialCoach.tsx` | Gesture names and wording |
| `museum-app/src/components/ProPaywall.tsx` | Guild perks (but not the word "uncompressed", §2.1) |
| `museum-app/src/lib/quiz/levels.ts`, `halls.ts` | Rank titles, points, Hall names |
| `museum-app/src/data/history.ts` | Ages, years and descriptions |
| `museum-app/src/data/shop.ts` | Print sizes and fallback prices; `mergeSizes` shows the shape of `/api/prices` |
| `museum-app/src/components/Icons.tsx` | Icon style (reuse these SVGs) |
| `museum-app/public/` | Crest, app icon, level frames, parchment and hall art (§11) |
| `narsil-legal/index.html`, `privacy.html`, `terms.html` | The current public site and legal pages. Its colours (`#0a0a0b`, `#c9a227`) are older; follow the app's |
| `APPLE-REVIEW.md` | Claims that would be false or get rejected (summarised in §2.1) |

---

## 2. Claims: what the site may and may not say

Anything in §1.2 is safe to say. The rest of this section is not optional: an ad site that over-promises gets its ads rejected, causes trouble in App Review and loses trust.

### 2.1 Never say

| Don't say | Why | Instead |
|---|---|---|
| "living artists", "freelance originals", "artist originals" | No freelance artists are live yet (APPLE-REVIEW #27) | Leave artists out until real artists are live |
| "uncompressed" Master Files | Not accurate (#9) | "the largest file the museum publishes" |
| "Early access to new collections and features" | Doesn't exist (#25) | — |
| "20% off canvas" or any subscriber discount | Removed on 27 Sep 2026 (#29) | — |
| "Buying a print supports the museum(s)" | The museums receive nothing (#28) | "supports Narsil" |
| "curator notes", "written by museum curators" | Many descriptions are AI-assisted summaries (#26) | "the story behind each work" |
| "Claim your treasure", prizes, rewards | No prizes exist | — |
| iPad, Mac, Apple Vision Pro | The device decision is still open (#30) | "iPhone" |
| Android or Google Play | No Play listing is confirmed | Only when `googlePlayUrl` is set (§7) |
| Quiz battles, teams, world battle, coins | Ideas only, not built | — |
| Specific question styles (year slider, zoom reveal, timeline…) | Built, but each style is switched on separately | Name a style only after confirming it's live in Admin → Quiz |
| A free trial or its length | Only if an introductory offer is set in App Store Connect (#5) | Mention it only when the client confirms |
| Delivery times | Not defined yet (#24) | — |
| "museum-quality", "archival", materials or thickness | Not confirmed from Printful's product pages | Ask the client |
| Ratings, reviews, testimonials, "loved by X users", press logos, "#1", "award-winning" | None exist; inventing them is false advertising | §2.2 |

### 2.2 Social proof: real or nothing
- Use the proof that exists: the catalog size, the museum sources, and the experience itself (the quiz on the page).
- App Store rating: build a slot that stays hidden until the client fills `SITE.rating` with real numbers (suggested: 4.5 stars from 50+ ratings).
- Press quotes and logos: only real coverage, used with permission.
- Never use stock photos of "users", invented names, or counters like "12,000 players today".

### 2.3 Image rules
- Use only works the source museum marks CC0 or public domain: The Met Open Access, the Cleveland Museum of Art Open Access, the Rijksmuseum. Prefer works already in Narsil's catalog (query the Supabase `artworks` table). Self-host every image; never hotlink.
- Keep Wellcome images out of the hero, the ads and the print preview: many are medical images, and they aren't sold as prints.
- Skip Wikimedia photos of works held by museums that don't publish CC0 (for example *The Starry Night*, MoMA). The app may show some; the ad site shouldn't.
- No nudity and no gore anywhere on the site. Ad networks review landing pages, and the App Store listing has to suit a 4+ rating.
- No museum logos, and nothing that implies a museum endorses Narsil (footer disclaimer, §6).
- Record every work in `src/content/artworks.json`: title, artist, date, museum, accession number, license and source URL. The /credits page is generated from it.
- Device frames are Apple's official bezels, and their screens show real recordings of the real app. Never draw a fake interface.

---

## 3. The big idea and voice

### 3.1 Concept: "The museum never closes."
The site is a museum after hours. The nine slides are nine **rooms**, numbered I to IX. Each room shows one idea, under gold light, with a placard. You come in through the entrance (the hero), walk through the endless gallery and its stories, travel the ages, face the royal court's quiz, climb the ladder of ranks, pass through Acquisitions (prints) and the Guild hall, and leave through the doors with the app.

### 3.2 Signature moments
These are what people remember and share. Each one must be excellent.
1. **The wall and the phone.** Desktop hero: an iPhone in a spotlight, playing the real feed, in front of a gilt-framed painting on a dark wall. The painting on the wall changes in step with the phone.
2. **Press and hold.** Visitors press and hold the phone to see the app's clean view, the same gesture as in the app.
3. **The verdict.** A 5-question Royal Assessment on the page. A wax seal stamps down the court's theatrical verdict ("Placed in the Stocks", "Knighted by the Crown"), ready to share.
4. **The ladder.** Seven heraldic frames climb from Peasant to Royal Archivist as you scroll.
5. **True scale.** Pick a painting and a size, and see it at real scale on a living-room wall next to a sofa.

### 3.3 Voice: regal wit, plain promise
- Headlines speak like the royal court: confident, a little theatrical, at most 9 words.
- The line under every headline states the plain benefit in everyday English, at most 30 words.
- Use the app's words (Vault, Acquire, Royal Assessment, Trials, Seals, Halls, Explorer's Guild) and explain each one the first time it appears.
- Calm confidence: no exclamation marks, no "revolutionary", no emoji. Small-caps eyebrows are fine; shouting isn't.
- Never mention Tolkien or *The Lord of the Rings* (see the trademark note in Appendix A).

### 3.4 Three tests for every slide
1. **5-second test:** a stranger can say what the slide is about.
2. **Squint test:** blur your eyes; the headline and the CTA still stand out.
3. **"So what?" test:** the line under the headline answers "what do I get?".

---

## 4. Design system

Inherit the app's look. These tokens come straight from `museum-app/src/index.css` and the splash in `museum-app/index.html`.

### 4.1 Colour

| Token | Value | Use | Contrast on `ink` |
|---|---|---|---|
| `ink` | `#14100e` | Page background (also `theme-color`) | — |
| `ink-soft` | `#1f1915` | Cards, placards, raised surfaces | — |
| `umber` | `#3a2e24` | Hairlines, borders, dividers | — |
| `canvas` | `#f4efe6` | Headlines, primary text | 16.5 : 1 |
| `canvas-muted` | `#e4d9c8` | Body text | 13.6 : 1 |
| `stone` | `#a89880` | Captions, placard details | 6.7 : 1 |
| `accent` (gold) | `#c4a574` | CTAs, active states, key words | 8.1 : 1 (ink text on gold: 8.1 : 1) |
| `accent-deep` | `#9a7b4a` | Hover and pressed states, decoration | 4.8 : 1, large text only |
| `gilt-light` | `#f7dfa0` | Eyebrows, display highlights | 14.4 : 1 |
| `gilt-glow` | `#d9a441` | Glows, gilt rules | — |
| `gilt-bright` | `#f4d78a` | Sparkle highlights | — |
| `oxblood` | Sample it from `public/person-levels/level-7.png` | Wax seals, wrong answers, rare accents | Check each use |

Gradients and effects (copy them exactly):
- **Spotlight** (hero and final slide): `radial-gradient(circle at 50% 20%, #39271b, #160f0c 55%, #0d0907)`
- **Gilt rule** (1 px line under eyebrows): `linear-gradient(90deg, transparent, #d9a441, transparent)`
- **Gold foil** (progress fill and seal rims, never text): `linear-gradient(90deg, #6d4613, #d99c2b, #fff0aa, #b77516)`
- **Crest glow:** `filter: drop-shadow(0 0 22px #d9a44140)`

The site is dark only, like the app (`color-scheme: dark`). Saturated colour comes from the artworks, never from the interface.

### 4.2 Type

| Role | Font | Style |
|---|---|---|
| Display (h1, h2) | Playfair Display 600 | Sentence case, line-height 1.02–1.1, letter-spacing −0.01em. h1 `clamp(2.75rem, 1.4rem + 6vw, 6.5rem)`; h2 `clamp(2.25rem, 1.2rem + 4.2vw, 4.75rem)`. One word per headline may be italic (Playfair 500 italic) |
| Eyebrow / room label | Playfair Display 500 | Uppercase with letter-spacing 0.42em (the splash's "REGIA ET ARS" style), 12–13 px, `gilt-light`, gilt rule below. Write it in sentence case in `copy.ts` and uppercase it with CSS, so screen readers read words, not letters |
| Wordmark | Inter 600 | "NARSIL", uppercase, letter-spacing 0.28em, 12 px (as on narsil-legal) |
| Body | Inter 400 / 500 | 17 px on phones, 19 px on desktop, line-height 1.6, `canvas-muted`, at most 60 characters per line |
| Placard | Inter 400; Playfair 600 italic for titles | 13–15 px; details in `stone` |
| Numbers | Inter with `font-variant-numeric: tabular-nums` | Prices and scores. Room numbers are Roman numerals in Playfair |

Self-host both fonts (§12). Don't load them from Google Fonts.

### 4.3 Layout
- 8 px spacing base. Side gutter 16 px on phones (20 px from 390 px wide), 48 px on desktop.
- Desktop: 12-column grid, content at most 1,240 px wide.
- Radii as in the app: 16 px for cards, 24 px for sheets, full pills for buttons.
- Shadows from the app: `--shadow-placard: 0 -20px 60px -15px rgba(20,12,8,.55)` and `--shadow-rail: 0 8px 30px rgba(20,12,8,.3)`.
- Tap targets at least 44×44 px.

### 4.4 Motifs and components
- **Gilt frame:** an artwork inside a thin gold border (1 px `accent`, an inner shadow and a soft outer glow). Elegant, not ornate. The ornate PNG frames are only for the Ladder slide.
- **Placard:** the museum label. An `ink-soft` card with a 1 px `umber` border, the title in Playfair italic, then artist, date and museum in `stone`. Every artwork on the site has a placard or a one-line caption.
- **Crest:** `museum-app/public/branding/regia-et-ars-crest.png` (transparent background), at most 168 px, with the crest glow and the app's slow "breathe" (scale 1 → 1.04 over 3.6 s).
- **Room numerals:** I to IX in Playfair, used in the rail and the eyebrows.
- **Wax seal:** an SVG seal in `oxblood` with a gold-foil rim, for quiz verdicts.
- **Parchment:** the scroll art in `public/quiz-scrolls/` behind the quiz card, used sparingly.
- **Icons:** reuse the SVGs in `museum-app/src/components/Icons.tsx` so the site and the app match.

### 4.5 Motion
- Easing `cubic-bezier(0.22, 1, 0.36, 1)` (the app's `float-up`). Entrances: fade plus an 8–16 px rise, 500–700 ms, staggered by 60–80 ms. Split headlines by line, never by letter.
- Hero artworks: a slow drift (scale 1 → 1.06 over 12 s) and a 1.2 s crossfade every 6 s.
- Gold sweep: the splash's 1.2 s shimmer runs once across the CTA's frame when it first appears. Never on the Apple badge itself.
- Ambient light: each slide's background glow takes its colours from the artwork on show (palette from the manifest, §10) and crossfades over 800 ms.
- Content animates in when a slide is 40% visible, and doesn't animate out.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no drift, no parallax, no smooth scrolling, nothing auto-advances. Everything is visible and still.
- Never: scroll-jacking, smooth-scroll libraries, parallax on touch screens, a blocking preloader, carousels that advance more often than every 6 s, or any animation that delays reading.

### 4.6 Don'ts
No stock photos of people. No emoji. No glassmorphism, purple gradients or generic SaaS look. No fake 3D. No museum logos. No autoplaying sound. No Tolkien references. Never tint, filter, crop or recolour an artwork in a "museum moment"; vignettes and overlays go around the art, not on it.

---

## 5. The slide system ("slide style")

The page is a deck of 9 full-screen slides (the rooms), followed by an FAQ and a footer. It should feel like a keynote but scroll like a normal web page.

### 5.1 Structure
```html
<header>…</header>
<main id="exhibition">
  <section class="slide" id="entrance" data-room="I" aria-labelledby="entrance-title">…</section>
  <!-- gallery · placard · ages · assessment · ladder · acquisitions · guild -->
  <section class="slide" id="doors" data-room="IX" aria-labelledby="doors-title">…</section>
</main>
<section id="faq">…</section>
<footer>…</footer>
```

### 5.2 Snap and sizing
```css
html { scroll-snap-type: y proximity; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }

.slide {
  position: relative;
  min-height: 100svh;          /* never 100vh: in-app browsers cut it off */
  scroll-snap-align: start;
  display: grid;
  align-content: center;
  padding: calc(env(safe-area-inset-top) + 72px) 16px calc(env(safe-area-inset-bottom) + 96px);
}
@media (min-width: 1024px) { .slide { padding: 96px 48px; } }
```
- Use `proximity`, not `mandatory`: it gives the slide feel without trapping anyone.
- The viewport meta needs `viewport-fit=cover` so the safe-area insets work.
- Every slide must fit a 375×667 phone (iPhone SE) with no scrolling inside it. If it doesn't fit, cut copy before you shrink type.
- The FAQ and footer are ordinary sections with no snapping.

### 5.3 Navigation
- **Room rail (desktop, from 1024 px):** fixed to the right edge, I to IX in Playfair, `stone`. The active room turns gold with a short gilt line. Hover or focus shows the room's name; a click jumps there. Mark it up as `<nav aria-label="Rooms">` with `aria-current="true"` on the active item.
- **Story bar (phones):** 9 thin segments across the top, like Instagram Stories, so visitors from social ads feel at home. Passed slides are gold, the current segment fills as you scroll, and tapping a segment jumps to that slide. Drive it from the scroll position only; don't hijack taps on the page.
- **Keyboard:** ↓, PageDown and Space go to the next slide; ↑, PageUp and Shift+Space go back; Home and End go to the first and last. Ignore these keys while focus is in the quiz, the print preview, a form field or the FAQ.
- **URL hash:** when a slide is at least 50% visible, set its `#id` with `history.replaceState` (no history spam). Loading `/#assessment` opens that slide without animation, so ads can link to any room.

### 5.4 Header
Transparent over the hero. After 80 px of scrolling it turns `ink` at 85% opacity with a backdrop blur. Left: the crest (28 px) and the NARSIL wordmark, linking to the top. Right (desktop only): a small "Get the app" button that appears once the hero's CTA has scrolled away. No other links: one goal, no exits.

### 5.5 Sticky CTA (phones)
A bottom bar, 64 px plus the safe area: mini crest · "Narsil — free on iPhone" · a gold pill button, **Get the app**, which follows the CTA logic in §7. Hide it while the hero's or the final slide's own CTA is on screen. Before launch the button reads **Join the waitlist**.

### 5.6 Present mode (optional, P2)
`?present` turns the site into a pitch deck for partner meetings: hide the header, sticky CTA and story bar, switch to `scroll-snap-type: y mandatory`, add ←/→ navigation and a large "IV / IX" counter, and toggle full screen with F.

---

## 6. Slide-by-slide spec

Each slide lists its job, copy, layout, interaction and tracking. Keep every string in `src/content/copy.ts` so it can be edited in one place.

**Before launch** (`prelaunch`, §7.2) every store CTA becomes the waitlist CTA: "Be first through the doors" with a **Join the waitlist** button, and "Free · No account needed to start" becomes "Coming soon to the App Store · Free to download".

### Slide I — The Entrance (`#entrance`)
**Job:** say what Narsil is in 5 seconds and offer the download.

**Copy**
- Eyebrow: Free art app for iPhone
- H1: **The museum never closes.**
- Sub: Swipe through nearly 20,000 public-domain artworks from the Met, the Rijksmuseum and more. Tap any piece for its story. Prove your eye in a daily quiz.
- CTA: the store badge for the current launch state (§7), plus a QR card on desktop ("Scan with your iPhone camera").
- Under the CTA: Free · No account needed to start
- Caption on the artwork, updated with each work: *The Milkmaid* · Johannes Vermeer, c. 1660 · Rijksmuseum
- Scroll cue: "Scroll to enter" with a small gold chevron (hidden under reduced motion)

Headline variants for A/B tests: B "Art history, one swipe at a time." · C "Scroll like it's 1660." (pair C with *The Milkmaid*).

**Phone layout**
```
┌──────────────────────────────┐
│ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬  story bar │
│ (crest) NARSIL               │
│                              │
│      full-bleed artwork      │
│   slow drift · crossfade 6s  │
│                              │
│ ░░░░░ gradient to ink ░░░░░░ │
│ FREE ART APP FOR IPHONE      │
│ The museum                   │
│ never closes.                │
│ Swipe through nearly 20,000  │
│ public-domain artworks …     │
│ ┌──────────────────────────┐ │
│ │ Download on the App Store│ │
│ └──────────────────────────┘ │
│ Free · No account needed     │
│ The Milkmaid · Vermeer       │
└──────────────────────────────┘
```
The artwork fills the screen (object-fit cover, using the focal point from the manifest) under a gradient rising from `ink`. The text sits in the lower half, and the CTA lands in the thumb zone. Four artworks crossfade every 6 s; load the other three after the page's `load` event. No phone mockup here; it arrives in Slide II.

**Desktop layout:** the spotlight gradient, like a dark museum wall. The left 6 columns hold the text, the badge and the QR card. On the right, an iPhone (Apple's official bezel) plays the real feed recording, standing in the spotlight. Behind it, a large gilt-framed painting hangs on the wall, softly out of focus (blur 6 px, 60% brightness). Whenever the phone's video moves to the next artwork, the painting on the wall crossfades to the same work (the timestamps are in the manifest).

**Performance:** the first artwork is the LCP element. Preload it with `fetchpriority="high"` (AVIF, 900 px wide and at most 150 KB on phones; 1,600 px and at most 260 KB on desktop). Nothing else may delay it.

**Track:** `cta_click {placement: "hero"}`, `qr_shown`.

**Done when:** on a 375×667 phone the headline, sub and CTA are all visible without scrolling, and LCP is under 2 s on throttled 4G.

### Slide II — The Endless Gallery (`#gallery`)
**Job:** show the product in motion: it's a feed, and it's art.

**Copy**
- Eyebrow: Room II · The Endless Gallery
- H2: **Swipe through five thousand years.**
- Sub: A full-screen feed that learns what you love.
- Kicker: No ads. No noise. Just art.
- Gestures (icon, action, result):
  1. Swipe up: the next artwork
  2. Tap the title: open its placard
  3. Swipe left: meet the artist
  4. Swipe right: fill the frame
  5. Press and hold: hide everything but the art
- Small print: Like, save to your Vault, comment or download from the side rail.

**Layout:** on desktop the phone sits in a sticky column through Slides II and III while the text column scrolls past it. On phones the phone (about 62% of the viewport height) is centred, with the gestures in a row of chips below it.

**Interaction:** each gesture has its own short clip (§11). The gesture list advances every 4 s in step with the clips; tapping, hovering or focusing a gesture plays its clip. **Pressing and holding the phone** for 500 ms plays the clean-view clip, the same gesture as in the app (hint: "Press and hold the painting").

**Track:** `gesture_demo {gesture}`.

### Slide III — The Placard (`#placard`)
**Job:** prove depth. It isn't only pretty pictures; you learn something with every swipe.

**Copy**
- Eyebrow: Room III · The Placard
- H2: **Every work has a story.**
- Sub: Tap a title and the placard rises: who made it, when and where, and why it still matters.
- Source line: Images and records from the open-access collections of the Met, the Rijksmuseum, the Cleveland Museum of Art and Wellcome Collection.

**Layout:** on desktop the sticky phone plays the placard clip, while the text column shows a large HTML placard for one artwork that slides up with `--shadow-placard`. On phones, the artwork sits in a gilt frame and the placard rises over its lower third as the slide comes into view.

**Content:** copy the placard text for that artwork from the app's catalog. If the app labels it as an AI-assisted summary, use the same label.

### Slide IV — The Ages (`#ages`)
**Job:** show that learning is structured (Discover).

**Copy**
- Eyebrow: Room IV · The Ages
- H2: **From pharaohs to Van Gogh.**
- Sub: Discover walks you through art history, age by age and empire by empire, with the artists and works that defined each one.
- Seven era cards. Modern Art and Contemporary are left out on purpose: few of their works are public domain.

| Era | Years | Line |
|---|---|---|
| Ancient Egypt | 3100–30 BC | Art made to last forever. |
| Greek & Roman Antiquity | 800 BC–AD 400 | Balance, proportion and the human form. |
| Medieval & Byzantine | 400–1400 | A thousand years of faith in gold and light. |
| Renaissance | 1400–1600 | Perspective, anatomy and luminous oil. |
| Baroque & Dutch Golden Age | 1600–1750 | Drama, shadow and quiet Dutch rooms. |
| Romanticism & Edo | 1750–1850 | Sublime storms and Hokusai's waves. |
| Modern Masters | 1850–1910 | Light, colour and the birth of modern art. |

- Footer of each card: 3 trials · Apprentice · Scholar · Master
- Small print: Discover is free with an account. Ancient Egypt's trials are free for everyone; every other age and empire comes with The Explorer's Guild.

**Layout:** on desktop, a pinned horizontal track: the section is tall, its inner stage is sticky, and scrolling down moves the cards sideways (Motion's `scroll()`). On phones, a native horizontal carousel (`scroll-snap-type: x mandatory`) with the next card peeking in and a "1 / 7" counter. No pinning on phones.

**Art:** one CC0 work per era from the catalog, for example Egyptian and Greek pieces from the Met, *The Harvesters* (Bruegel, the Met) for the Renaissance, *The Milkmaid* (Rijksmuseum) for the Baroque, *Under the Wave off Kanagawa* (Hokusai, the Met) for Edo, and *Wheat Field with Cypresses* (Van Gogh, the Met) for Modern Masters. **(Verify each one is in the catalog.)**

**Track:** `era_view {era}`.

### Slide V — The Royal Assessment (`#assessment`)
**Job:** the hook. Let people play, then hand them a verdict worth sharing.

**Copy**
- Eyebrow: Room V · The Royal Assessment
- H2: **The court will now judge your taste.**
- Sub: Every day the app serves ten new questions. Score well and you're knighted. Score badly and… well. Try five now.
- Small print: Sample questions. The app's Assessment is new every day.

**Quiz card (phone)**
```
┌──────────────────────────────────┐
│ ROOM V · THE ROYAL ASSESSMENT    │
│                           II / V │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │   artwork in a gilt frame  │  │
│  │  fixed 4:5 box, no caption │  │
│  │                            │  │
│  └────────────────────────────┘  │
│  Who painted this?               │
│  ┌────────────┐  ┌────────────┐  │
│  │ Van Gogh   │  │ Monet      │  │
│  └────────────┘  └────────────┘  │
│  ┌────────────┐  ┌────────────┐  │
│  │ Cézanne    │  │ Gauguin    │  │
│  └────────────┘  └────────────┘  │
└──────────────────────────────────┘
```

**Quiz design**
- Start card: **Begin the Assessment** · "5 questions · about a minute · no sign-up".
- Draw 5 questions at random from the bank in Appendix B. Three styles: *Who made this?* (an image and 4 names), *Which is older?* (2 images) and *True or false* (a statement and an image).
- The card sits on dark parchment, with progress in Roman numerals (II / V). The artwork is in a gilt frame inside a fixed-ratio box, so nothing shifts as it loads. Hide the caption until after the answer, since it would give the answer away.
- After each answer, the right option turns gold with a ✓ and a wrong pick turns `oxblood` with a ✗. Then the caption and a one-line fact appear, then **Next**. Announce the result in an `aria-live="polite"` region.
- No timer on the web.
- **Verdict:** a wax seal stamps down (600 ms), then the verdict title appears in Playfair (`gilt-light`), with the message and the score ("4 / 5"). Use the app's formula so the tone matches: `rank = Math.round(score / total * 7)` → Appendix C.
- Buttons: **Share my verdict** (Web Share API, falling back to copying the link) · **Play today's Assessment in the app** (store CTA, `placement: "quiz_verdict"`) · **Try again**.
- Keep the last verdict in `sessionStorage` (inside try/catch) so a refresh doesn't lose it.

**Track:** `quiz_start`, `quiz_answer {index, correct}`, `quiz_complete {score, verdict}`, `quiz_share {method}`, `cta_click {placement: "quiz_verdict"}`.

**Done when:** the whole quiz works with the keyboard alone and with VoiceOver, and focus moves to the verdict heading when it appears.

### Slide VI — The Ladder (`#ladder`)
**Job:** promise progress, so people come back every day.

**Copy**
- Eyebrow: Room VI · The Ladder
- H2: **Rise from Peasant to Royal Archivist.**
- Sub: Daily points lift you through seven ranks, each with its own heraldic frame. Perfect trials earn Seals. The Halls rank you against members at your level.
- Rank labels: I Peasant · II Scholar · III Archivist · IV Master Archivist · V Grand Archivist · VI High Archivist · VII Royal Archivist
- Seals: Apprentice · Scholar · Master. "Only a flawless appraisal claims this seal."
- Halls: the Hall of your rank (today) · Monthly Hall · Discover Hall
- Small print: Want a nudge? Turn on the daily reminder and keep your streak alive.

**Visual:** the seven frames from `public/person-levels/level-1.png` to `level-7.png` climb as a diagonal staircase on desktop and stack vertically on phones, each one revealed as you scroll. Inside each frame is a cropped CC0 portrait from the catalog that grows grander with the rank: a peasant from a genre painting at I, a monarch at VII. Next to the ladder, play a short real recording of a Hall from a demo account, with other members' names blurred or replaced. Never invent player counts.

### Slide VII — Acquisitions (`#acquisitions`)
**Job:** make people want a print (the second source of revenue), then send them to the app to buy it.

**Copy**
- Eyebrow: Room VII · Acquisitions
- H2: **Take a masterpiece home.**
- Sub: Canvas from $59. Posters from $29. The price you see includes shipping and tax, to any US address.
- CTA: **Choose yours in the app** (`placement: "prints"`)
- Small print: Ordered in the app with Apple Pay or card. Some works cost a few dollars more; the app shows the exact price before you pay.

**Interaction: true-scale wall preview**
- Choose one of 6 artworks: CC0 works from the Met, the Cleveland Museum of Art or the Rijksmuseum. Never Wellcome, which isn't sold as prints.
- Toggle Canvas or Poster, and Small 12×16" / Medium 18×24" / Large 24×36".
- The print appears at true scale on a simple living-room wall drawn in SVG, with a sofa about 84" wide and a plant for scale. Canvas gets a shallow edge shadow; posters hang flat. Don't draw frames, mats or hanging hardware that aren't sold.
- Orientation follows the artwork: landscape works turn the size around.
- The price label reads "from $X" for that product and size, taken from the price table fetched at build time (§10).

**Track:** `print_configure {product, size, artwork}`, `cta_click {placement: "prints"}`.

### Slide VIII — The Explorer's Guild (`#guild`)
**Job:** make the free tier clear, make the Guild desirable, and surprise no one.

**Copy**
- Eyebrow: Room VIII · The Explorer's Guild
- H2: **Free to enter. The Guild goes deeper.**
- Sub: The feed, the placards, Discover, the daily Assessment, levels and Halls are free. The Explorer's Guild is an optional subscription for the endlessly curious.
- Three perk cards:
  1. **Uncharted Archives.** Practice without limits. Free members get five questions a round; the Guild plays as long as you keep answering.
  2. **Every trial.** Every age and empire trial beyond Ancient Egypt, and the Seals that come with them.
  3. **Master Files.** Download the largest file the museum publishes. Free downloads stop at 2,000 px.
- Comparison table:

| | Free | Explorer's Guild |
|---|---|---|
| The feed, placards and artist profiles | ✓ | ✓ |
| Discover ages and empires (with a free account) | ✓ | ✓ |
| Daily Royal Assessment, levels and Halls | ✓ | ✓ |
| Ancient Egypt trials | ✓ | ✓ |
| Every other age and empire trial | — | ✓ |
| Practice (Uncharted Archives) | 5 questions a round | Endless |
| Downloads | Up to 2,000 px | Master File |
| Canvas and poster prints | ✓ | ✓, same prices |

- Small print: The Explorer's Guild is an auto-renewing subscription billed to your Apple Account. The app shows the price before you subscribe. Cancel anytime in Settings.
- CTA: **Download free, join the Guild anytime** (`placement: "guild"`)

Never show subscription prices or trial lengths unless the client confirms them (§2.1).

### Slide IX — The Doors (`#doors`)
**Job:** the final, easy yes.

**Copy**
- Eyebrow: Room IX · The Doors
- H2: **The doors are open.**
- Sub: Narsil is free on iPhone. Your first masterpiece is one swipe away.
- CTA: the store badge plus the QR card (desktop) · "No account needed to start."

**Visual:** the spotlight gradient, the crest at 168 px breathing in its glow, a gilt rule, and the CTA inside a thin gold frame that gets one gold sweep when it appears.

### After the slides: FAQ (`#faq`)
An accordion built from `<details>` and `<summary>` (no JavaScript needed), all closed at first:
1. **Is Narsil free?** Yes. The app is free, and so are the feed, the placards, Discover, the daily Assessment, levels and Halls. The Explorer's Guild is an optional subscription; prints are paid for one by one.
2. **What does The Explorer's Guild add?** Endless practice, every age and empire trial, and Master File downloads. (Add uploading in Create if it ships.)
3. **Where does the art come from?** From the open-access collections of the Metropolitan Museum of Art, the Rijksmuseum, the Cleveland Museum of Art and Wellcome Collection: works in the public domain or released as CC0. Narsil is independent and isn't affiliated with these museums.
4. **Do I need an account?** No. Start as a guest. A free account (Sign in with Apple or Google) opens Discover and keeps your Vault, levels and streak in sync.
5. **Is Narsil on Android?** Answer from the config: with a Play listing, "Yes, get it on Google Play"; without one, "Narsil is on iPhone first."
6. **Where do prints ship?** To US addresses only. Shipping and tax are included in the price you see.
7. **How do I cancel the Guild?** iPhone Settings → your name → Subscriptions, at least 24 hours before it renews.
8. **How do I delete my account?** In the app: Profile → Delete account.
9. **How do I contact you?** narsil.business@gmail.com

### Footer
- Crest and wordmark. Links: Support · Privacy · Terms · Credits · Contact.
- © 2026 Narsil.
- "Artworks shown are in the public domain or CC0, from the open-access collections of the Metropolitan Museum of Art, the Rijksmuseum, the Cleveland Museum of Art and Wellcome Collection. Narsil is independent and is not affiliated with, sponsored or endorsed by these institutions."
- "Apple, the Apple logo and iPhone are trademarks of Apple Inc., registered in the U.S. and other countries and regions. App Store is a service mark of Apple Inc."
- Only when the Play badge is shown: "Google Play and the Google Play logo are trademarks of Google LLC."

---

## 7. Download links and CTA logic

This is the heart of an ad site. All store logic lives in one config file and one helper module.

### 7.1 Config
```ts
// src/config/site.ts — the only place store links and launch state live
export type LaunchState = "prelaunch" | "preorder" | "live";

export const SITE = {
  url: "https://REPLACE-ME",               // production origin, no trailing slash
  launchState: "prelaunch" as LaunchState,
  appStore: {
    id: "",            // App Store Connect → App Information → Apple ID (digits only)
    providerToken: "", // "pt" from App Store Connect's campaign-link generator
  },
  googlePlayUrl: "",   // empty → no Android badge anywhere
  webAppUrl: "https://narsil-app-frontend.vercel.app", // Android/desktop fallback only
  waitlist: { enabled: true },
  rating: null as null | { value: number; count: number }, // real App Store rating, or null
  catalogLabel: "nearly 20,000",          // 19,362 works on 24 Oct 2026
  dailyQuestions: 10,                     // verify in Admin → Quiz
  prices: { canvasFrom: 59, posterFrom: 29 }, // fallback; the build fetches /api/prices
  supportEmail: "narsil.business@gmail.com",
  legal: {
    privacyUrl: "https://narsil-legal.vercel.app/privacy.html", // verify the live URL
    termsUrl: "https://narsil-legal.vercel.app/terms.html",
  },
} as const;
```

### 7.2 Launch states

| State | When | Primary CTA | Store badge |
|---|---|---|---|
| `prelaunch` | Before the app is on the App Store (today) | **Join the waitlist** · "Coming soon to the App Store" | None. Never show "Download on the App Store" for an app that isn't there |
| `preorder` | The app is approved and set up for pre-order in App Store Connect | **Pre-order free** | Apple's "Pre-order on the App Store" badge |
| `live` | The app is live | **Get the app** | Apple's "Download on the App Store" badge |

Switching state is a one-line config change plus a redeploy. Write a test that renders each state.

### 7.3 Campaign links (attribution)
Every App Store link carries App Store Connect campaign parameters, so App Analytics can count downloads per ad:

```ts
// src/lib/store-links.ts
export function appStoreUrl(placement: string): string {
  const u = new URL(`https://apps.apple.com/app/apple-store/id${SITE.appStore.id}`);
  if (SITE.appStore.providerToken) {
    u.searchParams.set("pt", SITE.appStore.providerToken);
    u.searchParams.set("ct", campaignToken(placement));
  }
  u.searchParams.set("mt", "8");
  return u.toString();
}

/** utm_source + utm_campaign + placement → "ig_launch1_hero"; only [a-z0-9_-], at most 40 characters. */
export function campaignToken(placement: string): string { /* … */ }
```
- On the first page view, save `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` to `sessionStorage` (inside try/catch) so later clicks keep them.
- With no UTMs, use `organic_<placement>`; on a campaign variant (§8), use the variant name as the campaign.
- Unit-test `campaignToken`: sanitising, truncation and missing values.

### 7.4 One smart link: `/get`
One URL for every ad, bio link, QR code and printed flyer: `https://<domain>/get?c=<campaign>`.
- iPhone or iPad (including iPadOS that reports itself as a Mac: `/Macintosh/.test(ua) && navigator.maxTouchPoints > 1`) → `location.replace(appStoreUrl("get"))`.
- Android → the Play URL if set; otherwise a page that says "Narsil is on iPhone first", with the waitlist and a link to the web app.
- Desktop → a page with the badge and a QR code.
- `prelaunch` → the waitlist page for everyone.
- Send `cta_click {placement: "get"}` with `navigator.sendBeacon` before redirecting, and never wait more than 150 ms.
- `<noscript>`: plain links to every store.

### 7.5 Which CTA each visitor sees

| Visitor | `live` | `preorder` | `prelaunch` |
|---|---|---|---|
| iPhone / iPad | App Store badge → store | Pre-order badge → store | Waitlist form |
| Android | Play badge if set; otherwise "On iPhone first" + waitlist + web app | Same | Waitlist form |
| Desktop | App Store badge (new tab) + QR | Pre-order badge + QR | Waitlist form |

- On phones, store links open in the same tab (iOS hands them to the App Store app). On desktop, open a new tab with `rel="noopener"`.
- Render the App Store badge on the server as the default, then adjust on the client without layout shift (reserve the space).

### 7.6 Badge rules
- Use only official artwork: Apple's badges from the App Store marketing tools (`tools.applemarketingtools.com`) and Google's from `play.google.com/intl/en_us/badges`. SVG, English.
- Don't recolour, crop, rotate, animate or redraw them. Keep them at least 40 px tall on screen, with clear space around them (Apple asks for at least a quarter of the badge's height; check the current rules at `developer.apple.com/app-store/marketing/guidelines/`).
- The sticky button on phones may be a plain gold "Get the app" pill. The badge itself appears in the hero, in Slide IX and on `/get`.

### 7.7 QR code (desktop)
- Generate it on the client, lazily and on desktop only (`client:media="(min-width: 1024px)"`), so it carries the visitor's UTMs: `/get?c=qr&utm_source=…&utm_campaign=…`. A static QR pointing to `/get?c=qr` is the no-JavaScript fallback.
- Dark modules on `canvas` (#f4efe6) inside a thin gilt frame, error correction level H, at least 160 px. A small crest in the centre is allowed.
- Label: "Scan with your iPhone camera".

### 7.8 Smart App Banner
In `live`, add `<meta name="apple-itunes-app" content="app-id=APP_ID">` so Safari shows its native install banner. Check that the hero still looks right when the banner is showing.

### 7.9 Waitlist (before launch)
- One email field, a hidden honeypot field, and a consent line: "We'll email you when Narsil launches. No spam. Privacy Policy."
- Store it in Supabase. Add this SQL as the next numbered file in `museum-app/supabase/`, list it in that folder's README, and **ask before running it**:

```sql
create table public.site_waitlist (
  id bigint generated always as identity primary key,
  email text not null unique
    check (length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source text check (length(source) <= 80),
  campaign text check (length(campaign) <= 80),
  created_at timestamptz not null default now()
);
alter table public.site_waitlist enable row level security;
create policy "anyone can join the waitlist"
  on public.site_waitlist for insert to anon, authenticated with check (true);
-- No select, update or delete policies: only the service role can read the list.
```
- Treat a duplicate-email error as success ("You're on the list") so the form never reveals whether an address is already there.
- If spam appears, move the insert behind the EC2 backend's rate limiter.

---

## 8. Campaign variants (message match)

The page an ad links to must repeat the ad's promise in its first line. Build these variants from the same slide components, with a different hero and slide order:

| Path | For ads about | Hero headline | Hero sub | Slide order |
|---|---|---|---|---|
| `/` | The app in general | The museum never closes. | As in Slide I | I → IX |
| `/quiz` | The quiz and its verdicts | Can you tell a Vermeer from a Rembrandt? | Take the five-question test right here. The royal court's verdict is… theatrical. | I (the quiz is the hero) → VI → II → III → IV → VII → VIII → IX |
| `/prints` | Prints, gifts, home decor | Hang a masterpiece in your living room. | Canvas from $59, posters from $29, shipping and tax included in the US. Choose from thousands of public-domain masterpieces in the Narsil app. | I → VII → II → III → V → VI → VIII → IX |
| `/learn` | Learning, students, parents | Learn art history in five minutes a day. | Swipe through real masterpieces, read the story behind each one, and test yourself in a daily quiz. Free on iPhone. | I → IV → III → II → V → VI → VIII → VII → IX |

- On `/quiz`, the Royal Assessment card is the hero itself, so the variant has no separate Slide V.
- Every variant sets `<link rel="canonical">` to `/`.

---

## 9. Share loop: verdict pages

- Build one static page per verdict in Appendix C: `/verdict/<slug>`, for example `/verdict/knighted-by-the-crown`.
- Each has its own 1200×630 Open Graph image, made at build time: dark parchment, the wax seal, the verdict title in Playfair, the crest, and "Take the Royal Assessment · Narsil".
- Share text: "The court has spoken: I was Knighted by the Crown. Think you can do better?" plus the verdict URL with `?utm_source=share&utm_campaign=verdict`.
- The verdict page shows the verdict, then **Take the Assessment** (→ `/quiz`) and the store CTA.

---

## 10. Tech stack and project structure

Create the site in `E:\Project-dev\narsil-site\`, next to `museum-app/`.

**Stack**
- **Astro** (latest stable), static output, deployed on **Vercel** as a new project, `narsil-site` (preview deploys per branch; production only with the client's OK).
- **React 19** islands, only where the page needs interaction: the phone demo, the quiz, the print preview, the era track and the waitlist form. Hydrate them with `client:visible`.
- **Tailwind CSS v4** with the §4 tokens in `@theme`, using the app's names (`ink`, `canvas`, `accent`…) so the classes match the app.
- **Motion** (the `motion` package, the library behind the app's `framer-motion`) for scroll-linked and entrance animation; plain CSS for simple transitions.
- Build tools: `sharp` (image variants), `node-vibrant` (palettes), `qrcode` (QR SVG), `satori` with `@resvg/resvg-js` (OG images).
- Fonts: `@fontsource-variable/inter` and `@fontsource/playfair-display` (500, 600, 700 and 500 italic), Latin subset.
- TypeScript in strict mode, oxlint (as in the app), Vitest for `src/lib`.
- Nothing else: no UI kits, no carousel or smooth-scroll libraries, no jQuery.
- *Fallback for builders that can't run Astro:* Vite + React 19 + Tailwind v4, pre-rendered to static HTML. Everything else in this brief stays the same.

**Structure**
```
narsil-site/
├─ astro.config.mjs
├─ vercel.json                  # headers and redirects
├─ scripts/
│  ├─ build-artworks.ts         # manifest → AVIF/WebP 480/960/1600/2400, palette, placeholder
│  ├─ fetch-prices.ts           # GET /api/prices → src/content/prices.json (fallback on failure)
│  └─ build-og.ts               # default, variant and verdict OG images
├─ public/                      # favicons, crest, badges, robots.txt
└─ src/
   ├─ config/site.ts            # §7.1
   ├─ content/
   │  ├─ copy.ts                # every string on the site, variants included
   │  ├─ artworks.json          # curated works with license and source (feeds /credits)
   │  ├─ quiz.json              # Appendix B
   │  ├─ verdicts.ts            # Appendix C
   │  └─ prices.json            # generated
   ├─ lib/
   │  ├─ store-links.ts         # appStoreUrl, campaignToken, platform detection
   │  ├─ analytics.ts           # track() using sendBeacon
   │  └─ utm.ts
   ├─ components/               # Header, RoomRail, StoryBar, StickyCta, StoreBadge, QrCard,
   │                            # GiltFrame, Placard, Crest, Seal, Eyebrow
   ├─ islands/                  # PhoneDemo, MiniQuiz, PrintPreview, EraTrack, WaitlistForm
   ├─ slides/                   # Entrance … Doors, one .astro file per slide
   └─ pages/
      ├─ index.astro, quiz.astro, prints.astro, learn.astro
      ├─ get.astro, support.astro, credits.astro, 404.astro
      └─ verdict/[slug].astro
```

**Build-time data**
- `fetch-prices.ts`: read `products.canvas.sizes` and `products.poster.sizes` (older servers send only `sizes`, for canvas), mirroring `mergeSizes` in `museum-app/src/data/shop.ts`. If the request fails, keep the config's fallback and print a warning; never fail the build.
- `build-artworks.ts`: take each work's image from Narsil's own S3 copy (the file the app shows) or from the museum's open-access download. Output AVIF and WebP at 480, 960, 1600 and 2400 px wide, a 5-colour palette, the focal point set by hand in the manifest, and a tiny blurred placeholder. The site never hotlinks images.

**Security headers** (`vercel.json`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a Content-Security-Policy that allows only the site itself, the analytics endpoint and, for the waitlist, the Supabase URL. Test it on a preview deploy. Cache hashed assets for a year with `immutable`.

---

## 11. Assets

**Already in `museum-app/public/`**

| Asset | Path |
|---|---|
| Crest, transparent background | `branding/regia-et-ars-crest.png` |
| App icon | `branding/narsil-app-icon.png` |
| Favicons | `favicon.png`, `favicon.svg`, `apple-touch-icon.png` |
| Level frames I–VII | `person-levels/level-1.png` … `level-7.png` |
| Parchment and scroll art | `quiz-scrolls/` |
| Hall and study art | `quiz-halls/`, `quiz-study/` |
| Icons | `src/components/Icons.tsx` |

**To produce**
1. **Screen recordings** on a real iPhone or the Simulator, from a non-admin demo account, with a clean status bar (in the Simulator: `xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100`, then record with `xcrun simctl io booted recordVideo <file>.mp4`). No nudity in any clip.

   | Clip | Length | Shows |
   |---|---|---|
   | `feed` | 8–10 s | Swiping through 4 works (note the timestamp of each change for the desktop hero) |
   | `placard` | 6 s | Tap the title, the placard rises, scroll its text |
   | `artist` | 5 s | Swipe left to the artist profile |
   | `fill` | 4 s | Swipe right to fill the frame |
   | `clean` | 4 s | Press and hold; the interface fades away |
   | `assessment` | 10 s | Three answers and a verdict |
   | `hall` | 5 s | A Hall board, with other members' names blurred or replaced |
   | `print` | 8 s | Choose a size and reach the Apple Pay sheet; stop before paying |

   Export each as H.264 MP4 (at most 1.2 MB, no audio track, `+faststart`) and as WebM (VP9 or AV1), at 30 fps and about 886×1920, with an AVIF poster frame.
2. **iPhone bezel:** the current iPhone from Apple Design Resources (`developer.apple.com/design/resources`).
3. **Store badges:** Apple's black "Download on the App Store" and "Pre-order on the App Store" SVGs. Google Play's only if Android ships.
4. **Artworks:** about 25 curated CC0 works (4 for the hero, 7 ages, 10 quiz, 6 prints, 7 level portraits, with some overlap), listed in `artworks.json`.
5. **OG images:** generated by `build-og.ts` (§9, §14).

---

## 12. Performance budget

Measure with a mid-range Android profile on throttled 4G, and with Lighthouse in mobile mode.

| Metric | Budget |
|---|---|
| LCP | ≤ 2.0 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| JavaScript before interaction | ≤ 70 KB gzip (islands load when visible) |
| CSS | ≤ 35 KB gzip |
| First-view weight, fonts and hero image included | ≤ 700 KB |
| Each video | ≤ 1.2 MB, `preload="none"` |
| Lighthouse (mobile) | Performance ≥ 95 · Accessibility 100 · Best Practices 100 · SEO 100 |

- Every `<img>` has `width` and `height`. Use `<picture>` with AVIF, then WebP. Use `loading="lazy"` and `decoding="async"` everywhere except the hero.
- Videos: `muted playsinline loop`, a poster, playing only while at least half visible and paused otherwise. With Save-Data on, a 2G connection, or reduced motion, show the poster with a play button.
- Fonts: preload only the two files used above the fold, and use `font-display: swap` with size-adjusted fallbacks so text doesn't jump when the fonts arrive.
- No third-party script before the first interaction; analytics loads after the `load` event.

---

## 13. Accessibility (WCAG 2.2 AA)

- Landmarks: `header`, `main`, `footer`. One `h1` (the hero); one `h2` per slide.
- Skip links: "Skip to content" and "Skip to download" (which jumps to Slide IX).
- Focus ring: 2 px gold with a 3 px offset on every interactive element.
- Everything works with the keyboard, and the slide keys in §5.3 never trap focus.
- Alt text for every artwork: "*Title* by Artist, year: a short description of what you see."
- Videos are decorative (`aria-hidden="true"`); the text next to each one says what it shows.
- Colour is never the only signal: right and wrong answers also get ✓ / ✗ and words.
- Works at 200% zoom and at 320 px wide with no sideways scrolling. Don't copy the app's `maximum-scale=1`: the site must allow pinch-zoom.
- Reduced motion is fully respected (§4.5).
- `lang="en"`.

---

## 14. SEO and social

- `<title>`: Narsil — The museum that never closes · Art app for iPhone
- Meta description: Swipe through nearly 20,000 public-domain artworks, read the story behind each one, take a daily art quiz and order canvas prints. Free on iPhone.
- Canonical URLs, `robots.txt`, and `sitemap.xml` (home, support, credits; the variants point their canonical at `/`).
- Open Graph and Twitter cards (`summary_large_image`): a default 1200×630 image (crest, a gilt-framed masterpiece and the headline), one per variant, and one per verdict (§9).
- JSON-LD:
```json
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Narsil",
  "operatingSystem": "iOS",
  "applicationCategory": "EducationalApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://<domain>/",
  "downloadUrl": "https://apps.apple.com/app/idAPP_ID",
  "image": "https://<domain>/og/default.png"
}
```
  Match `applicationCategory` to the App Store category the client picks. Add `aggregateRating` only from real App Store numbers (`SITE.rating`). Add an `Organization` block with the crest and the support email.
- Favicons and the Apple touch icon come from the app.

---

## 15. Analytics and attribution

**Default:** Vercel Web Analytics and Speed Insights. Both are cookie-free, so no cookie banner is needed. Custom events need a Vercel Pro plan; on the Hobby plan, send events to the backend's `POST /api/telemetry` instead (add the site's origin to `CORS_ORIGIN` on EC2 and check that the endpoint accepts these event names).

**Events**

| Event | Properties | Fires when |
|---|---|---|
| `slide_view` | `slide`, `variant` | A slide is first at least 50% visible (once per session) |
| `cta_click` | `placement` (hero, sticky, header, quiz_verdict, prints, guild, doors, get), `store` (app_store, play, web, waitlist), `variant` | Any download or waitlist CTA is clicked |
| `qr_shown` | `variant` | The desktop QR code first appears |
| `gesture_demo` | `gesture` | A gesture clip plays on request |
| `era_view` | `era` | An era card first comes into view |
| `quiz_start` · `quiz_answer` · `quiz_complete` · `quiz_share` | `index`, `correct`, `score`, `verdict`, `method` | Each quiz step |
| `print_configure` | `product`, `size`, `artwork` | The print preview changes |
| `waitlist_submit` | `variant` | The form succeeds |
| `faq_open` | `question` | An FAQ item opens |

- Send clicks with `navigator.sendBeacon` so they survive the jump to the App Store.
- Installs per campaign come from App Store Connect (App Analytics → Campaigns, grouped by `ct`). Review them weekly next to the click data.
- **Ad pixels (Meta, TikTok, Google Ads) stay off by default.** When paid campaigns start, add them behind a consent banner and a "Your privacy choices" link, honour Global Privacy Control, and map `cta_click` to each network's conversion (Meta `Lead` or a custom conversion, TikTok `ClickButton`, a Google Ads "Download click" conversion). Update the privacy policy first (§16).

---

## 16. Legal, privacy and support

- **Keep existing URLs alive.** `narsil-legal` is the Google OAuth homepage: it must keep describing Narsil and serving `privacy.html`, `terms.html` and `googled238698231e42662.html` (Search Console). Don't replace or redeploy it without the client's OK. The new site links to its Privacy and Terms pages (`SITE.legal`), so the legal text exists in one place only.
- **Privacy addendum:** if the site collects waitlist emails or loads ad pixels, `narsil-legal/privacy.html` needs a "Website" section before launch. Draft it and ask.
- **/support** (it can also be the App Store Connect Support URL): the contact email; how to cancel the Guild; how to delete an account (Profile → Delete account); print orders (Profile → Print orders); US-only shipping; a link to the FAQ.
- **/credits:** generated from `artworks.json`, listing title, artist, date, museum, accession number, license (CC0 or public domain) and a source link for every work on the site.
- **404:** "This room is closed." with a gold link back to the entrance.
- Footer disclaimers as in §6.

---

## 17. Milestones

After each milestone, share a preview deploy and screenshots at 390×844 and 1440×900.

1. **Foundation.** Astro, Tailwind tokens, fonts, `site.ts`, `store-links.ts` with tests, and `/get` working in all three launch states. *The download link works end to end before anything is pretty.*
2. **Slide system.** Nine empty slides with snapping, the room rail, the story bar, keyboard keys, URL hashes, the header, the sticky CTA and reduced-motion mode.
3. **Entrance and Doors.** Slides I and IX finished with real copy, art, badge, QR code and waitlist. This alone is a launchable page.
4. **Gallery and Placard.** The recordings, the sticky phone, the gestures, press-and-hold.
5. **Assessment.** The quiz, the verdicts, the `/verdict/*` pages and their OG images.
6. **Ages, Ladder, Acquisitions, Guild.** Including the true-scale print preview and the price fetch.
7. **Variants, SEO, analytics, legal pages, credits, 404.**
8. **QA and polish** against §18, then ask for the production go-ahead.

---

## 18. QA and definition of done

**Test matrix**
- iPhone SE (375×667), iPhone 15/16 (393×852), a Pro Max (430–440 wide): Safari and Chrome.
- In-app browsers: Instagram, TikTok, Facebook, Messenger, Snapchat, X, Pinterest.
- Android: Chrome on a Pixel and on a Samsung (360×800).
- Desktop: Chrome, Safari, Firefox and Edge at 1280, 1440, 1920 and 2560 px wide.
- Keyboard only; VoiceOver on iOS and macOS; NVDA on Windows.
- Reduced motion on; JavaScript off; throttled 4G; Save-Data on.

**Done means**
- [ ] On every test phone, Slide I's headline and CTA are visible without scrolling.
- [ ] Every CTA goes to the right place for the device and the launch state, with `pt` and `ct` set whenever a provider token exists.
- [ ] `/get` sends iPhones to the App Store in under 300 ms and shows the right fallback everywhere else.
- [ ] Store links open the App Store from inside Instagram, TikTok and Facebook.
- [ ] The budgets in §12 are met, and the Lighthouse scores are recorded.
- [ ] No sideways scrolling at 320 px, and no layout shift while images and fonts load.
- [ ] The quiz works with the keyboard alone and with VoiceOver, and its verdicts match Appendix C.
- [ ] Every claim on the site appears in §1.2, and nothing from §2.1 appears.
- [ ] No invented reviews, ratings, users, press or numbers.
- [ ] Every artwork is CC0 or public domain, listed on /credits, self-hosted, and free of nudity and gore.
- [ ] Badges are official and unmodified; the trademark lines are in the footer.
- [ ] With JavaScript off, every slide's text and a plain store link still show.
- [ ] With reduced motion on, the page is calm and complete.
- [ ] The waitlist rejects malformed emails, treats duplicates as success and ignores bots that fill the honeypot.

---

## Appendix A — Values to fill in before launch

| Value | Where to find it | Until then |
|---|---|---|
| Launch state | Client decision | `prelaunch` |
| App Store ID | App Store Connect → App Information → Apple ID | No badge |
| Provider token (`pt`) | App Store Connect → App Analytics → generate a campaign link | Links work without attribution |
| Google Play URL | Play Console, if Android ships | No Android badge |
| Domain | Registrar → Vercel. **Search the USPTO for "Narsil" first:** it's Aragorn's sword in *The Lord of the Rings*, and the name may have to change (APPLE-REVIEW, P2) | Vercel preview URL |
| App Store category | App Store Connect | `EducationalApplication` in the JSON-LD |
| Daily question count | Admin → Quiz | 10 |
| Subscription plans, prices, free trial | App Store Connect | Not mentioned |
| Does Create (uploading) ship at launch? | Client | Not mentioned |
| iPad support | APPLE-REVIEW #30 | Say "iPhone" only |
| Delivery-time promise | Client and Printful | Not mentioned |
| Print quality wording | Printful product pages | No quality claims |
| Analytics (Vercel Pro or backend telemetry) | Client | Vercel page views only |
| Ad pixels | Client, when ads start | Off |
| Live legal URLs | narsil-legal's Vercel domain | Confirm `SITE.legal` |
| Git repo for `narsil-site` | GitHub, like the other repos | Local only |

---

## Appendix B — Mini-quiz starter bank

Check every fact and license against the museum's own record before shipping, and prefer works that are in Narsil's catalog. Show the caption and the fact only after the visitor answers.

| # | Style | Artwork (collection) | Question | Options (answer in bold) | Fact shown after |
|---|---|---|---|---|---|
| 1 | Who made this? | *Wheat Field with Cypresses*, 1889 (The Met) | Who painted this? | **Vincent van Gogh** · Claude Monet · Paul Cézanne · Paul Gauguin | Van Gogh painted it in 1889, while staying at the asylum in Saint-Rémy. |
| 2 | Who made this? | *The Milkmaid*, c. 1660 (Rijksmuseum) | Who painted this? | **Johannes Vermeer** · Rembrandt van Rijn · Frans Hals · Jan Steen | Fewer than 40 paintings are attributed to Vermeer. |
| 3 | True or false | *Under the Wave off Kanagawa*, c. 1830–32 (The Met) | "Hokusai's Great Wave is an oil painting." | True · **False** | It's a woodblock print. Many impressions were made, which is why several museums own one. |
| 4 | Which is older? | *The Harvesters*, 1565 (The Met) vs *The Night Watch*, 1642 (Rijksmuseum) | Which was painted first? | ***The Harvesters*** · *The Night Watch* | Bruegel's harvest scene is 77 years older than Rembrandt's militia company. |
| 5 | Who made this? | *The Death of Socrates*, 1787 (The Met) | Who painted this? | **Jacques-Louis David** · Eugène Delacroix · Francisco de Goya · J. M. W. Turner | David painted it in 1787, two years before the French Revolution. |
| 6 | True or false | *The Night Watch*, 1642 (Rijksmuseum) | "*The Night Watch* is the painting's original title." | True · **False** | Its official title is *Militia Company of District II under the Command of Captain Frans Banninck Cocq*. |
| 7 | Who made this? | *The Burning of the Houses of Lords and Commons*, 1835 (Cleveland Museum of Art) | Who painted this? | **J. M. W. Turner** · John Constable · Caspar David Friedrich · Thomas Cole | Turner watched the 1834 fire himself and painted it the next year. |
| 8 | Which is older? | *Under the Wave off Kanagawa*, c. 1830–32 (The Met) vs *The Burning of the Houses of Lords and Commons*, 1835 (Cleveland Museum of Art) | Which was made first? | ***The Great Wave*** · *The Burning of the Houses* | A close call: Hokusai's print came out a few years before Turner's fire. |
| 9 | True or false | *Water Lilies (Agapanthus)*, c. 1915–26 (Cleveland Museum of Art) | "Monet painted his water lilies from a pond in his own garden." | **True** · False | He had the pond dug at his home in Giverny and painted it for the rest of his life. |
| 10 | Who made this? | *Washington Crossing the Delaware*, 1851 (The Met) | Who painted this? | **Emanuel Leutze** · Gilbert Stuart · John Trumbull · Winslow Homer | Leutze painted this American icon in Düsseldorf, Germany. |

---

## Appendix C — Verdicts (from the app's `APPRAISAL_RANKS`)

`rank = Math.round(score / total * 7)`. With 5 questions, ranks 0, 1, 3, 4, 6 and 7 can occur; build pages for all eight anyway.

| Rank | Title | Message |
|---|---|---|
| 0 | Exiled to the Wastelands | An absolute disgrace. Your ignorance has deeply offended the court. You have been stripped of your lands and banished from the kingdom. |
| 1 | Set Ablaze | A catastrophic failure. Your assessment was deemed heretical, and you have been sentenced to the pyre. May the flames cleanse your terrible taste. |
| 2 | Imprisoned in the Dungeon | A dismal performance. The guards have seized you. You are locked in the dampest cell of the royal dungeon to reflect on your lack of culture. |
| 3 | Placed in the Stocks | A thoroughly embarrassing display. Your poor eye for the archives is now public knowledge. Prepare to be mocked by the village peasantry. |
| 4 | Demoted to Peasant | An utterly mediocre appraisal. You are unworthy of the court, stripped of your noble titles, and returned to the fields to till the earth. |
| 5 | Granted an Audience | A highly respectable assessment. You survived the trial and the Sovereign permits you to safely browse the artifacts within The Gallery. |
| 6 | Knighted by the Crown | A masterful display of historical knowledge. You are hereby dubbed a true Knight of the Archives. |
| 7 | Ascended to the Throne | Flawless perfection. The crown is yours. You rule the archives with absolute authority. |

Rank 7 differs from the app on purpose: "Claim your treasure." is dropped because no prize exists, and "the Explorer's Guild" becomes "the archives" so a free visitor doesn't read it as a subscription perk.
