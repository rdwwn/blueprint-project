import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalCallout } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "How The Blueprint Project uses (or doesn't use) cookies and browser storage.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies Policy"
      subtitle="Short, plain-English explanation of how we use cookies and similar browser technologies."
      lastUpdated="September 2026"
    >
      <LegalCallout>
        <p>
          <strong>The short version:</strong> We do not use cookies. We use browser localStorage plus a small anonymous database to remember your saved programs and preferences. Nothing is tied to your name or email, and we never sell anything.
        </p>
      </LegalCallout>

      <LegalSection title="1. What is a cookie, technically?">
        <p>
          A cookie is a small text file that a website asks your browser to store on your device, then sends back to the website on every visit. Cookies were invented in 1994 to remember whether you&apos;d already visited a site.
        </p>
        <p>There are two main types:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>First-party cookies:</strong> set by the website you&apos;re visiting. Generally used to remember your preferences.</li>
          <li><strong>Third-party cookies:</strong> set by a different company (e.g., an ad network) when you visit a website. Used to track you across multiple sites.</li>
        </ul>
        <p><strong>The Blueprint Project sets no cookies of either kind.</strong></p>
      </LegalSection>

      <LegalSection title="2. What we use instead: localStorage">
        <p>
          For the things cookies are usually used for, we use <strong>browser localStorage</strong>. localStorage is a feature built into every modern browser that lets a website store small amounts of data on your device. The key differences from cookies:
        </p>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold"></th>
              <th className="py-2 pr-4 font-semibold">Cookies</th>
              <th className="py-2 font-semibold">localStorage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Sent to server on every request</td>
              <td className="py-2 pr-4">Yes</td>
              <td className="py-2">No (only used by JavaScript on the device)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Can be read by other sites</td>
              <td className="py-2 pr-4">If third-party, yes</td>
              <td className="py-2">No — only the site that set them</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Capacity</td>
              <td className="py-2 pr-4">~4KB per cookie</td>
              <td className="py-2">~5-10MB per site</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Expiration</td>
              <td className="py-2 pr-4">Often (session or set date)</td>
              <td className="py-2">None — stays until cleared</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Visible to website operator</td>
              <td className="py-2 pr-4">Yes (sent in HTTP headers)</td>
              <td className="py-2">No — only the website&apos;s JavaScript on that device</td>
            </tr>
          </tbody>
        </table>
        <p>We keep a local copy of your saved programs and settings in localStorage so pages load instantly. Your saved list also syncs to our server under an <strong>anonymous random ID</strong> (no name, email, or account) so it survives browser resets. Reviews and reports you submit are stored on our server because they are shared or moderated content — still under the same anonymous ID, never your identity.</p>
      </LegalSection>

      <LegalSection title="3. What we store in localStorage">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Key</th>
              <th className="py-2 pr-4 font-semibold">What&apos;s in it</th>
              <th className="py-2 font-semibold">Delete it</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>blueprint.saved</code></td>
              <td className="py-2 pr-4">Program slugs you&apos;ve bookmarked (also synced to our server under your anonymous ID)</td>
              <td className="py-2">Dashboard → Clear all</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>blueprint_status</code></td>
              <td className="py-2 pr-4">Applied / accepted status</td>
              <td className="py-2">Dashboard → Settings</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>bp_custom_dates</code></td>
              <td className="py-2 pr-4">Your personal dates</td>
              <td className="py-2">Click the X next to each</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>blueprint.anon_id</code></td>
              <td className="py-2 pr-4">An anonymous random ID (no name or email) used to sync your saved programs, reviews, and reports with our server</td>
              <td className="py-2">Clear browser data</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>bp_college_compare</code></td>
              <td className="py-2 pr-4">Colleges in your comparison</td>
              <td className="py-2">Compare page → Clear</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code>bp_quiz_completed</code></td>
              <td className="py-2 pr-4">&quot;true&quot; if you finished the Find Your Path quiz</td>
              <td className="py-2">Clear browser data</td>
            </tr>
          </tbody>
        </table>
        <p>We do not store your name (unless you put it in a review, which is optional), email, IP address, physical location, or browsing history on other sites.</p>
      </LegalSection>

      <LegalSection title="4. Third-party technologies">
        <p>
          <strong>Mapbox.</strong> The interactive map on this site is powered by Mapbox. When you interact with the map, Mapbox may set its own cookies or localStorage items to remember your map preferences (zoom level, position, language). These are set by Mapbox directly, not by us. We do not have access to or control over the data Mapbox collects.
        </p>
        <p>
          Mapbox&apos;s privacy practices are governed by <a href="https://www.mapbox.com/legal/privacy">Mapbox&apos;s privacy policy</a>. You can opt out of Mapbox tracking by <a href="https://account.mapbox.com/">adjusting your Mapbox preferences</a> or by using a browser that blocks third-party cookies.
        </p>
        <p>
          We selected Mapbox because it is SOC 2 compliant and offers clear privacy controls.
        </p>
        <p>
          <strong>Vercel (hosting).</strong> Our site is hosted on Vercel. Vercel sets standard server logs (IP, user agent) and may use cookies for load balancing. Vercel has its own privacy policy at <a href="https://vercel.com/legal/privacy-policy">vercel.com/legal/privacy-policy</a>. We have a Vercel Privacy Settings configuration that minimizes data collection.
        </p>
        <p>We do <strong>not</strong> use Google Analytics, Facebook Pixel, TikTok Pixel, any advertising network, Hotjar, Mixpanel, Amplitude, Segment, or any session-replay tool.</p>
      </LegalSection>

      <LegalSection title="5. How to clear cookies and localStorage">
        <p className="font-semibold">In Chrome</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Settings → Privacy and security → Site settings → Cookies and other site data → See all cookies and site data</li>
          <li>Search for &quot;blueprint&quot;</li>
          <li>Click Remove</li>
        </ol>
        <p className="mt-3 font-semibold">In Safari</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Safari → Preferences → Privacy → Manage Website Data</li>
          <li>Search for &quot;blueprint&quot;</li>
          <li>Click Remove</li>
        </ol>
        <p className="mt-3 font-semibold">In Firefox</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Settings → Privacy & Security → Cookies and Site Data → Manage Data</li>
          <li>Search for &quot;blueprint&quot;</li>
          <li>Click Remove Selected</li>
        </ol>
        <p className="mt-3 font-semibold">In our app</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Go to the Dashboard</li>
          <li>Click Settings</li>
          <li>Click Clear all saved programs (or use the in-app &quot;Reset&quot; button on the search page)</li>
        </ol>
      </LegalSection>

      <LegalSection title="6. Do Not Track">
        <p>
          We respect the &quot;Do Not Track&quot; browser signal. However, since we don&apos;t track you in the first place, this doesn&apos;t change anything. The same minimal-data policy applies regardless.
        </p>
      </LegalSection>

      <LegalSection title="7. EU Cookie Consent (ePrivacy Directive)">
        <p>
          Under the EU ePrivacy Directive (the &quot;cookie law&quot;), websites that set non-essential cookies must obtain consent before doing so. Because <strong>we set no cookies and no third-party tracking</strong>, we are not required to display a cookie consent banner.
        </p>
        <p>If you are using a browser or extension that shows cookie banners as a default, you&apos;ll see no banner on The Blueprint Project, because we have nothing to ask consent for.</p>
      </LegalSection>

      <LegalSection title="8. California Consumer Privacy Act (CCPA)">
        <p>The CCPA requires businesses to disclose the categories of personal information collected. Since we don&apos;t use cookies for tracking and don&apos;t share data with third parties for cross-context behavioral advertising, the relevant categories are:</p>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Category</th>
              <th className="py-2 font-semibold">Collected?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Identifiers (name, email, phone)</td><td className="py-2">No</td></tr>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Commercial information (purchases)</td><td className="py-2">No</td></tr>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Biometric information</td><td className="py-2">No</td></tr>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Internet activity (browsing history)</td><td className="py-2">Limited (server logs only, deleted in 30 days)</td></tr>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Geolocation</td><td className="py-2">No (browser may share, but we don&apos;t store it)</td></tr>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Sensory data</td><td className="py-2">No</td></tr>
            <tr className="border-b border-border/60"><td className="py-2 pr-4">Professional information</td><td className="py-2">No</td></tr>
            <tr><td className="py-2 pr-4">Inferences (profiles)</td><td className="py-2">No</td></tr>
          </tbody>
        </table>
      </LegalSection>

      <LegalSection title="9. Children's Online Privacy Protection Act (COPPA)">
        <p>
          We do not knowingly collect any personal information from children under 13, including through cookies or localStorage. We do not require accounts and do not serve behavioral advertising to children.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this Cookies Policy">
        <p>
          We may update this Cookies Policy from time to time. We will note the &quot;Last updated&quot; date at the top.
        </p>
        <p>
          If we ever introduce a technology that could be considered a &quot;cookie&quot; in any legal sense (including localStorage, IndexedDB, Service Workers, or any other browser-side storage), we will update this policy and, if required by law, request consent.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>Questions about cookies or localStorage? Email <a href="mailto:contact@blueprintproject.app?subject=COOKIES">contact@blueprintproject.app</a> with &quot;COOKIES&quot; in the subject line.</p>
      </LegalSection>

      <LegalSection title="12. AI and Cookies">
        <p>
          Some of our content (such as blog articles and resource guides) is drafted with assistance from AI tools. These tools do not set cookies on your device. AI assistants used by our team do not have access to your localStorage or browsing data.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
