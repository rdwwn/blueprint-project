# 04 — Data & Verification

> Where the 2,418 opportunities come from, how each one is verified, when the database is refreshed, and what's on the roadmap for data quality. This is the source of truth for anyone who works on or audits the database.

---

## 1. Data sources

The opportunities database is built from three primary sources, with one additional planned:

### 1.1 Primary: Manual research (current)

**The vast majority of listings are added by hand.** The Research Lead and a team of 5–20 volunteer verifiers identify programs through:

- Recommendations from school counselors and college access nonprofits
- Personal knowledge of well-known programs (RSI, MITES, Google CSSI, etc.)
- Research into the high school opportunity space
- Programs flagged by users through the Contribute flow
- Listings on other public databases (BigFuture, Fastweb, Scholarships.com, EC Database, Niche)

**Every listing goes through the same process:** a human reads the program's official page, copies the relevant information into the database, and verifies the link works. Nothing is auto-imported.

### 1.2 Secondary: Program organizer submissions (planned)

Within the next 6 months, we will add a secure portal for program organizers to submit and update their own listings. This is a higher-quality source than manual research because:

- The organizer knows the program best
- They can update it the moment a deadline changes
- It scales: 5,000 organizers can verify 5,000 programs faster than 5 researchers

The portal will include manual review before publication to prevent spam and low-quality listings.

### 1.3 Tertiary: User flags (current)

Anyone can flag a program as having a dead link, wrong deadline, or other issue. The Research Lead triages these flags weekly. The flag flow is the database's immune system.

### 1.4 Future: Partner organization feeds

We plan to integrate with a small number of trusted partner organizations (e.g., KIPP, QuestBridge, Equal Opportunity Schools) to receive their vetted listings directly. This would expand coverage in communities we're under-serving.

---

## 2. The verification process

### 2.1 What "verified" means

A program is marked "verified" when a human has confirmed all of the following within the last 90 days:

| Check | What we verify |
|-------|---------------|
| **Link works** | The official program URL returns a 200 and the page is about the program we describe |
| **Open to high schoolers** | The eligibility section explicitly says the program accepts high school students (not just college, not just teachers) |
| **Deadline is current** | The deadline listed in our database matches the current deadline on the program's website |
| **Description is accurate** | The description in our database is a fair summary of what the program actually offers |
| **Cost is accurate** | The cost/fee information is correct (free, paid, or has financial aid) |
| **Cost to apply** | Confirmed that applying is free, or that financial aid is available, or that the cost is explicitly disclosed |
| **Not a scam** | Confirmed the program is run by a legitimate organization (university, company, nonprofit) |
| **Not duplicate** | Confirmed the listing is not a duplicate of an existing entry |

### 2.2 The verification workflow

```
1. Research Lead identifies a program to add
            ↓
2. Verifier visits the program's official website
            ↓
3. Verifier checks all items in 2.1
            ↓
4. Verifier fills out the standard form in our database:
   - Program name
   - Organization
   - Category (internship / scholarship / competition / research / etc.)
   - Field
   - Eligibility
   - Location
   - Cost + cost detail
   - Deadline
   - Duration
   - URL
   - Description
   - Tags (Girls, Low-Income, 1st-Generation, etc.)
   - Season
   - Source
            ↓
5. Verifier marks the program as "verified" with today's date
            ↓
6. Listing appears on the site
            ↓
7. Program enters the 90-day re-verification cycle
```

### 2.3 The 90-day re-verification cycle

Every program is re-verified at least once every 90 days. Programs with frequent changes (rolling admissions, applications that open and close quickly) are re-verified more often. Programs that haven't been re-verified in 90 days are marked "unverified" in the database and may be hidden from search results.

This is the most important part of the process. It prevents dead links and outdated deadlines from accumulating.

### 2.4 The "verified" badge

When you see a program with a green "Verified" badge on the site, it means:

- A human has checked it in the last 90 days
- All 8 items in section 2.1 were confirmed

If a program is unverified (last check > 90 days), it still appears in search but without the badge.

---

## 3. The data model

Each program in the database is a record with the following fields:

```typescript
{
  // Required
  name: string                  // Program name as it appears on the official site
  org: string                   // Organization that runs the program
  category: string              // Internship | Scholarship | Competition | Research | Fellowship | Volunteer | etc.
  field: string                 // CS & Engineering | Medicine & Health | etc.
  location: string              // City, State, Country, or "Online" or "Nationwide"
  eligibility: string           // Who can apply (grades, age, citizenship, etc.)
  deadline: string              // Application deadline (parsed into a date)
  url: string                   // Official program URL
  verified: boolean             // True if verified in the last 90 days

  // Optional
  cost: string                  // Free | Paid | Stipend | etc.
  cost_detail: string           // "Free", "Stipend: $2,000", "Tuition: $5,000 with aid", etc.
  duration: string              // "6 weeks", "1 semester", "Rolling", etc.
  description: string           // 1–3 sentence summary
  tags: string[]                // ["Girls", "Low-Income", "1st-Generation", etc.]
  season: "Summer" | "School year"
  host: string                  // hostname extracted from URL (for favicon display)
  cat_norm: string              // Normalized category (e.g., "Internship" for variations)

  // Quality signals (optional)
  difficulty: "Open" | "Accessible" | "Moderate" | "Selective" | "Competitive"
  acceptance_rate: string       // "10%", "<5%", etc.
  essay_required: boolean
  recommendation_required: boolean
  prestige_tier: string         // "Top 10", "Top 50", "Recognized", "Emerging"
  application_effort: string    // "Low (< 2 hours)", "Medium (2–10 hours)", "High (10+ hours)"
  resume_value: string          // "High", "Medium", "Low"
}
```

