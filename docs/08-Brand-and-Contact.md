# 08 — Brand & Contact

> Visual identity, voice, social handles, contact, and partnership info. The single source of truth for anyone making something that represents The Blueprint Project — a graphic, a partnership email, a press mention, or a co-marketing piece.

**Last updated:** August 2026

---

## 1. Identity

### Name

**The Blueprint Project**

- The word "Blueprint" is always capitalized.
- "The Blueprint Project" (with "The") is used in formal contexts: legal, About page, footer copyright.
- "Blueprint" (without "The") is used casually: in product copy, social bios, marketing.
- Never abbreviate to "TBP" or "BPP" in user-facing copy.
- Never call it "BlueprintProject" as one word (the logo and URL use a hyphen-less version, but in prose we always split the words).

### Tagline

> "Free, hand-verified opportunities for high school students."

Short version: "Find every serious opportunity."

Even shorter: "The free database for ambitious high schoolers."

### Mission (one line)

> Make the same opportunity awareness available to every high schooler, regardless of family income, zip code, or social capital.

### One-sentence pitch

> The free, hand-verified database of every serious opportunity a high school student can apply to — and the tools to actually apply on time.

---

## 2. Domain

**Primary:** `blueprintproject.app`

- The `.app` TLD signals "application" — appropriate for a directory of programs.
- All subdomains (none currently) inherit this identity.
- We do not own `blueprint.com` or `blueprint.org`. We own `.app`.

**Production URL:** https://blueprintproject.app
**Staging URL:** internal only

---

## 3. Visual identity

### Colors

| Token | Hex | Usage |
|-------|-----|--------|
| **Primary** (blue) | `#1E58D6` | Buttons, links, primary CTAs |
| **Accent** (teal) | `#0F766E` | Success states, secondary actions, waves |
| **Navy** (dark) | `#0F172A` | Footer, dark sections |
| **Background** (paper) | `#FAF9F4` | Page background, warm off-white |
| **Card** | `#FFFFFF` | Cards, modals |
| **Foreground** (ink) | `#1B2A4A` | Primary text |
| **Muted** | `#F2EFE6` | Subtle backgrounds, hover states |
| **Muted foreground** | `#5D6B80` | Secondary text |
| **Border** | `#E3DDCF` | Subtle dividers |
| **Success** | `#0F9D6E` | Positive feedback |
| **Warning** | `#D97706` | Cautions |
| **Danger** | `#DC2626` | Errors, urgent deadlines |

These are the design tokens defined in `src/app/globals.css` under `@theme inline`. They are the canonical reference.

### Typography

- **Display font:** Geist Sans (via `next/font/google` and `font-family: var(--font-geist-sans)`)
- **Mono font:** Geist Mono (for technical labels, badges, draft-style elements)
- **Fallback:** system-ui, -apple-system, sans-serif

We use Geist because it has a clean, blueprint-friendly feel: precise, technical, modern. We deliberately avoid script, serif, or display fonts to maintain the "drafting table" aesthetic.

### Logo

The logo file is at `public/logo-full.png` (full logo with text) and `public/logo-icon.png` (icon only).

- **Logo usage rules:**
  - Do not stretch, skew, or recolor the logo
  - Maintain clear space equal to the height of the icon around the logo
  - On dark backgrounds, use a light version (future)
  - Minimum size: 24px tall for the icon, 80px wide for the full logo

### Iconography

- `lucide-react` for utility icons (search, settings, calendar, etc.)
- `phosphor-react` for category icons (CS, medicine, arts, etc.) — for their friendlier, more illustrative style

### Design aesthetic

- **Abstract geometric & data-viz.** Inspired by blueprint drawings: grid patterns, registration crosses, draft corners, dimension lines.
- **Subtle, never loud.** Background patterns at 5–15% opacity. Accents only where they matter.
- **One polished light theme.** No dark mode toggle. (Decision made in v11.)
- **Paper texture.** A subtle grain overlay on hero and detail sections to evoke a drafting paper feel.

---

## 4. Voice

### Tone

- **Honest.** We don't oversell. We don't promise outcomes. We say what we are and what we aren't.
- **Warm but professional.** We sound like a knowledgeable friend, not a corporate brochure.
- **Direct.** Short sentences. Active voice. No filler.
- **Smart without showing off.** We assume the reader is capable. We don't dumb things down. We don't talk down.

### Examples of voice

**Good:**

- "RSI is one of the most selective research programs in the country. Apply if you can."
- "We don't run any of these programs. We just find them for you."
- "If a deadline is wrong, tell us. We'll fix it."

**Avoid:**

- "Unlock your potential" (corporate jargon)
- "We're the #1 platform for high schoolers" (unsubstantiated)
- "Don't miss out!" (manufactured urgency)
- Em dashes, AI-pattern words, sales language

### Grammar and formatting

