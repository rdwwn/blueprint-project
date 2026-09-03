import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalCallout } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Blueprint Project handles data: minimal, transparent, never sold.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How The Blueprint Project handles data: minimal, transparent, never sold."
      lastUpdated="September 2026"
    >
      <LegalCallout>
        <p>
          <strong>The short version:</strong> We don&apos;t collect personal information. We don&apos;t require accounts. We don&apos;t track you across the web. We don&apos;t sell data — we don&apos;t have any to sell. We do use browser localStorage plus a small anonymous database to remember your saved programs and preferences. Nothing is ever tied to your name, email, or device identity. That&apos;s it.
        </p>
      </LegalCallout>

      <LegalSection title="1. Personal Information We Collect">
        <p>To be clear about what we don&apos;t do:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>We don&apos;t require you to create an account</li>
          <li>We don&apos;t ask for your name, email, phone, address, or school</li>
          <li>We don&apos;t collect your date of birth or grade level</li>
          <li>We don&apos;t track you across other websites</li>
          <li>We don&apos;t run advertising networks</li>
          <li>We don&apos;t sell, rent, or share any personal data — because we don&apos;t have any</li>
        </ul>
        <p>What we do collect:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Saved programs</strong> — stored under an anonymous random ID (no account, email, or name). A copy lives in your browser&apos;s localStorage so your list loads instantly.</li>
          <li><strong>Application status</strong> (saved / applied / accepted) — your browser&apos;s localStorage. Never leaves your device.</li>
          <li><strong>Custom dates</strong> (exams, interviews) — your browser&apos;s localStorage. Never leaves your device.</li>
          <li><strong>Program reviews you write</strong> (rating, text, optional name/grade) — sent to our server so we can review them before publishing. Approved reviews appear publicly with only the name you chose.</li>
          <li><strong>Program flags you submit</strong> — via our flag form, into a private queue we use to fix listings. No account needed.</li>
          <li><strong>Server logs</strong> (IP, user agent, timestamp) — retained for 30 days, then deleted.</li>
        </ul>
        <p>
          When we talk about &quot;Personal Information&quot; in this Privacy Policy, we are talking about anything that could identify you. The only things that could identify you are your IP address (in our server logs for 30 days) and the name/grade you choose to include in a review we approve for public display. Reviews are tied to a random anonymous ID, never to your identity.
        </p>

        <p className="mt-4 font-semibold">Third-party services that may collect data when you visit our site</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Mapbox</strong> — When you view the map, Mapbox may set its own cookies or localStorage items to remember your map preferences (zoom, pan, locale). Mapbox&apos;s privacy practices are governed by <a href="https://www.mapbox.com/legal/privacy">their own privacy policy</a>. We do not have access to the data Mapbox collects.</li>
          <li><strong>Unsplash</strong> — Cover images on this site are loaded from images.unsplash.com. Unsplash may log your IP address for the purpose of serving images. See <a href="https://unsplash.com/privacy">Unsplash&apos;s privacy policy</a>.</li>
          <li><strong>Vercel</strong> — Our site is hosted on Vercel. Vercel collects server logs (IP, user agent) for the purpose of operating the service. See <a href="https://vercel.com/legal/privacy-policy">Vercel&apos;s privacy policy</a>.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Your Personal Information">
        <p>We use the limited information we collect to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Operate the service. Serve the website, run the map, load program data.</li>
          <li>Improve the service. Understand which programs are popular. Fix bugs. Respond to flagged content.</li>
          <li>Communicate with you (only if you reach out first). When you email us, we reply.</li>
          <li>Detect and prevent abuse. Identify bots, scraping, denial-of-service attacks.</li>
        </ul>
        <p>We do NOT use your information to target you with advertising, build a profile of you, sell to data brokers, or share with third parties for any purpose.</p>
      </LegalSection>

      <LegalSection title="3. Sharing Your Personal Information">
        <p>
          We don&apos;t sell, trade, or otherwise transfer your Personal Information to third parties. Period.
        </p>
        <p>We may share your Personal Information only in these limited circumstances:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Service providers who help us run the site.</strong> Our hosting provider (Vercel) and our map provider (Mapbox) see technical data (IP, user agent) to deliver the service.</li>
          <li><strong>When required by law.</strong> If a court orders us to disclose information. We&apos;ve never received one.</li>
          <li><strong>To protect our rights or safety.</strong> If we believe disclosure is necessary to investigate illegal activities or violations of our Terms.</li>
          <li><strong>With your consent.</strong> If you explicitly authorize us to share something.</li>
        </ul>
        <p>
          We do not use Google Analytics or any third-party analytics that follow you across the web.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies and Similar Technologies">
        <p>
          <strong>Short version: We don&apos;t use cookies. We use localStorage, which is similar but stays on your device.</strong>
        </p>
        <p>For the long version, see our <a href="/cookies">Cookies Policy</a>.</p>
        <p>In summary:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>We do not set cookies</li>
          <li>We do not use third-party tracking pixels</li>
          <li>We do use browser localStorage as a fast local copy of your saved programs, application status, and custom dates. Saved programs also sync to our database under an anonymous random ID so they survive browser resets. Reviews and reports are stored on our server because they are shared or moderated content — never tied to your name or email</li>
          <li>You can clear localStorage at any time in your browser settings</li>
          <li>The map (powered by Mapbox) does not set tracking cookies on our site</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Behavioral Advertising">
        <p>
          We do not engage in behavioral advertising. There are no third-party advertising networks on this site. We do not share your data with advertisers. There are no ads.
        </p>
      </LegalSection>

      <LegalSection title="6. Do Not Track (DNT)">
        <p>
          We do not alter our Site&apos;s data collection and use practices when we see a Do Not Track signal from your browser. This is because we already collect almost nothing, and what we do collect is governed by the same minimal-data policy regardless of DNT.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>You have the following rights with respect to your personal information:</p>

        <p className="mt-4 font-semibold">For everyone, everywhere</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Right to access.</strong> See all the data we have about you by emailing us.</li>
          <li><strong>Right to delete.</strong> Ask us to delete any data we have about you within 30 days.</li>
          <li><strong>Right to correct.</strong> Ask us to correct inaccurate data.</li>
          <li><strong>Right to export.</strong> Ask for a copy of any data in a portable format.</li>
        </ul>

        <p className="mt-4 font-semibold">For users in the EU / UK / EEA / Switzerland</p>
        <p>Under the GDPR and UK GDPR, you have additional rights:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Right to restrict processing</li>
          <li>Right to object to certain types of processing</li>
          <li>Right to data portability</li>
          <li>Right to lodge a complaint with your local data protection authority</li>
          <li>Right to withdraw consent (if we ever rely on it)</li>
        </ul>

        <p className="mt-4 font-semibold">For users in California</p>
        <p>Under the CCPA and CPRA:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Right to know what personal information is collected, used, shared, or sold</li>
          <li>Right to delete personal information</li>
          <li>Right to opt out of the sale of personal information (we don&apos;t sell)</li>
          <li>Right to non-discrimination for exercising your rights</li>
        </ul>

        <p className="mt-4">
          <strong>How to exercise your rights:</strong> Email contact@blueprintproject.app with the subject &quot;PRIVACY REQUEST.&quot; We&apos;ll respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="8. Data Retention">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Data</th>
              <th className="py-2 font-semibold">Retention</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Server logs (IP, user agent)</td>
              <td className="py-2">30 days, then deleted</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Email correspondence</td>
              <td className="py-2">Retained as long as needed; deleted on request</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Aggregated analytics</td>
              <td className="py-2">Indefinitely (no personal identifiers)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4">Your localStorage data</td>
              <td className="py-2">Until you clear your browser data or use &quot;Reset&quot; on the dashboard</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Anonymous saves, reviews, and reports</td>
              <td className="py-2">Until you ask us to delete them (email us). Keyed by a random ID, not your identity</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Program flags and emailed reports</td>
              <td className="py-2">Until resolved; retained to track fixes</td>
            </tr>
          </tbody>
        </table>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>
          Our audience includes minors, including children under 13. We are committed to protecting children&apos;s privacy.
        </p>
        <p>
          We do not knowingly collect personal information from children under 13. We do not require accounts, do not use tracking cookies, and do not build advertising profiles of any user. The Blueprint Project is designed to be usable by children under 13 without providing personal information.
        </p>
        <p>
          If you are a parent or guardian and believe your child has provided us with personal information (for example, a name in a public review), contact us at <a href="mailto:contact@blueprintproject.app?subject=COPPA">contact@blueprintproject.app</a> with subject &quot;COPPA&quot; and we will delete that information within 5 business days. We will not knowingly retain such information.
        </p>
        <p>
          We do not use any personal information collected from any user, child or adult, for behavioral advertising, profiling, or any commercial purpose unrelated to operating the Service.
        </p>
      </LegalSection>

      <LegalSection title="10. International Data Transfers">
        <p>
          The Blueprint Project is operated from the United States. If you are accessing the Service from outside the United States, please be aware that your information will be transferred to, stored, and processed in the United States.
        </p>
        <p>
          We rely on Standard Contractual Clauses (SCCs) for transfers from the EEA, UK, and Switzerland. You can request a copy by emailing us.
        </p>
      </LegalSection>

      <LegalSection title="11. Security">
        <p>We take reasonable measures to protect your information:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>HTTPS everywhere.</strong> All traffic is encrypted in transit.</li>
          <li><strong>Minimal server-side data.</strong> Our database stores only anonymous saves, reviews, and reports keyed by random IDs — no names, emails, or account info. Server logs are access-controlled and deleted after 30 days.</li>
          <li><strong>Regular security reviews.</strong> The codebase is open to public review.</li>
          <li><strong>Vercel and Mapbox</strong> are SOC 2 compliant providers.</li>
        </ul>
        <p>
          No method of transmission over the Internet is 100% secure. If you discover a security vulnerability, please email contact@blueprintproject.app with &quot;SECURITY&quot; in the subject. We will respond within 48 hours.
        </p>
      </LegalSection>

      <LegalSection title="12. Your Choices and Controls">
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Clear your localStorage data.</strong> Browser settings → Site settings → Clear data.</li>
          <li><strong>Use the in-app Reset.</strong> Dashboard → Settings → Clear all saved programs.</li>
          <li><strong>Block JavaScript.</strong> Our site requires JavaScript. Without it, the site won&apos;t work.</li>
          <li><strong>Use a privacy-focused browser.</strong> We support any modern browser.</li>
          <li><strong>Contact us.</strong> For anything else, email contact@blueprintproject.app.</li>
        </ul>
      </LegalSection>

      <LegalSection title="13. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time. We will note the &quot;Last updated&quot; date at the top. For material changes, we will post a notice on the homepage for at least 30 days.
        </p>
        <p>
          Your continued use of the Service after changes constitutes acceptance of the revised Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact Us">
        <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us at:</p>
        <p>
          <strong>The Blueprint Project</strong>
          <br />
          Email: contact@blueprintproject.app
          <br />
          Subject line: &quot;PRIVACY&quot;
          <br />
          Website: blueprintproject.app
        </p>
        <p>We will respond within 30 days.</p>
      </LegalSection>

      <LegalSection title="15. AI Disclosure">
        <p>
          The Blueprint Project uses AI-assisted tools to assist with content creation (such as blog articles, resource guides, and program descriptions) and data verification. All AI-generated content is reviewed by a human before publication.
        </p>
        <p>
          We do not sell, license, or share your data with third-party AI training providers. Aggregated, fully-anonymized usage statistics may be used to improve the product.
        </p>
        <p>
          If you submit content (such as a program review or feedback) that is processed by AI tools to flag spam, detect issues, or summarize, the raw content is not retained beyond the immediate use case.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
