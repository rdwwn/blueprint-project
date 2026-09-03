import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalCallout } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of The Blueprint Project directory.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The rules that govern your use of The Blueprint Project."
      lastUpdated="August 2026"
    >
      <LegalCallout>
        <p>
          <strong>The short version:</strong> The Blueprint Project is a free, hand-verified directory. We list programs, link you to their official sites, and you apply there. We&apos;re not responsible for program outcomes. Don&apos;t abuse the site, and we&apos;ll keep it free.
        </p>
      </LegalCallout>

      <LegalSection title="1. Overview">
        <p>
          This website is operated by The Blueprint Project. Throughout the site, the terms &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to The Blueprint Project. The Blueprint Project offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
        </p>
        <p>
          By visiting our site, you engage in our &quot;Service&quot; and agree to be bound by the following terms and conditions (&quot;Terms of Service&quot;, &quot;Terms&quot;), including those additional terms, conditions, and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including, without limitation, users who are browsers, students, parents, educators, and contributors of content.
        </p>
        <p>
          Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
        </p>
      </LegalSection>

      <LegalSection title="2. What The Blueprint Project Is">
        <p>
          The Blueprint Project is a free, hand-verified directory of internships, scholarships, competitions, and research programs for high school students. We research, verify, and organize listings so students can discover opportunities and apply on official websites.
        </p>
        <p>The Blueprint Project is <strong>not</strong>:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>An application portal. We don&apos;t accept applications on behalf of any program.</li>
          <li>A college admissions consulting service. We don&apos;t write essays, coach interviews, or recommend specific schools.</li>
          <li>A social network. We don&apos;t have follower counts, direct messages, or public profiles.</li>
          <li>A scholarship-matching service. We list scholarships; we don&apos;t auto-match you to them.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. The Service Is Informational Only">
        <p>
          Listings are provided for reference. The Blueprint Project does not run any of the programs listed, does not accept applications, and does not guarantee admission, funding, or that any opportunity will accept you.
        </p>
        <p>
          <strong>Applications always happen on the program&apos;s official website.</strong> We link you there. We are not responsible for the program&apos;s decisions, its terms, its data practices, or any interactions you have with it after clicking through.
        </p>
        <p>Any reliance on the information on this site is at your own risk. Verify everything on the official program page before you apply.</p>
      </LegalSection>

      <LegalSection title="4. General Conditions">
        <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
        <p>You understand that your content (not including personally identifying information, which we don&apos;t collect — see our Privacy Policy), may be transferred unencrypted and involve (a) transmissions over various networks, and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</p>
        <p>You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</p>
      </LegalSection>

      <LegalSection title="5. Accuracy, Completeness, and Timeliness of Information">
        <p>
          We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete, or more timely sources of information.
        </p>
        <p>
          We hand-verify every listing, but <strong>details change.</strong> Programs alter their eligibility, deadlines, fees, and focus. Always confirm on the program&apos;s official page before you apply.
        </p>
        <p>
          We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
        </p>
      </LegalSection>

      <LegalSection title="6. Modifications to the Service">
        <p>
          We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, suspension, or discontinuance of the Service.
        </p>
      </LegalSection>

      <LegalSection title="7. User Accounts (Future)">
        <p>
          The Blueprint Project currently works without accounts. Everything is stored locally in your browser. We may introduce optional accounts in the future for cross-device sync. If we do, this section will be updated to describe the account terms.
        </p>
        <p>For now, no account is required. No personal information is required to use the site.</p>
      </LegalSection>

      <LegalSection title="8. Optional Tools and Third-Party Links">
        <p>
          We may provide you with access to third-party tools (e.g., a map powered by Mapbox) over which we neither monitor nor have any control. You acknowledge and agree that we provide access to such tools &quot;as is&quot; and &quot;as available&quot; without any warranties, representations, or conditions of any kind.
        </p>
        <p>
          Third-party links on this site (including every program&apos;s official URL) may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy of those websites, and we do not warrant and will not have any liability or responsibility for any third-party materials or websites.
        </p>
        <p>
          Complaints, claims, concerns, or questions regarding third-party programs should be directed to the program itself.
        </p>
      </LegalSection>

      <LegalSection title="9. User Comments, Reviews, and Other Submissions">
        <p>
          If you send us creative ideas, suggestions, ratings, reviews, or other materials (collectively, &quot;Comments&quot;), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate, and otherwise use in any medium any Comments that you forward to us. We are and shall be under no obligation to (1) maintain any Comments in confidence; (2) pay compensation for any Comments; or (3) respond to any Comments.
        </p>
        <p>
          We may, but have no obligation to, monitor, edit, or remove Comments that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, or otherwise objectionable.
        </p>
        <p>
          <strong>You may not use a false name or email, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any Comments.</strong> You are solely responsible for any Comments you make and their accuracy.
        </p>
        <p>To protect minors, we do not allow Comments that include personal contact information of people under 18.</p>
      </LegalSection>

      <LegalSection title="10. Personal Information">
        <p>
          Your submission of personal information through the site is governed by our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Errors, Inaccuracies, and Omissions">
        <p>
          Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information at any time without prior notice.
        </p>
        <p>
          <strong>If you find an error, please report it.</strong> Use the &quot;Flag Incorrect Information&quot; link on any program page, or email contact@blueprintproject.app with &quot;FLAG&quot; in the subject. We aim to resolve flags within 7 days.
        </p>
      </LegalSection>

      <LegalSection title="12. Prohibited Uses">
        <p>You are prohibited from using the site or its content:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>(a) for any unlawful purpose</li>
          <li>(b) to solicit others to perform or participate in any unlawful acts</li>
          <li>(c) to violate any international, federal, provincial, state, or local regulations, rules, laws, or ordinances</li>
          <li>(d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
          <li>(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability</li>
          <li>(f) to submit false or misleading information</li>
          <li>(g) to upload or transmit viruses or any other type of malicious code</li>
          <li>(h) to collect or track the personal information of others</li>
          <li>(i) to spam, phish, pharm, pretext, spider, crawl, or scrape</li>
          <li>(j) for any obscene or immoral purpose</li>
          <li>(k) to interfere with or circumvent the security features of the Service</li>
          <li>(l) to post content that exploits minors</li>
          <li>(m) to attempt to gain unauthorized access to the Service</li>
        </ul>
        <p>We reserve the right to terminate your use of the Service for violating any of the prohibited uses.</p>
      </LegalSection>

      <LegalSection title="13. Disclaimer of Warranties; Limitation of Liability">
        <p>We do not guarantee, represent, or warrant that your use of our service will be uninterrupted, timely, secure, or error-free.</p>
        <p>You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all programs, services, and content delivered to you through the service are (except as expressly stated by us) provided &quot;as is&quot; and &quot;as available&quot; for your use, without any representation, warranties, or conditions of any kind, either express or implied.</p>
        <p>
          <strong>In no case shall The Blueprint Project, its founder, team members, advisors, or affiliates be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind</strong>, including, without limitation, lost profits, lost revenue, lost savings, loss of data, or any similar damages, whether based in contract, tort (including negligence), strict liability, or otherwise, arising from your use of any of the service or any programs procured using the service.
        </p>
        <p>Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.</p>
      </LegalSection>

      <LegalSection title="14. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless The Blueprint Project and its founder, team, advisors, affiliates, partners, officers, and agents, harmless from any claim or demand, including reasonable attorneys&apos; fees, made by any third-party due to or arising out of your breach of these Terms of Service or your violation of any law or the rights of a third-party.
        </p>
      </LegalSection>

      <LegalSection title="15. Severability">
        <p>
          In the event that any provision of these Terms of Service is determined to be unlawful, void, or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service.
        </p>
      </LegalSection>

      <LegalSection title="16. Termination">
        <p>
          These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by simply ceasing to use the site.
        </p>
        <p>
          If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice.
        </p>
      </LegalSection>

      <LegalSection title="17. Entire Agreement">
        <p>
          These Terms of Service and any policies or operating rules posted by us on this site constitute the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and us.
        </p>
      </LegalSection>

      <LegalSection title="18. Governing Law">
        <p>
          These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States and the State of Delaware, without regard to its conflict of law principles.
        </p>
      </LegalSection>

      <LegalSection title="19. Dispute Resolution">
        <p>
          We will attempt to resolve any disputes informally first. If a dispute arises, contact us at contact@blueprintproject.app and we&apos;ll try to resolve it within 30 days.
        </p>
        <p>
          If we can&apos;t resolve a dispute informally, you agree that any dispute will be resolved through binding arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules. You waive the right to participate in a class action.
        </p>
      </LegalSection>

      <LegalSection title="20. Changes to Terms of Service">
        <p>
          We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
        </p>
        <p>When material changes are made, we&apos;ll note the &quot;Last updated&quot; date at the top of this page.</p>
      </LegalSection>

      <LegalSection title="21. Accessibility">
        <p>
          We strive to make The Blueprint Project accessible to all users, including those with disabilities. We work to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
        </p>
        <p>
          If you encounter an accessibility issue, please email contact@blueprintproject.app with &quot;ACCESSIBILITY&quot; in the subject. We will respond within 5 business days.
        </p>
      </LegalSection>

      <LegalSection title="22. Contact Information">
        <p>Questions about the Terms of Service should be sent to us at:</p>
        <p>
          <strong>The Blueprint Project</strong>
          <br />
          Email: contact@blueprintproject.app
          <br />
          Website: blueprintproject.app
        </p>
      </LegalSection>

      <LegalSection title="23. AI-Assisted Features">
        <p>
          Some features of the Service may use artificial intelligence to assist with content generation, recommendations, or data verification. AI-generated content is provided for informational purposes only and may contain errors. We do not guarantee the accuracy, completeness, or reliability of AI-generated content.
        </p>
        <p>
          When you interact with AI-assisted features, your inputs may be processed by third-party AI services (such as large language model providers). Do not include personal information, passwords, or sensitive data in AI prompts.
        </p>
        <p>
          You retain ownership of content you submit to AI features. We may use aggregated, anonymized metrics to improve AI features. We do not use your personal data to train third-party AI models.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
