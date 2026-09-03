# 03 — Product Requirements Document (PRD)

> The full PRD for The Blueprint Project. Updated August 2026. Format modeled on industry-standard PRDs. Use this to align the team on scope, priorities, and success criteria.

---

## 1. Summary

The Blueprint Project is a free, hand-verified directory of high school opportunities (internships, scholarships, competitions, research programs) with tools to discover, organize, and apply. It exists to make the same opportunity awareness available to every high schooler, regardless of family income, zip code, or social capital.

**One-sentence pitch:** "The free, hand-verified database of every serious opportunity a high school student can apply to — and the tools to actually apply on time."

**Version:** v20 (August 2026). Replaces v11 (June 2026).

---

## 2. Problem

### 2.1 What's wrong today

High-achieving high schoolers who land at top colleges and selective programs almost always start earlier than their peers. Research, internships, competitions, and scholarships build on each other — by senior year, the kid who's been doing programs since sophomore year is in a fundamentally different position than the kid who just started looking.

The information about which programs to apply to is **locked behind three barriers:**

1. **Incomplete databases.** Most public lists (BigFuture, Fastweb, Scholarships.com) are missing the most selective programs (RSI, MITES, QuestBridge) or are cluttered with scams and low-quality listings. They rarely show the full picture.
2. **Paid consulting.** College admissions advising costs $1,000–$10,000+. Essay coaching is $200+ per hour. The students who would benefit most are the ones who can't afford it.
3. **Family networks.** Most students at top schools have parents who went to top schools. They learn about opportunities through conversations at dinner, not through public databases.

The result: a high schooler in a low-income zip code is competing against a high schooler in a wealthy zip code who has the same talent but a 5-year head start on knowing what's available.

### 2.2 What students actually do today

A typical "good student" in 2026:

1. Googles "high school internships"
2. Lands on a Forbes or US News listicle
3. Clicks 3 dead links
4. Misses the deadline for the one good program
5. Asks their college-graduate cousin for advice
6. Gets a partial list
7. Applies to 2 of 5 programs
8. Repeats next year

**The median time from "I should look for programs" to "I applied to a real program" is 6 weeks.** During those 6 weeks, 80% of deadlines have already passed.

### 2.3 What educators and parents do today

A high school counselor at a public school might advise 400+ students. They have no time to curate a list. They point students at the same generic lists they've been pointing at for 20 years. Parents of motivated students pay for College Confidential, prep coaches, and admissions consultants.

---

## 3. Solution

### 3.1 The product

A free, public-good web application that:

- Lists every serious high school opportunity (internship, scholarship, competition, research program)
- Verifies each one by hand: link works, deadline is current, eligibility matches, program is open to high schoolers
- Lets students search, filter, and save
- Surfaces upcoming deadlines
- Recommends programs based on a 60-second quiz
- Lets students track their applications in a personal dashboard
- Allows the community to flag outdated or incorrect information

### 3.2 Core principles

1. **Free forever.** No paywalls, no premium tiers, no "featured" listings.
2. **Hand-verified.** Every program is checked by a human before it ships.
3. **Privacy-first.** No accounts required. No tracking. No data sold.
4. **No editorializing.** We list programs. We don't rank them subjectively. We let the user decide.
5. **Open to the public.** Anyone can browse, save, and apply without giving us their email.

### 3.3 What we are not

- Not an application portal. Applications happen on the program's own site.
- Not a college admissions consulting service. We don't write essays or coach interviews.
- Not a social network. We don't have follower counts, DMs, or a public profile.
- Not a scholarship-matching service (yet). We list scholarships; we don't auto-match.

---

## 4. Target users

### 4.1 Primary

**US + international high school students, grades 9–12.** Roughly 16 million in the US alone. The addressable subset — students who are motivated enough to look for programs — is maybe 2–3 million.

### 4.2 Secondary

- **Parents and guardians** (~10% of traffic)
- **High school counselors and educators** (~5% of traffic, much higher leverage)
- **College access nonprofits** (distribution partners)
- **Program organizers** (corrections and updates)

### 4.3 Personas

**Persona 1: "Maya" (rising junior, San Jose, CA)**
- Top 10% of her class at a competitive public school
- Knows she wants to study CS but doesn't know which programs to apply to
- Has no family history of college advising
- Willing to do 2 hours of research per week if she knows what to do
- **Needs:** a definitive list of CS programs for juniors, with deadlines, that she can filter by what's still open
- **Success:** saves 8 programs, applies to 4, gets into 1

**Persona 2: "Mr. Davis" (college counselor, Title 1 high school, Detroit, MI)**
- Advises 450 students
- Has 8 hours per week of unstructured time for college guidance
- Recommends the same 5 scholarships to every senior
- **Needs:** a way to bulk-export a grade-level list of opportunities, with a printable handout format
- **Success:** hands out a Blueprint list to 50 seniors; 12 of them apply to a program they would have missed

