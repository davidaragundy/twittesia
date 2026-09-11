import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/shared/components/legal-page";
import { LegalSection } from "@/shared/components/legal-section";
import { CONTACT_EMAIL } from "@/shared/constants/contact-email";
import { REPOSITORY_URL } from "@/shared/constants/repository-url";

export const metadata: Metadata = {
  title: "Twittesia | Terms of Service",
  description: "The terms that apply when you use Twittesia.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="September 10, 2026"
      intro={
        <>
          These terms govern your use of Twittesia, a social network where everything you share
          lasts 24 hours. By creating an account or using Twittesia, you agree to them and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </>
      }
    >
      <LegalSection title="1. Your account">
        <ul>
          <li>
            <strong>Accurate information.</strong> Give accurate details when you create your
            account, and keep them up to date.
          </li>
          <li>
            <strong>Security.</strong> You are responsible for your password, your authenticator app
            and backup codes if you use two-factor authentication, and everything that happens under
            your account.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Your content">
        <ul>
          <li>
            <strong>You own it.</strong> By posting, you give Twittesia a worldwide, royalty-free
            licence to host, display and distribute your content within Twittesia for as long as it
            exists.
          </li>
          <li>
            <strong>It expires.</strong> Posts, comments and messages are deleted for good 24 hours
            after they are created. We cannot restore them afterwards.
          </li>
          <li>
            <strong>Ghosts.</strong> A ghost is stored without any link to your account, so nobody,
            including us, can see who posted it. These terms still apply to what you post as a
            ghost.
          </li>
          <li>
            <strong>Others can still copy it.</strong> Anyone who sees your content before it
            expires can copy or screenshot it. Only share what you are comfortable with.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Acceptable use">
        <p>When you use Twittesia, you agree not to:</p>
        <ul>
          <li>Break any applicable law or regulation.</li>
          <li>Post content that is unlawful, harmful, abusive or harassing.</li>
          <li>Infringe the intellectual property or other rights of others.</li>
          <li>Send malware or anything else designed to cause harm.</li>
          <li>Interfere with Twittesia or disrupt other people&apos;s use of it.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Responsibility for content">
        <ul>
          <li>
            <strong>You are responsible.</strong> You are solely responsible for what you post and
            for how you use Twittesia.
          </li>
          <li>
            <strong>We are not.</strong> Twittesia takes no responsibility for content posted by
            users or for anything users do.
          </li>
          <li>
            <strong>No minimum age.</strong> Twittesia does not set a minimum age to use it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Moderation and termination">
        <p>
          We may remove content, or suspend or terminate accounts, that break these terms. You can
          ask us to delete your account at any time by writing to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Source code">
        <p>
          Twittesia&apos;s source code is available on{" "}
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>{" "}
          under the MIT License. These terms cover your use of the service; the licence covers the
          code.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers and limitation of liability">
        <ul>
          <li>
            <strong>As is.</strong> Twittesia is provided as is. We aim for it to be available at
            all times, but we cannot guarantee that it will be.
          </li>
          <li>
            <strong>Expired content.</strong> Content is deleted at expiry by design. We are not
            responsible for content lost that way.
          </li>
          <li>
            <strong>Liability.</strong> To the fullest extent permitted by law, Twittesia is not
            liable for indirect, incidental or consequential damages arising from your use of it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Changes to these terms">
        <p>
          We may update these terms. When we do, we will publish the new version here and update the
          effective date. For significant changes, we will also tell you by email or with a notice
          on Twittesia.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These terms are governed by the laws of Ecuador. Any disputes will be resolved in the
          competent courts of Ecuador.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about these terms? Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
