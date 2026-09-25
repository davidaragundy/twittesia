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
      effectiveDate="September 24, 2026"
      intro="Twittesia never asks who you are. There is no sign-up, no email address, no password and no social login. This policy explains the little we do collect, why, who helps us process it and how long we keep it."
    >
      <LegalSection title="1. What we collect">
        <ul>
          <li>
            <strong>An identity we invent.</strong> When you start, we generate a handle and a
            display name for you. Your picture is drawn in your browser from that handle, so it is
            never stored and never fetched from anyone. You gave us nothing to make any of it from.
          </li>
          <li>
            <strong>Your content.</strong> The posts and comments you create, and the images, video
            and audio you attach to them. They are deleted 24 hours after you write them, whether or
            not you are still here.
          </li>
          <li>
            <strong>Your chats, but not what you say in them.</strong> When you start a chat we keep
            which two identities are in it, when it began and when it ends, and the handles of
            anyone waiting to be let in. Nothing said in a chat is stored, by us or by anyone we
            use: messages pass between the two browsers and are kept nowhere. The key they are
            encrypted with lives in the part of the invite link after <code>#</code>, which your
            browser never sends us.
          </li>
          <li>
            <strong>Your camera and microphone.</strong> Only while the camera or recorder window is
            open, and only once your browser has asked you. What they capture stays on your device
            until you attach it and send it; closing the window turns them off.
          </li>
          <li>
            <strong>What is inside your files.</strong> JPEG, PNG and WebP images are drawn again in
            your browser before they upload, which leaves behind hidden details such as where a
            photo was taken and on what device. Video, audio, GIF and AVIF files upload exactly as
            they are, so any such details inside them go with them.
          </li>
          <li>
            <strong>Your session.</strong> A random token in a cookie keeps your identity signed in.
            We store only a one-way fingerprint of it, never the token itself, and forget it when
            your identity ends. We don&apos;t record which browser or device you use.
          </li>
          <li>
            <strong>Your IP address.</strong> Only to count how many requests come from one network
            in a short while, so that nobody can flood Twittesia. It is kept with that count, never
            with your identity or your content.
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
          <li>
            To flag the text of posts and comments that falls in a harmful category, so readers can
            choose to have it hidden. A flag only blurs content for readers; it removes nothing.
          </li>
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
            <strong>Attached files.</strong> Deleted with the post or comment they belong to. Copies
            kept by the network&apos;s caches, or by a browser that already opened them, can outlast
            it by up to a day. A file whose post or comment was never sent is deleted within a day.
          </li>
          <li>
            <strong>Your identity.</strong> It stops working 24 hours after it was created, and is
            deleted then, or as soon as you leave. There is no way to recover it and no way for us
            to restore it.
          </li>
          <li>
            <strong>Sessions.</strong> Until they expire or you leave.
          </li>
          <li>
            <strong>Request counts.</strong> Your IP address and how many requests came from it, for
            a day at most.
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
            <strong>Upstash</strong> stores your identity, your session, and your posts and
            comments, each until it expires, and the files you attach until they are deleted with
            them. Your browser sends files to it directly, and loads them from it when you view
            them.
          </li>
          <li>
            <strong>TypeSafe</strong> checks the text of each post and comment when it is written,
            to flag harmful content. It receives only that text, and does not train its models on
            it. Chats are never sent to it: they are encrypted, and we cannot read them either.
          </li>
          <li>
            <strong>jsDelivr</strong> delivers the list of emoji the reaction picker shows. Your
            browser loads it from them directly when you open the picker, so jsDelivr sees your IP
            address. Nothing else about you is sent.
          </li>
        </ul>
        <p>We may also disclose information when the law requires it.</p>
      </LegalSection>

      <LegalSection title="5. Cookies and local storage">
        <p>
          We use a cookie only to keep your identity signed in. Your light or dark theme choice, and
          what content you choose to have hidden, are saved in your browser&apos;s local storage. We
          do not use advertising or tracking cookies.
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
          You can delete any post or comment you wrote, and leaving ends your identity immediately.
          Everything else deletes itself within a day, and afterwards we hold nothing that would let
          us find your information again, or connect it to you if you asked us to. Questions go to{" "}
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