**Persona 3: "Priya" (rising senior, London, UK)**
- International student applying to US + UK universities
- Looking for fully-funded research programs and competitions
- Doesn't know which US programs accept international students
- **Needs:** filterable by international eligibility, country, and visa-friendliness
- **Success:** finds 3 international-friendly programs and applies to all of them

---

## 5. User stories

### 5.1 Discovery

- As a student, I want to **see what's out there** so I know what's possible.
- As a student, I want to **filter by my grade and field** so I only see what's relevant.
- As a student, I want to **see deadlines coming up** so I don't miss the next one.
- As a student, I want to **see programs near me** so I can find in-person opportunities.
- As a student, I want to **see international programs** so I can apply to ones abroad.
- As a student, I want to **see programs that match my interests** so I don't have to scroll forever.
- As a parent, I want to **see a printable list** for my kid.
- As a counselor, I want to **export a bulk list** for a grade level.

### 5.2 Action

- As a student, I want to **save a program** so I can come back to it.
- As a student, I want to **mark a program as applied** so I can track my progress.
- As a student, I want to **see all my upcoming deadlines in one place**.
- As a student, I want to **add my own custom dates** (exams, interviews) to the calendar.
- As a student, I want to **compare 2–4 programs side by side** so I can pick the best one.
- As a student, I want to **share a list with a friend** via a public link.
- As a student, I want to **write a review of a program I did** so others know what to expect.
- As a student, I want to **flag a dead link or wrong date** so the database stays accurate.

### 5.3 Trust

- As a student, I want to **know the program is real** so I don't waste time on a scam.
- As a parent, I want to **know my kid's data is private** so I don't worry about tracking.
- As a counselor, I want to **know the deadlines are current** so I don't recommend something past-due.

---

## 6. Features

### 6.1 Shipped (as of v20)

| Feature | Description | Status |
|---------|-------------|--------|
| **Hero search** | Bar at top of home with rotating placeholder suggestions | Live |
| **Find Your Path quiz** | 60-second quiz: interests → field → work type → grade → location → recommendations | Live |
| **Top Searches** | 8 popular starting points (summer, paid, engineering, research, etc.) on home | Live |
| **Search & filter** | 12+ filters: field, category, cost, format, season, grade, location, tags, deadline window, duration, scholarship type | Live |
| **Map view** | US + World Mapbox map with teardrop pins, location pill, status counter, fullscreen toggle | Live |
| **Save & Dashboard** | localStorage-backed saved programs, status tracking (saved/applied/accepted), deadline calendar with custom dates | Live |
| **Compare programs** | Side-by-side comparison of up to 4 programs | Live |
| **Compare colleges** | 19 top colleges with side-by-side comparison | Live |
| **Reviews** | 5-star rating + written reviews on every program | Live |
| **Blog** | 6 long-form articles on admissions, summer planning, application strategy | Live |
| **Resources** | 8 guides: essay writing, interview prep, resume, research, mentors, cold email, time management, standing out | Live |
| **Success stories** | Real-student stories with photos, quotes, programs, outcomes | Live |
| **Most Popular & Recently Added** | Homepage sections that surface top + new programs | Live |
| **Contribute** | Create a list, share feedback, flag incorrect info (3 pages) | Live |
| **Mobile responsive** | Full experience on phone, tablet, desktop | Live |
| **Custom dates** | Add personal dates (exams, interviews) to deadline calendar | Live |

### 6.2 In progress (next 90 days)

- **Newsletter** — bi-weekly email with new programs and upcoming deadlines
- **Bulk export for counselors** — CSV / PDF export of grade-level lists
- **Program organizer portal** — secure portal for organizers to update their own listings
- **User accounts (optional)** — email + magic link for users who want cross-device sync of saved programs
- **Analytics dashboard** — for the team to see which programs get the most interest

### 6.3 Backlog (6–12 months)

- **Native mobile app** — currently web-only
- **AI-powered recommendations** — based on saved programs, suggest similar ones
- **Essay review integration** — partner with essay coaching nonprofits
- **Direct applications** — for programs that accept applications via simple forms
- **Public API** — for partner orgs to embed our listings
- **International expansion** — country-specific landing pages and listings
- **Scholarship auto-match** — based on student profile, suggest scholarships
- **Parent / educator view** — see what a student has saved and applied to (with consent)

### 6.4 Explicitly not building

- Social network features (followers, DMs, public profiles)
- Essay grading or admissions consulting
- College application platform (Common App integration)
- Paid tiers or premium features
- Advertising of any kind

---

## 7. Success metrics

### 7.1 North star

**Number of high schoolers who applied to a program they found on Blueprint in the last 30 days.**

