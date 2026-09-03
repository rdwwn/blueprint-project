# 07 — Cookies Policy

> Short, plain-English explanation of how The Blueprint Project uses (or doesn't use) cookies and similar browser technologies. This is a standalone, scannable document. Full data handling is in our Privacy Policy.

**Last updated:** August 2026
**Effective date:** August 2026

---

## The short version

**We do not use cookies. We use browser localStorage to remember your saved programs and preferences. localStorage is similar to cookies but it stays on your device — we never see it.**

That's the whole thing. If you want the details, they're below.

---

## 1. What is a cookie, technically?

A cookie is a small text file that a website asks your browser to store on your device, then sends back to the website on every visit. Cookies were invented in 1994 to remember whether you'd already visited a site.

There are two main types:

- **First-party cookies:** set by the website you're visiting. Generally used to remember your preferences (e.g., "I prefer the dark theme").
- **Third-party cookies:** set by a different company (e.g., an ad network or analytics provider) when you visit a website. Used to track you across multiple sites.

The Blueprint Project sets **no cookies of either kind.**

---

## 2. What we use instead: localStorage

For the things cookies are usually used for, we use **browser localStorage**. localStorage is a feature built into every modern browser that lets a website store small amounts of data on your device. The key differences from cookies:

| | Cookies | localStorage |
|--|---------|--------------|
| Sent to server on every request | Yes | No (only used by JavaScript on the device) |
| Can be read by other sites | If third-party, yes | No — only the site that set them |
| Capacity | ~4KB per cookie | ~5-10MB per site |
| Expiration | Often (session or set date) | None — stays until cleared |
| Visible to the website operator | Yes (sent in HTTP headers) | No — only the website's JavaScript on that device |

For our use case (saving your saved programs, custom dates, and reviews), localStorage is **strictly better for privacy** than cookies. It never leaves your device. The website operator (us) cannot read it from our servers.

---

## 3. What we store in localStorage

| Key | What's in it | Why | Can you delete it? |
|-----|-------------|-----|-------------------|
| `blueprint.saved` | Array of program slugs you've bookmarked | So you can see your saved list | Yes — Dashboard → Clear all |
| `blueprint_status` | Which programs you've applied to / been accepted to | So your dashboard shows progress | Yes — Dashboard → Clear |
| `bp_custom_dates` | Your personal dates (exams, interviews, events) | So your calendar includes your dates | Yes — click the X next to each |
| `bp_program_reviews` | Reviews you've written (rating, text, optional name) | So you can edit them and so other devices can see them | Yes — Reviews → Delete |
| `bp_college_compare` | College IDs you've added to the comparison | So you can see what you were comparing | Yes — Compare page → Clear |
| `bp_quiz_completed` | "true" if you finished the Find Your Path quiz | So we don't show it again this session | Yes — clear browser data |
| `blueprint_compare` | Program IDs you've added to the comparison | So you can see what you were comparing | Yes — Compare page → Clear |

We do not store:

- ❌ Your name (unless you put it in a review, which is optional)
- ❌ Your email
- ❌ Your IP address
- ❌ Your physical location
- ❌ Your browsing history on other sites

---

## 4. Third-party technologies

### Mapbox

The interactive map on this site is powered by Mapbox. When you interact with the map, Mapbox may set its own cookies or localStorage items to remember your map preferences (zoom level, position, language). These are set by Mapbox directly, not by us. We do not have access to or control over the data Mapbox collects.

Mapbox's privacy practices are governed by [Mapbox's privacy policy](https://www.mapbox.com/legal/privacy). You can opt out of Mapbox tracking by [adjusting your Mapbox preferences](https://account.mapbox.com/) or by using a browser that blocks third-party cookies.

We selected Mapbox because it is SOC 2 compliant and offers clear privacy controls.

### Vercel (hosting)

Our site is hosted on Vercel. Vercel sets standard server logs (IP, user agent) and may use cookies for load balancing. Vercel has its own privacy policy at [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy). We have a Vercel Privacy Settings configuration that minimizes data collection.

### What we do NOT use

We do not use:

- Google Analytics
- Facebook Pixel
- TikTok Pixel
- Any advertising network
- Hotjar, Mixpanel, Amplitude, Segment, or other analytics tools
- Any session-replay tool
- Any chat widget that tracks you (we use Crisp only if you open it; the widget itself does not track you when it's closed)
- Any A/B testing framework that tracks you

---

## 5. How to clear cookies and localStorage

### In Chrome

1. Go to **Settings** → **Privacy and security** → **Site settings** → **Cookies and other site data** → **See all cookies and site data**
2. Search for "blueprint"
3. Click **Remove**
4. Or: **Settings** → **Privacy and security** → **Clear browsing data** → check "Cookies and other site data" and "Cached images and files" → Clear

### In Safari

1. **Safari** → **Preferences** → **Privacy** → **Manage Website Data**
2. Search for "blueprint"
3. Click **Remove**

### In Firefox

1. **Settings** → **Privacy & Security** → **Cookies and Site Data** → **Manage Data**
2. Search for "blueprint"
3. Click **Remove Selected**

### In our app

You can also clear your localStorage from inside the app:

1. Go to the **Dashboard**
2. Click **Settings** (in the sidebar)
3. Click **Clear all saved programs** (or use the in-app "Reset" button on the search page)

---

## 6. Do Not Track

We respect the "Do Not Track" browser signal. However, since we don't track you in the first place, this doesn't change anything. The same minimal-data policy applies regardless.

---

## 7. EU Cookie Consent (ePrivacy Directive)

Under the EU ePrivacy Directive (the "cookie law"), websites that set non-essential cookies must obtain consent before doing so. Because **we set no cookies and no third-party tracking**, we are not required to display a cookie consent banner.

If you are using a browser or extension that shows cookie banners as a default, you'll see no banner on The Blueprint Project, because we have nothing to ask consent for.

---

## 8. California Consumer Privacy Act (CCPA)

The CCPA requires businesses to disclose the categories of personal information collected. Since we don't use cookies for tracking and don't share data with third parties for cross-context behavioral advertising, the relevant categories are:

| Category | Collected? |
|----------|-----------|
| Identifiers (name, email, phone) | No |
| Commercial information (purchases) | No |
| Biometric information | No |
| Internet activity (browsing history) | Limited (server logs only, deleted in 30 days) |
| Geolocation | No (browser may share, but we don't store it) |
| Sensory data | No |
| Professional information | No |
| Inferences (profiles) | No |

---

## 9. Children's Online Privacy Protection Act (COPPA)

We do not knowingly collect any personal information from children under 13, including through cookies or localStorage. We do not require accounts and do not serve behavioral advertising to children.

---

## 10. Changes to this Cookies Policy

We may update this Cookies Policy from time to time. We will note the "Last updated" date at the top.

If we ever introduce a technology that could be considered a "cookie" in any legal sense (including localStorage, IndexedDB, Service Workers, or any other browser-side storage), we will update this policy and, if required by law, request consent.

---

## 11. Contact

Questions about cookies or localStorage? Email **contact@blueprintproject.app** with "COOKIES" in the subject line.

---

## 12. AI and Cookies

Some of our content (such as blog articles and resource guides) is drafted with assistance from AI tools. These tools do not set cookies on your device. AI assistants used by our team do not have access to your localStorage or browsing data.

---

*Last updated: August 2026*
*Effective: August 2026*
