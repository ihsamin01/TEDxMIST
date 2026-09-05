import type { Metadata } from "next";
import LegalPage, {
  LegalBullets,
  LegalSection,
} from "@/components/LegalPage";
import { event, refundPolicy } from "@/config/event";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What ${event.name} collects when you register, why, and who can see it.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`What we collect when you register for ${event.name}, why we need it, who can see it, and how to have it deleted.`}
      lastUpdated={refundPolicy.lastUpdated}
    >
      <LegalSection n={1} title="What we collect">
        <p>Everything on this list comes from the registration form:</p>
        <LegalBullets
          items={[
            "Your name, email address and phone number.",
            "Your university, department and year of study.",
            "A photograph of your student ID card.",
            "Your payment method, bKash transaction ID and the amount owed.",
            "Your T-shirt size.",
            "An emergency contact number.",
            "A link to your Facebook profile.",
          ]}
        />
        <p>
          We do not use analytics, advertising trackers or cookies for
          advertising. We do not know who visits the site.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Why we need each of them">
        <LegalBullets
          items={[
            "Name and email: to print your badge and send your ticket.",
            "Phone: to reach you if plans change on the day.",
            "University, department and year: to decide which fee applies and to know who is in the room.",
            "Student ID photo: to check you are a student, and that you are at the university you selected.",
            "Transaction ID: to match your payment and confirm your seat.",
            "T-shirt size: to order the right sizes.",
            "Emergency contact: to call someone if you are taken ill at the venue.",
            "Facebook: to reach you when email does not get through, which is often.",
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Your ID card photograph">
        <p>
          This is the most sensitive thing we hold, so it is worth saying
          exactly what happens to it.
        </p>
        <p>
          The image is uploaded to private storage. It has no public address:
          nobody can reach it by guessing a link, and it is not served to the
          website. When an organizer opens it from the admin page, the system
          issues a one-off link that stops working after a minute.
        </p>
        <p>
          We use it once, to verify you, and we do not copy it anywhere else,
          print it, or share it with anyone outside the organizing team.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Who can see your details">
        <p>
          Only the {event.name} organizing team, through a password-protected
          admin page. We do not sell your details, and we do not hand them to
          sponsors, to {event.venue.name}, or to anyone else who asks.
        </p>
        <p>
          Two services hold the data on our behalf because they run the site and
          the database: Vercel, which serves the website, and Supabase, which
          stores registrations and ID card images. Confirmation emails are sent
          through Gmail. None of them use your details for their own purposes.
        </p>
      </LegalSection>

      <LegalSection n={5} title="How long we keep it">
        <p>
          Registrations are kept until the event is over and the accounts are
          settled, and then deleted within three months.
        </p>
        <p>
          ID card photographs are deleted sooner, once your registration has
          been confirmed or rejected. They exist to check one thing, and after
          that there is no reason to keep them.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Asking us to delete your details">
        <p>
          Email{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="font-semibold text-ted hover:underline"
          >
            {event.contact.email}
          </a>{" "}
          from the address you registered with and ask. We will delete your
          registration and your ID card photograph, and confirm when it is done.
        </p>
        <p>
          You can also ask us for a copy of everything we hold about you, or ask
          us to correct something that is wrong.
        </p>
        <p>
          Deleting your registration cancels your seat. Whether the fee comes
          back depends on the refund policy.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Photography at the event">
        <p>
          The event itself is filmed and photographed. That is covered in the
          terms rather than here, because it is about the day, not about the
          form.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Changes and questions">
        <p>
          We may update this page, and the date at the top says when it last
          changed. Anything you want to ask about your data goes to{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="font-semibold text-ted hover:underline"
          >
            {event.contact.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