(Not "saved" — that can be misleading. Not "page view" — that doesn't capture value. **Applied** is the user action that means we did our job.)

### 7.2 Primary metrics

| Metric | Current | 6-month target | 12-month target |
|--------|---------|----------------|------------------|
| Monthly active users (MAU) | TBD | 25,000 | 50,000 |
| Programs applied to (from Blueprint) / month | TBD | 5,000 | 15,000 |
| Newsletter subscribers | 0 | 2,500 | 5,000 |
| Verified opportunities | 2,418 | 2,700 | 3,000 |
| % of programs verified in last 90 days | TBD | 80% | 95% |
| Median time: first session → first save | TBD | <30s | <20s |
| Median time: first session → first application | TBD | 14 days | 7 days |

### 7.3 Secondary metrics

- **Distribution:** % of US public high school students aware of Blueprint (target: 10% in 12 months)
- **Engagement:** DAU/MAU ratio (target: >15%)
- **Quality:** % of programs with no flags in last 90 days (target: >85%)
- **Reach:** % of programs accessible to low-income students (free or with financial aid)
- **Search success rate:** % of searches that result in a save (target: >40%)

### 7.4 What we don't measure

- Page views
- Time on site (we don't have analytics yet)
- Bounce rate
- Ad impressions
- Followers / likes (we don't have social features)

---

## 8. Non-goals

To keep the team focused, the following are explicitly out of scope:

1. **Building a college application platform.** Common App, Coalition, etc. exist. We don't compete with them.
2. **Becoming a paid product.** Free is the model. If we ever monetize, it's through grants, not user fees.
3. **Replacing college counselors.** We're a tool for counselors, not a replacement.
4. **Writing essays or coaching interviews.** We list programs. We don't advise.
5. **Verifying program outcomes** (e.g., "this internship actually got you into MIT"). We verify that the program exists and is what it says it is. We don't measure outcomes.

---

## 9. Constraints

### 9.1 Legal

- **COPPA** — must be safe for users under 13. We don't collect personal info, so we're effectively COPPA-safe by design.
- **GDPR / UK-GDPR** — for international users, we follow the same minimal-data approach.
- **Section 230** — we're a directory, not a publisher. We link out to programs; we're not responsible for their content.

### 9.2 Operational

- **Free forever** — no paid features, no ads. The team is volunteer or grant-funded.
- **Hand-verified** — every listing is checked by a human. This caps scale at maybe 5,000 listings before we need to scale verification.
- **No accounts required** — everything works with localStorage. Accounts are optional for cross-device sync.

### 9.3 Technical

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** strict
- **Tailwind CSS v4**
- **Mapbox GL** for the map
- **Vercel** for hosting
- **Supabase** when we add accounts (planned)
- **localStorage** for user data (no server-side user data today)

### 9.4 Budget

- Current: ~$30/month (Vercel free tier, Mapbox free tier)
- 12-month target: ~$500/month (Vercel Pro, Supabase, email service, newsletter)
- 24-month target: ~$2,000/month (with team stipends, contractor budgets, etc.)
- All covered by founder's funds and future grants. No advertising revenue.

---

## 10. Roadmap

### 10.1 Now (Q3 2026)

- [x] Hand-verified database at 2,400+ programs
- [x] Search & filter with live facet counts
- [x] Map view (US + World)
- [x] Save & dashboard with deadline calendar
- [x] Find Your Path quiz
- [x] Compare programs
- [x] Blog, Resources, Success Stories, Reviews, Compare Colleges
- [x] Mobile responsive
- [x] Custom dates on calendar

### 10.2 Next (Q4 2026)

- [ ] Newsletter (bi-weekly)
- [ ] Bulk export (CSV, PDF) for counselors
- [ ] Program organizer portal
- [ ] Optional accounts (email + magic link, cross-device sync)
- [ ] Analytics dashboard for the team
- [ ] Expanded international coverage (UK, Canada, Singapore, India)
- [ ] Reach 25,000 MAU
- [ ] 2,700 verified programs

### 10.3 Later (Q1–Q2 2027)

- [ ] AI-powered recommendations
- [ ] Native mobile app
- [ ] Public API
- [ ] 5,000 newsletter subscribers
- [ ] 3,000 verified programs
- [ ] 50,000 MAU

### 10.4 Future (Q3 2027+)

- [ ] Essay review integration
- [ ] Direct application support
- [ ] Parent / educator view
- [ ] International expansion
- [ ] 100,000 MAU
- [ ] 5,000 verified programs (cap of hand-verification without process change)

---

## 11. Open questions

1. **Accounts** — do we add optional accounts in Q4 2026, or wait until there's clear user demand?
2. **Mobile app** — is the web experience enough, or do we need a native app to reach low-bandwidth users?
3. **International** — what's the priority order of countries after the US?
4. **Scholarship auto-match** — when and how do we introduce this? Risk: feels invasive. Benefit: massive time save.
5. **Monetization** — what's the right path if we need more money? Grants, donor-supported "Fellowship" tier, sponsored listings (we'd never do this), or something else?

---

*Last updated: August 2026*
