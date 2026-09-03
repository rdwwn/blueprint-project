# The Blueprint Project — Documentation Hub

> **Single source of truth for the team, advisors, future contributors, lawyers, and future-us.**

This folder mirrors the structure of a Google Drive. Each document is provided in two formats:

1. **Markdown (`.md`)** — fast, version-controllable, lives in the repo
2. **Word (`.docx`)** — printable, easy to share, lawyer-friendly

If you need to convert these to Google Docs, upload the `.docx` files directly to Google Drive — they import cleanly.

---

## Documents

| # | File | Audience | Purpose |
|---|------|----------|---------|
| 01 | `Overview.md` | Everyone | One-page brief: what Blueprint is, who's it for, where it lives |
| 02 | `Team-Roles.md` | Future team | Every role a student-led org like this needs, with job descriptions |
| 03 | `Product-Requirements-Document.md` | Builders | Full PRD: problem, solution, features, success metrics, roadmap |
| 04 | `Data-and-Verification.md` | Researchers, advisors | Where 2,418 opportunities come from, how they're verified, when they refresh |
| 05 | `Terms-of-Service.md` | Users, lawyer | The rules that govern use of the directory |
| 06 | `Privacy-Policy.md` | Users, lawyer | What data we collect, what we don't, your rights |
| 07 | `Cookies-Policy.md` | Users, lawyer | Short statement: we don't use cookies, only local storage |
| 08 | `Brand-and-Contact.md` | Designers, partners | Visual identity, social handles, contact, domain |

---

## Quick facts about Blueprint

- **Name:** The Blueprint Project
- **Domain:** blueprintproject.app
- **Founded:** 2026
- **Audience:** US + international high school students (grades 9–12) and the educators/parents who advise them
- **Scale:** 2,400+ verified opportunities, 50+ fields, free to use
- **Business model:** Free, no paid tiers, no ads
- **Contact:** contact@blueprintproject.app
- **Social:** @blueprintproject.app on Instagram and TikTok

---

## How this is maintained

- **Owner:** the founder (currently you)
- **Cadence:** Reviewed quarterly, updated whenever a major feature ships or a legal requirement changes
- **Source of truth:** the `.md` files in this folder. The `.docx` files are generated; regenerate them after editing the `.md` (instructions below).
- **Public version:** `/privacy`, `/terms`, and (new) `/cookies` pages on the site reflect the legal docs.

## Regenerating the Word files

From the `Mark 20` folder, run:

```bash
python scripts/build_docs.py
```

This regenerates all `.docx` files in `docs/` from the `.md` sources.

---

*Last updated: August 2026*