- Use Oxford comma.
- Capitalize "Blueprint" and "The Blueprint Project." Don't capitalize "high school."
- Use sentence case for headlines, not Title Case.
- "E-mail" is "email." "Web site" is "website." (One word, no hyphen.)
- Use real em dashes sparingly — they're fine in editorial copy, avoid in UI.
- Don't use the "AI words" (delve, leverage, robust, etc.). Humanize everything.

### AI-assisted drafting

AI tools assist with drafting blog articles, resource guides, and program descriptions. All AI-assisted content is reviewed and edited by a human before publication. Voice and final tone are human-controlled.

---

## 5. Social

| Channel | Handle | URL | Cadence |
|---------|--------|-----|---------|
| Instagram | @blueprintproject.app | instagram.com/blueprintproject.app | 3x/week |
| TikTok | @blueprintproject.app | tiktok.com/@blueprintproject.app | 3x/week |
| Email | contact@blueprintproject.app | — | within 48 hours |
| Newsletter | (launching Q4 2026) | — | bi-weekly |
| LinkedIn | (planned) | — | weekly |
| YouTube | (planned) | — | monthly |

**Hashtags:**

- #BlueprintProject
- #HighSchoolOpportunities
- #CollegeAdmissions (for reach)
- #Internships (for reach)

Don't use #college, #admissions, or any generic high-volume hashtag — they get buried.

---

## 6. Contact

### General

**Email:** contact@blueprintproject.app
**Response time:** within 48 hours on weekdays

### For specific topics

| Topic | Email | Subject line |
|-------|-------|--------------|
| Privacy questions | contact@blueprintproject.app | "PRIVACY" |
| Terms of Service | contact@blueprintproject.app | "TERMS" |
| Cookies / data | contact@blueprintproject.app | "COOKIES" |
| Program flag | contact@blueprintproject.app | "FLAG" |
| Press / media | press@blueprintproject.app (planned) | "PRESS" |
| Partnerships | partners@blueprintproject.app (planned) | "PARTNERSHIP" |
| Security disclosure | contact@blueprintproject.app | "SECURITY" |
| Accessibility | contact@blueprintproject.app | "ACCESSIBILITY" |
| Data deletion request | contact@blueprintproject.app | "DATA DELETION" |

### Mailing address (when incorporated)

To be filled in once a legal entity is formed. Currently operates as a sole proprietorship / unincorporated organization.

### Press kit

A press kit with high-resolution logo, screenshots, and a one-pager is at `/press` (planned) or available on request.

---

## 7. Partnerships

We're open to partnerships with:

- **High school counseling offices and districts.** Want a Blueprint-branded handout for your grade level? Email us.
- **College access nonprofits.** KIPP, QuestBridge, College Track, Equal Opportunity Schools, Matriculate, and similar. Let's talk about integration.
- **Universities and programs.** If you run a program for high schoolers, we'll keep your listing accurate. We don't do paid placement.
- **Other public-good databases.** Fastweb, Scholarships.com, BigFuture, EC Database. Let's share data, not compete.

We are not interested in partnerships with:

- Paid admissions consulting services (we don't recommend them)
- Scholarship-matching services that sell user data
- Anyone who wants us to remove or de-prioritize a competitor
- Anyone who wants us to "feature" their program for a fee (we don't do that)

To propose a partnership, email **contact@blueprintproject.app** with subject "PARTNERSHIP."

---

## 8. Press and mentions

If you'd like to write about The Blueprint Project, here are some quick facts and the right contact.

**Boilerplate (short):**

> The Blueprint Project is a free, hand-verified directory of internships, scholarships, competitions, and research programs for high school students. Founded in 2026, it lists 2,400+ opportunities and is used by students, parents, and counselors across the US and internationally.

**Boilerplate (long):**

> The Blueprint Project is a free, hand-verified directory of high school opportunities. Founded in 2026 by a student who saw how locked up opportunity awareness was, it now lists more than 2,400 internships, scholarships, competitions, and research programs. Every listing is checked by hand every 90 days. The site includes a 60-second Find Your Path quiz, a deadline calendar, a US + World map, side-by-side program comparison, and a personal dashboard for tracking applications. The mission: make the same opportunity awareness available to every high schooler, regardless of family income, zip code, or social capital.

**Press contact:** contact@blueprintproject.app with subject "PRESS"

---

## 9. Legal entity

As of August 2026, The Blueprint Project is operated as a **sole proprietorship** by the founder.

**Planned entity:** A Delaware public-benefit corporation (or equivalent) within 12 months. This will allow us to:
- Apply for grants as a recognized nonprofit (501(c)(3) status)
- Sign contracts with school districts
- Open a bank account in the org's name
- Limit personal liability

**EIN:** To be assigned at incorporation
**State of formation:** Delaware (US)

---

## 10. Credits

- **Founder:** [Your Name]
- **Engineering:** [Team]
- **Design:** [Team]
- **Research:** [Team]
- **Content:** [Team]
- **Advisors:** [List]

---

*Last updated: August 2026*
