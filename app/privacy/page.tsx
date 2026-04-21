import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The Black Policy Institute collects, uses and protects your personal data under UK GDPR.",
};

/* ------------------------------------------------------------------ */
/*  Section wrapper – keeps heading + body visually grouped            */
/* ------------------------------------------------------------------ */
function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2
        className="text-2xl font-normal text-[#0A0A0A] mb-4"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        {heading}
      </h2>
      <div className="space-y-4 text-[#6B6B6B] text-[15px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8581A]" />
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full text-[#E8581A] bg-[#E8581A]/10 border border-[#E8581A]/30">
            Legal
          </span>
          <h1
            className="text-5xl sm:text-6xl font-normal text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Privacy <span className="text-[#E8581A]">Policy</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">
            How we collect, use and protect your personal data.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E5E2DF] shadow-sm space-y-10">
            {/* Effective date */}
            <p className="text-sm text-[#6B6B6B]">
              <strong className="text-[#0A0A0A]">Effective date:</strong> 12
              April 2026 &nbsp;|&nbsp;{" "}
              <strong className="text-[#0A0A0A]">Last updated:</strong> 12 April
              2026
            </p>

            {/* ---------------------------------------------------- */}
            <Section id="introduction" heading="1. Introduction">
              <p>
                TBPI CIC (trading as <strong>The Black Policy Institute</strong>
                ), a Community Interest Company registered in England and Wales
                (Company No.&nbsp;16768346), is the data controller for the
                personal data collected through this website (
                <strong>theblackpolicyinstitute.org</strong>) and our related
                services.
              </p>
              <p>
                We are committed to protecting your privacy and handling your
                personal data transparently, in accordance with the UK General
                Data Protection Regulation (UK&nbsp;GDPR) and the Data
                Protection Act&nbsp;2018.
              </p>
              <p>
                Our registered office is 61 Bridge Street, Kington, HR5 3DJ,
                United Kingdom. For any data-protection queries, please contact
                us at{" "}
                <a
                  href="mailto:info@theblackpolicyinstitute.org"
                  className="text-[#E8581A] hover:underline"
                >
                  info@theblackpolicyinstitute.org
                </a>
                .
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="data-we-collect" heading="2. Data We Collect">
              <p>We may collect and process the following categories of data:</p>

              <h3 className="text-[#0A0A0A] font-semibold text-sm mt-2">
                2.1 Information you provide directly
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Contact form submissions</strong> — name, email
                  address, organisation, enquiry type and message content.
                </li>
                <li>
                  <strong>Newsletter sign-ups</strong> — email address.
                </li>
                <li>
                  <strong>Programme applications</strong> — name, contact
                  details, and any information you include in your application
                  (e.g. for YPAG, FGLP, or Pioneers of Change).
                </li>
                <li>
                  <strong>Event registrations</strong> — name, email address and
                  organisational affiliation.
                </li>
              </ul>

              <h3 className="text-[#0A0A0A] font-semibold text-sm mt-2">
                2.2 Information collected automatically
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Analytics data</strong> — page views, referral source,
                  device type, browser type, approximate geographic location and
                  session duration, collected via Vercel Analytics.
                </li>
                <li>
                  <strong>Performance data</strong> — page-load metrics collected
                  via Vercel Speed Insights.
                </li>
                <li>
                  <strong>Cookie consent preference</strong> — stored locally in
                  your browser (localStorage).
                </li>
              </ul>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="lawful-basis" heading="3. Lawful Basis for Processing">
              <p>We process your personal data under the following legal bases:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Consent (Article 6(1)(a))</strong> — when you sign up
                  for our newsletter, accept analytics cookies, or submit a
                  contact form.
                </li>
                <li>
                  <strong>Legitimate interests (Article 6(1)(f))</strong> — to
                  improve our website, analyse aggregate usage trends, and
                  further our community-interest objectives.
                </li>
                <li>
                  <strong>Contractual necessity (Article 6(1)(b))</strong> — to
                  process programme applications and event registrations where
                  you are entering into an arrangement with us.
                </li>
              </ul>
              <p>
                You may withdraw consent at any time by contacting us or using
                the unsubscribe link in our emails. Withdrawal does not affect
                the lawfulness of processing carried out before withdrawal.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="how-we-use" heading="4. How We Use Your Data">
              <ul className="list-disc pl-5 space-y-1">
                <li>To respond to your enquiries and provide requested services.</li>
                <li>To send you our newsletter and policy updates (where you have opted in).</li>
                <li>To administer programme applications (YPAG, FGLP, Pioneers of Change).</li>
                <li>To manage event registrations and communicate event details.</li>
                <li>To analyse website traffic and improve user experience.</li>
                <li>To monitor site performance and diagnose technical issues.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="cookies" heading="5. Cookies &amp; Local Storage">
              <p>
                Our website uses a small number of cookies and local-storage
                items:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-[#E5E2DF] rounded-lg overflow-hidden mt-2">
                  <thead>
                    <tr className="bg-[#F7F5F2] text-[#0A0A0A] text-left">
                      <th className="px-4 py-2 font-semibold">Name</th>
                      <th className="px-4 py-2 font-semibold">Purpose</th>
                      <th className="px-4 py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DF]">
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">
                        tbpi_cookie_consent
                      </td>
                      <td className="px-4 py-2">
                        Stores your cookie-consent preference
                      </td>
                      <td className="px-4 py-2">Persistent (localStorage)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">
                        Vercel Analytics
                      </td>
                      <td className="px-4 py-2">
                        Anonymous, privacy-focused website analytics
                      </td>
                      <td className="px-4 py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">
                        Vercel Speed Insights
                      </td>
                      <td className="px-4 py-2">
                        Page-performance measurement
                      </td>
                      <td className="px-4 py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                When you first visit our site, a cookie banner gives you the
                option to accept or decline analytics cookies. If you decline,
                analytics data will not be collected.
              </p>
              <p>
                You can also control cookies through your browser settings at
                any time.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="data-sharing" heading="6. Data Sharing &amp; Third Parties">
              <p>
                We do not sell your personal data to any third party. We may
                share data with the following categories of service providers,
                who act as data processors on our behalf:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Vercel Inc.</strong> — website hosting, analytics and
                  performance monitoring.
                </li>
                <li>
                  <strong>Email service providers</strong> — for newsletter
                  delivery and transactional emails.
                </li>
              </ul>
              <p>
                All processors are bound by data-processing agreements that
                require them to handle your data securely and only for the
                purposes we specify. Where data is transferred outside the UK,
                we ensure appropriate safeguards are in place (e.g. Standard
                Contractual Clauses or an adequacy decision).
              </p>
              <p>
                We may also disclose personal data where required by law or to
                protect our legal rights.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="data-retention" heading="7. Data Retention">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Contact form data</strong> — retained for up to 24
                  months after your last interaction, then securely deleted.
                </li>
                <li>
                  <strong>Newsletter subscribers</strong> — retained until you
                  unsubscribe.
                </li>
                <li>
                  <strong>Programme applications</strong> — retained for the
                  duration of the programme cycle plus 12 months, unless a
                  longer period is required for reporting or legal purposes.
                </li>
                <li>
                  <strong>Analytics data</strong> — aggregated and anonymised;
                  not linked to identifiable individuals.
                </li>
              </ul>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="your-rights" heading="8. Your Rights">
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Access</strong> — request a copy of the personal data
                  we hold about you.
                </li>
                <li>
                  <strong>Rectification</strong> — ask us to correct inaccurate
                  data.
                </li>
                <li>
                  <strong>Erasure</strong> — request deletion of your personal
                  data (&ldquo;right to be forgotten&rdquo;).
                </li>
                <li>
                  <strong>Restriction</strong> — ask us to limit how we process
                  your data.
                </li>
                <li>
                  <strong>Data portability</strong> — receive your data in a
                  structured, machine-readable format.
                </li>
                <li>
                  <strong>Objection</strong> — object to processing based on
                  legitimate interests.
                </li>
                <li>
                  <strong>Withdraw consent</strong> — at any time, without
                  affecting prior processing.
                </li>
              </ul>
              <p>
                To exercise any of these rights, email us at{" "}
                <a
                  href="mailto:info@theblackpolicyinstitute.org"
                  className="text-[#E8581A] hover:underline"
                >
                  info@theblackpolicyinstitute.org
                </a>
                . We will respond within one month in accordance with UK GDPR
                requirements.
              </p>
              <p>
                If you are not satisfied with our response, you have the right
                to lodge a complaint with the{" "}
                <strong>Information Commissioner&apos;s Office (ICO)</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Website:{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E8581A] hover:underline"
                  >
                    ico.org.uk
                  </a>
                </li>
                <li>Helpline: 0303 123 1113</li>
              </ul>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="data-security" heading="9. Data Security">
              <p>
                We implement appropriate technical and organisational measures to
                protect your personal data against unauthorised access,
                alteration, disclosure or destruction. These include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>HTTPS encryption across the entire website.</li>
                <li>
                  Access controls limiting who within our organisation can view
                  personal data.
                </li>
                <li>
                  Regular review of data-processing practices and security
                  measures.
                </li>
              </ul>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="children" heading="10. Children&rsquo;s Privacy">
              <p>
                Our website is not directed at children under 13. Where our
                programmes involve young people (e.g. YPAG), we obtain
                appropriate parental or guardian consent and apply enhanced
                safeguarding measures. Please contact us if you believe we have
                collected data from a child without appropriate consent.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="changes" heading="11. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Material
                changes will be highlighted on our website. We encourage you to
                review this page periodically. The &ldquo;Last updated&rdquo;
                date at the top of this policy indicates when it was last
                revised.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="contact" heading="12. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or our
                data-protection practices, please contact us:
              </p>
              <ul className="list-none space-y-1">
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:info@theblackpolicyinstitute.org"
                    className="text-[#E8581A] hover:underline"
                  >
                    info@theblackpolicyinstitute.org
                  </a>
                </li>
                <li>
                  <strong>Post:</strong> TBPI CIC, 61 Bridge Street, Kington,
                  HR5 3DJ, United Kingdom
                </li>
              </ul>
            </Section>

            {/* Back link */}
            <div className="pt-4 border-t border-[#E5E2DF]">
              <Link
                href="/"
                className="text-sm text-[#E8581A] hover:underline"
              >
                &larr; Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
