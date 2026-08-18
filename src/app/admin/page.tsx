import type { Metadata } from "next";
import Link from "next/link";
import StatusSelect from "@/components/admin/StatusSelect";
import LoginForm from "@/components/admin/LoginForm";
import { registration } from "@/config/event";
import { isAdminConfigured, isSignedIn } from "@/lib/admin-auth";
import { isEmailConfigured, ticketCode } from "@/lib/email";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Registrations",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** The columns that free-text search looks through. */
const SEARCHABLE = [
  "full_name",
  "email",
  "phone",
  "university",
  "department",
  "student_id",
  "transaction_id",
];

const STATUSES = ["all", "pending", "confirmed", "rejected"] as const;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      {children}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-ink-soft px-5 py-4">
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-[0.7rem] font-bold tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-line px-4 py-3 text-left text-[0.7rem] font-bold tracking-[0.12em] text-muted uppercase whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <td
      className={`border-b border-line/60 px-4 py-3 align-middle whitespace-nowrap ${
        muted ? "text-muted" : "text-white/90"
      }`}
    >
      {children}
    </td>
  );
}

/** Renders a profile link as a short label rather than a long raw URL. */
function SocialLink({ href, label }: { href: string | null; label: string }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ted hover:underline"
    >
      {label}
    </a>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  if (!isAdminConfigured || !isSupabaseConfigured) {
    return (
      <Shell>
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black tracking-tight">
            Admin is not configured
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Set <code className="text-ted">ADMIN_PASSWORD</code>,{" "}
            <code className="text-ted">SUPABASE_URL</code> and{" "}
            <code className="text-ted">SUPABASE_SECRET_KEY</code> in your
            environment, then reload. See the README.
          </p>
        </div>
      </Shell>
    );
  }

  if (!(await isSignedIn())) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const status = STATUSES.includes(params.status as (typeof STATUSES)[number])
    ? (params.status as (typeof STATUSES)[number])
    : "all";

  let request = supabase()
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") request = request.eq("status", status);

  if (query) {
    // Commas separate the OR branches, so a comma in the query would change
    // the filter's meaning. Strip them.
    const safe = query.replace(/[,()]/g, " ").trim();
    request = request.or(SEARCHABLE.map((c) => `${c}.ilike.%${safe}%`).join(","));
  }

  const { data, error } = await request;
  const rows = (data ?? []) as Registration[];

  const confirmed = rows.filter((r) => r.status === "confirmed").length;
  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <main className="mx-auto max-w-[110rem] px-5 py-10 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="text-xl font-black tracking-tight">
            <span className="text-ted">TEDx</span>
            <span className="text-white">MIST</span>
          </Link>
          <h1 className="mt-1 text-sm font-semibold text-muted">
            Registrations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/email-preview"
            target="_blank"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-muted transition hover:border-ted hover:text-ted"
          >
            Preview email
          </a>

          <a
            href="/admin/export"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-bold transition hover:border-ted hover:text-ted"
          >
            Download CSV
          </a>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-muted transition hover:border-ted hover:text-ted"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {!isEmailConfigured && (
        <p className="mt-6 rounded-xl border border-ted/50 bg-ted/10 px-5 py-3.5 text-sm">
          <strong className="font-bold">No confirmation emails are going out.</strong>{" "}
          <span className="text-white/75">
            Set GMAIL_USER and GMAIL_APP_PASSWORD in your environment.
            Marking somebody confirmed still works, they just are not told.
          </span>
        </p>
      )}

      {/* Counts. "Seats left" only appears once a capacity has been agreed and
          written into config/event.ts; it counts everything not rejected, the
          same rule the form uses to decide when the room is full. */}
      <div
        className={`mt-8 grid grid-cols-2 gap-3 ${
          registration.capacity === null ? "sm:grid-cols-3" : "sm:grid-cols-4"
        }`}
      >
        <Stat label="Total" value={rows.length} />
        <Stat label="Confirmed" value={confirmed} />
        <Stat label="Pending" value={pending} />
        {registration.capacity !== null && (
          <Stat
            label="Seats left"
            value={Math.max(0, registration.capacity - (confirmed + pending))}
          />
        )}
      </div>

      {/* Search and status filter. A plain GET form, so the current view is
          always a shareable URL. */}
      <form className="mt-8 flex flex-wrap items-center gap-3">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name, email, university, transaction ID…"
          className="min-w-0 flex-1 rounded-full border border-line bg-ink-soft px-5 py-2.5 text-sm text-white transition outline-none placeholder:text-muted/70 focus:border-ted focus:ring-2 focus:ring-ted/30 sm:max-w-md"
        />

        <select
          name="status"
          defaultValue={status}
          className="cursor-pointer rounded-full border border-line bg-ink-soft px-5 py-2.5 text-sm font-semibold text-white outline-none focus:border-ted"
        >
          {STATUSES.map((option) => (
            <option key={option} value={option} className="bg-ink">
              {option === "all" ? "All statuses" : option}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-full bg-ted px-6 py-2.5 text-sm font-bold text-white transition hover:bg-ted-dark"
        >
          Search
        </button>

        {(query || status !== "all") && (
          <Link
            href="/admin"
            className="text-sm font-semibold text-muted hover:text-ted"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-ink-soft">
              <Th>Ticket</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>University</Th>
              <Th>Department</Th>
              <Th>Year</Th>
              <Th>Student ID</Th>
              <Th>Method</Th>
              <Th>Transaction ID</Th>
              <Th>Emergency</Th>
              <Th>Socials</Th>
              <Th>Registered</Th>
              <Th>Status</Th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-white/[0.03]">
                <Td muted>
                  <code className="text-xs font-bold tracking-wide text-white/70">
                    {ticketCode(row.ticket_no)}
                  </code>
                </Td>
                <Td>
                  <span className="font-semibold">{row.full_name}</span>
                </Td>
                <Td>
                  <a
                    href={`mailto:${row.email}`}
                    className="hover:text-ted hover:underline"
                  >
                    {row.email}
                  </a>
                </Td>
                <Td>{row.phone}</Td>
                <Td>{row.university}</Td>
                <Td>{row.department}</Td>
                <Td>{row.study_year}</Td>
                <Td>{row.student_id}</Td>
                <Td>{row.payment_method}</Td>
                <Td>
                  <code className="text-xs tracking-wide">
                    {row.transaction_id}
                  </code>
                </Td>
                <Td>{row.emergency_contact}</Td>
                <Td>
                  <span className="flex gap-3">
                    <SocialLink href={row.linkedin} label="in" />
                    <SocialLink href={row.facebook} label="fb" />
                  </span>
                </Td>
                <Td muted>
                  {new Date(row.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Dhaka",
                  })}
                </Td>
                <Td>
                  <StatusSelect
                    id={row.id}
                    status={row.status}
                    sentAt={row.confirmation_sent_at}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && (
          <p className="px-6 py-14 text-center text-sm text-ted">
            Could not load registrations: {error.message}
          </p>
        )}

        {!error && rows.length === 0 && (
          <p className="px-6 py-14 text-center text-sm text-muted">
            {query || status !== "all"
              ? "Nothing matches that filter."
              : "No registrations yet."}
          </p>
        )}
      </div>
    </main>
  );
}