---

## 4. The import pipeline

The database is stored in `src/data/opportunities.ts` as a TypeScript file. The import process:

1. **Source data** lives in `opp-research/merged3.json` (a JSON file of all opportunities)
2. **The Python script `scripts/import_data.py`** reads the JSON, enriches it with metadata, and produces the TypeScript file
3. **The script `scripts/update_fields.py`** adds fields like `difficulty`, `acceptance_rate`, `essay_required`, etc., to existing records

The full pipeline runs manually before each release. We are working toward:

- A database (Supabase / Postgres) so verifiers can edit directly
- A web-based admin tool so non-engineers can verify
- A version-controlled audit log so we can see who changed what when

---

## 5. What we don't do (yet)

- **We don't verify program outcomes.** We verify that the program exists and is what it says it is. We don't claim "this program will get you into MIT." We don't track where alumni end up. That's a different (much bigger) project.

- **We don't auto-import.** Every listing is added by a human. Auto-import from other databases would be faster but lower quality.

- **We don't accept payment to list a program.** Every listing is on the same footing. No "featured" or "sponsored" placements.

- **We don't rank by paid placement.** The "Most Popular" section on the homepage ranks by views, reviews, and verified-org reputation. It is not for sale.

---

## 6. Known limitations

These are real gaps in the current data. We're tracking them.

1. **International coverage is thin.** We have ~200 international programs out of 2,418. Coverage in the UK, Canada, and Singapore is good; coverage in Latin America, Africa, and most of Asia is sparse.

2. **Local scholarships are under-represented.** National programs are well-covered. Local community foundation scholarships (Rotary, Lions, Elks) are spotty because they require knowing the geography.

3. **Some categories are thin.** Performing arts, athletics, and trade programs have fewer listings than academics-focused programs.

4. **No standardized "difficulty" or "acceptance rate" data.** We infer this from program reputation and historical knowledge. The data is approximate.

5. **Verification is uneven.** Some programs have been re-verified this week; others haven't been touched in 89 days. The 90-day rule is the floor, not the goal.

6. **No community translations.** Listings are in English. Programs in non-English-speaking countries may have less context.

7. **No alumni data.** We don't know if "this internship leads to admissions success." That's a future project.

---

## 7. Quality targets

| Metric | Current | 6-month target | 12-month target |
|--------|---------|----------------|------------------|
| % of programs verified in last 90 days | TBD | 80% | 95% |
| Median time from flag to resolution | TBD | 7 days | 3 days |
| % of listings with all required fields | ~95% | 99% | 100% |
| % of listings with description | ~70% | 90% | 95% |
| Number of flag → correction events / month | TBD | 100 | 250 |
| Programs per verifier per week | ~15 | 20 | 30 |

---

## 8. Roadmap for data

### Q4 2026

- Move from static TypeScript file to live database (Supabase)
- Build admin web tool for non-engineer verifiers
- Add bulk-edit and bulk-import flows
- Standardize international eligibility tagging (visa-friendly, no-visa-required, etc.)
- Build a verification dashboard for the Research Lead

### Q1 2027

- Program organizer portal (secure self-service submissions)
- Partner organization data feeds
- Standardized difficulty / acceptance rate data
- Multilingual descriptions for top 100 international programs

### Q2 2027

- Alumni data (optional, opt-in)
- AI-assisted verification (suggest fields, detect duplicates)
- Public API for partner orgs

---

## 9. How to report a data issue

Anyone can flag a problem with a listing:

1. Go to the program page
2. Click "Flag Incorrect Information" in the Contribute section
3. Select the issue type (dead link, wrong deadline, program cancelled, other)
4. The Research Lead gets the flag and triages within 7 days

Or email **contact@blueprintproject.app** with "FLAG" in the subject line.

---

## 10. Audit and accountability

- All verification actions are logged (who, when, what changed)
- A weekly verification report is sent to the team showing:
  - How many programs were verified in the last 7 days
  - How many flags were resolved in the last 7 days
  - The list of programs that are now past 90 days
- The Founder reviews the report monthly
- A summary of verification metrics is published quarterly (transparency)

---

*Last updated: August 2026*
