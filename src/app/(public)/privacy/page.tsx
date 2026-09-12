import type { Metadata } from "next";

import { LegalPage } from "@/shared/components/legal-page";
import { LegalSection } from "@/shared/components/legal-section";
import { CONTACT_EMAIL } from "@/shared/constants/contact-email";

export const metadata: Metadata = {
  title: "Twittesia | Privacy Policy",
  description: "What Twittesia collects, why, who processes it and how long it is kept.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="September 10, 2026"
      intro="Twittesia is built to keep as little as possible for as short a time as possible. This policy explains what we collect, why, who helps us process it and how long we keep it."
    >
      <LegalSection title="1. What we collect">
        <ul>
          <li>
            <strong>Account details.</strong> Your name, username and email address. If you set a
            password, we store only a salted hash of it, never the password itself.
          </li>
          <li>
            <strong>Sign-in providers.</strong> If you sign in with GitHub or Google, we receive
            your name, email address and profile picture from them, and store the tokens they issue.
          </li>
          <li>
            <strong>Security data.</strong> For each session, the IP address and browser or device
            it was created from, which you can see and revoke in your settings. If you turn on
            two-factor authentication, your authenticator secret and backup codes.
          </li>
          <li>
            <strong>Your content.</strong> The posts and comments you create. Ghosts are stored
            without any link to your account.
          </li>
          <li>
            <strong>Usage and performance.</strong> Page views and loading performance, measured
            with Vercel Analytics and Speed Insights, which do not use cookies.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How we use it">
        <ul>
          <li>To run Twittesia and show your content to the people you share it with.</li>
          <li>
            To sign you in and protect your account, including sessions, two-factor authentication
            and limiting repeated attempts.
          </li>
          <li>
            To send the emails the service needs: address verification, magic links, password resets
            and sign-in codes.
          </li>
          <li>To find and fix problems, and make Twittesia faster.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How long we keep it">
        <ul>
          <li>
            <strong>Content.</strong> Posts and comments are deleted for good 24 hours after they
            are created.
          </li>
          <li>
            <strong>Sessions.</strong> Until they expire, you sign out or you revoke them.
          </li>
          <li>
            <strong>Links and codes.</strong> Verification links, magic links and sign-in codes last
            until they are used or expire.
          </li>
          <li>
            <strong>Account details.</strong> For as long as you have an account.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Who processes it">
        <p>
          We do not sell, rent or trade your personal information. These services process it on our
          behalf, only to provide Twittesia:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong> hosts Twittesia and provides Analytics and Speed Insights.
          </li>
          <li>
            <strong>Neon</strong> hosts the database.
          </li>
          <li>
            <strong>Resend</strong> delivers our emails.
          </li>
          <li>
            <strong>GitHub</strong> and <strong>Google</strong>, only if you use them to sign in.
          </li>
          <li>
            <strong>Have I Been Pwned</strong> checks new passwords against known breaches. Only the
            first five characters of the password&apos;s hash are sent, never the password.
          </li>
        </ul>
        <p>We may also disclose information when the law requires it.</p>
      </LegalSection>

      <LegalSection title="5. Cookies and local storage">
        <p>
          We use a cookie only to keep you signed in. Your light or dark theme choice is saved in
          your browser&apos;s local storage. We do not use advertising or tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="6. Security">
        <p>
          We protect your data with encryption in transit, hashed passwords and optional two-factor
          authentication. No system is perfectly secure, so we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          You can change your name, username, email and password, and revoke sessions, in your
          settings. To get a copy of your information, correct it or delete your account, write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to this policy">
        <p>
          We may update this policy. When we do, we will publish the new version here and update the
          effective date. For significant changes, we will also tell you by email or with a notice
          on Twittesia.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          Questions about your privacy? Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
