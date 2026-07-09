# KHANUM — Instagram Marketing Kit

Practical deliverables for KHANUM's organic Instagram video and sales strategy.

## Quick start

1. **Bio link page:** Open [`index.html`](index.html) in a browser — cart + Instagram checkout for all 52 books. Update `js/config.js` with your Instagram handle before hosting.
2. **Today:** Set up bio and highlights → [`instagram/bio-and-highlights.md`](instagram/bio-and-highlights.md)
3. **Post daily:** Follow the 30-day plan → [`content/30-day-content-calendar.md`](content/30-day-content-calendar.md)
4. **This weekend:** Batch-film Week 1 Reels → [`content/week-1-filming-scripts.md`](content/week-1-filming-scripts.md)
5. **Monday:** Start daily Stories → [`content/story-daily-rhythm.md`](content/story-daily-rhythm.md)
6. **Fill in prices:** Update [`sales/book-catalog.csv`](sales/book-catalog.csv) with your Rs. prices
7. **Every Sunday:** Log metrics → [`tracking/weekly-metrics.md`](tracking/weekly-metrics.md)

---

## Folder structure

```
khanum/
├── index.html                     # Bio-link shop page (host on Vercel / Netlify)
├── css/styles.css
├── js/                            # config.js, books.js, app.js
├── images/covers/                 # Book cover photos
├── instagram/
│   ├── bio-and-highlights.md      # Bio copy, link setup, highlight covers
│   └── highlights/                # Slide-by-slide content for each highlight
│       ├── order.md
│       ├── packing.md
│       ├── reviews.md
│       └── new-arrivals.md
├── content/
│   ├── 30-day-content-calendar.md # Full 30-day sales-optimized post plan (copy-paste)
│   ├── week-1-filming-scripts.md  # 5 Reels: intro, packing, 3 reader matches
│   ├── story-daily-rhythm.md      # Week 1 day-by-day Story calendar
│   ├── story-weekly-checklist.md  # Printable weekly Story tracker
│   └── hashtags.md                # Hashtag sets per format/book
├── sales/
│   ├── dm-templates.md            # 12 copy-paste DM reply templates
│   ├── book-catalog.md            # All 52 titles with mood bundles
│   └── book-catalog.csv           # Spreadsheet for prices & stock
└── tracking/
    ├── weekly-metrics.md          # Weekly review template
    ├── weekly-metrics.csv         # Spreadsheet for trends
    ├── reel-performance.csv       # Per-Reel analytics log
    └── orders-log.csv             # Order tracking
```

---

## Week 1 action checklist

- [ ] Update Instagram bio (copy from `instagram/bio-and-highlights.md`)
- [ ] Set WhatsApp link in bio
- [ ] Create 4 highlight covers in Canva (beige/cream, muted burgundy text)
- [ ] Post highlight slides (Order, Packing, Reviews, New Arrivals)
- [ ] Fill prices in `sales/book-catalog.csv`
- [ ] Batch-film 5 Reels (scripts in `content/week-1-filming-scripts.md`)
- [ ] Post Reel 1 (Brand Intro) — pin it
- [ ] Post Reel 2 (Packing Ritual) — pin it
- [ ] Post Reels 3–5 (Namal, Peer-e-Kamil, Raja Gidh)
- [ ] Post 2–4 Stories daily (calendar in `content/story-daily-rhythm.md`)
- [ ] Reply to every comment and DM within 2 hours
- [ ] Sunday: fill first week in `tracking/weekly-metrics.csv`

---

## Brand reminders

- Warm, never pushy
- Reels = discovery, Stories = conversion
- 2–3 Reels/week + daily Stories
- 60% anchor titles (Namal, Peer-e-Kamil, etc.), 40% curation picks
- Honest scarcity only when true

---

## Book cover photos

Cover images live in **`images/covers/`**. For each book the shop shows, in order:

1. Your own photo at `images/covers/<name>.jpg` (best — never breaks)
2. A web cover (for a few titles)
3. A coloured placeholder tile

**To add a photo:** take/scan the cover, save it as a `.jpg` with the exact filename below, and drop it into `images/covers/`. Refresh the page — done. (Portrait ~400×600px looks best.)

7 titles already have real covers: `namal`, `peer-e-kamil`, `raja-gidh`, `amar-bail`, `ishq-e-atish`, `zindagi-gulzar-hai`, `seerat-un-nabi-saw`.

Filenames still needing a photo:

| Book | Save photo as |
|------|---------------|
| Mala | `mala.jpg` |
| Mala 2 | `mala-2.jpg` |
| Hinave | `hinave.jpg` |
| Sulphite | `sulphite.jpg` |
| Maseel | `maseel.jpg` |
| Bakht | `bakht.jpg` |
| Bogi No 12 | `bogi-no-12.jpg` |
| Bab-e-Deher | `bab-e-deher.jpg` |
| Azazeel | `azazeel.jpg` |
| Usri Yusra | `usri-yusra.jpg` |
| Carpediem | `carpediem.jpg` |
| Main Anmol | `main-anmol.jpg` |
| Aabehayat | `aabehayat.jpg` |
| Kahf (Rabia Khan) | `kahf-rabia-khan.jpg` |
| Kahf (Abdullah Waseem) | `kahf-abdullah-waseem.jpg` |
| Jo Bachy Hain Sang Samet Lo | `jo-bachy-hain-sang-samet-lo.jpg` |
| Ehad-e-Alast | `ehad-e-alast.jpg` |
| Yeh Dil Mera | `yeh-dil-mera.jpg` |
| Khud Se Khud Tak | `khud-se-khud-tak.jpg` |
| Rab Se Jurny Ka Safar | `rab-se-jurny-ka-safar.jpg` |
| La Hasil | `la-hasil.jpg` |
| Hasil | `hasil.jpg` |
| Aks | `aks.jpg` |
| Man-o-Salwa | `man-o-salwa.jpg` |
| Mushaf (New Edition) | `mushaf-new-edition.jpg` |
| JKP (New Edition) | `jkp-new-edition.jpg` |
| Paras | `paras.jpg` |
| Karakoram Ka Taj Mehal | `karakoram-ka-taj-mehal.jpg` |
| Halim | `halim.jpg` |
| Shehr-e-Zaat | `shehr-e-zaat.jpg` |
| Woh Jo Qarz Rakhty Thy | `woh-jo-qarz-rakhty-thy.jpg` |
| Hurf Se Lafz Tak | `hurf-se-lafz-tak.jpg` |
| Diyare Dil | `diyare-dil.jpg` |
| Dil Se Nikly Hain Jo Lafz | `dil-se-nikly-hain-jo-lafz.jpg` |
| Malal (Ahmed Rao) | `malal-ahmed-rao.jpg` |
| Kayi Chand Thy Sar-e-Aasman | `kayi-chand-thy-sar-e-aasman.jpg` |
| Hijab | `hijab.jpg` |
| Jo Rukay To Koh-e-Giran Thy Hum | `jo-rukay-to-koh-e-giran-thy-hum.jpg` |
| Iblees | `iblees.jpg` |
| Bismil | `bismil.jpg` |
| Jabal | `jabal.jpg` |
| Chiste Hayat Dawam | `chiste-hayat-dawam.jpg` |
| Talam Nagri | `talam-nagri.jpg` |
| Crystal Eyes | `crystal-eyes.jpg` |
| Ankaboot | `ankaboot.jpg` |

---

## Placeholders to replace

Search for `[BRACKETS]` across files:

- `[YOUR_NUMBER]` — WhatsApp number
- `[PRICE]` — book prices in Rs.
- `[X–X]` — delivery timeline
- `[ACCOUNT DETAILS]` — payment info
- `@khanumm.official` — Instagram handle (already set in `js/config.js`)
