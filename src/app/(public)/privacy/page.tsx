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
      effectiveDate="September 11, 2026"
      intro="Twittesia never asks who you are. There is no sign-up, no email address, no password and no social login. This policy explains the little we do collect, why, who helps us process it and how long we keep it."
    >
      <LegalSection title="1. What we collect">
        <ul>
          <li>
            <strong>An identity we invent.</strong> When you start, we generate a handle, a display
            name and a picture for you. You gave us nothing to make them from, and they are not
            derived from anything about you.
          </li>
          <li>
            <strong>Your content.</strong> The posts and comments you create. Ghosts are stored with
            no link to your identity at all.
          </li>
          <li>
            <strong>Session and security data.</strong> For each session, the IP address and browser
            or device it was created from, which you can see in your settings. We also record IP
            addresses briefly to limit repeated requests. This is the only information we hold that
            can point back to a person, and we keep it no longer than the session that created it.
          </li>
          <li>
            <strong>Usage and performance.</strong> Page views and loading performance, measured
            with Vercel Analytics and Speed Insights, which do not use cookies.
          </li>
        </ul>
        <p>
          We do not ask for, and cannot receive, your name, email address, phone number or any other
          contact detail. If you put such a detail in a post, it is content like any other, visible
          to whoever can see that post, and deleted with it.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use it">
        <ul>
          <li>To run Twittesia and show your content to the people you share it with.</li>
          <li>To keep you signed in for the life of your identity, and to limit abuse.</li>
          <li>To find and fix problems, and make Twittesia faster.</li>
        </ul>
        <p>We send no email, because we have no address to send it to.</p>
      </LegalSection>

      <LegalSection title="3. How long we keep it">
        <ul>
          <li>
            <strong>Content.</strong> Posts and comments are deleted for good 24 hours after they
            are created.
          </li>
          <li>
            <strong>Your identity.</strong> It stops working 24 hours after it was created, and is
            deleted once the last thing it wrote has expired. There is no way to recover it and no
            way for us to restore it.
          </li>
          <li>
            <strong>Sessions.</strong> Until they expire or you leave.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Who processes it">
        <p>
          We do not sell, rent or trade information about you. These services process it on our
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
            <strong>Gravatar</strong> draws the generated pictures. Your browser fetches the picture
            from them directly, so Gravatar sees your IP address. We send them only a hash of the
            handle we invented, which is connected to nothing else about you.
          </li>
        </ul>
        <p>We may also disclose information when the law requires it.</p>
      </LegalSection>

      <LegalSection title="5. Cookies and local storage">
        <p>
          We use a cookie only to keep your identity signed in. Your light or dark theme choice is
          saved in your browser&apos;s local storage. We do not use advertising or tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="6. Security">
        <p>
          We protect data with encryption in transit. The strongest protection here is that there is
          so little to protect: no password to steal, no address to leak, and nothing that outlives
          a day. No system is perfectly secure, so we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          You can change your display name and handle in your settings, and delete any post you
          wrote. Leaving ends your identity immediately. Everything else deletes itself within a
          day, and afterwards we hold nothing that would let us find your information again, or
          connect it to you if you asked us to. Questions go to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to this policy">
        <p>
          We may update this policy. When we do, we will publish the new version here and update the
          effective date. For significant changes, we will also post a notice on Twittesia, since we
          have no way to write to you.
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
