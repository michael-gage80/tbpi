import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing the use of The Black Policy Institute website and services.",
};

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
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
export default function TermsOfServicePage() {
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
            Terms of <span className="text-[#E8581A]">Service</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">
            The terms and conditions governing your use of our website and
            services.
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
            <Section id="agreement" heading="1. Agreement to Terms">
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a
                legally binding agreement between you (&ldquo;you&rdquo; or
                &ldquo;User&rdquo;) and{" "}
                <strong>
                  TBPI CIC, trading as The Black Policy Institute
                </strong>{" "}
                (&ldquo;TBPI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or
                &ldquo;our&rdquo;), a Community Interest Company registered in
                England and Wales (Company No.&nbsp;16768346), with its
                registered office at 61 Bridge Street, Kington, HR5 3DJ, United
                Kingdom.
              </p>
              <p>
                By accessing or using our website at{" "}
                <strong>theblackpolicyinstitute.org</strong> (the
                &ldquo;Site&rdquo;) or any of our services, you agree to be
                bound by these Terms. If you do not agree, you should not use
                the Site.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="about-us" heading="2. About Us">
              <p>
                The Black Policy Institute is a non-partisan racial equity think
                tank. We produce independent research, deliver programmes, and
                provide consultancy services to drive evidence-based policy,
                community empowerment and systemic change across the UK.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="use-of-site" heading="3. Use of the Site">
              <p>You agree that you will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Use the Site only for lawful purposes and in accordance with
                  these Terms.
                </li>
                <li>
                  Provide accurate and complete information when submitting forms
                  or registering for events and programmes.
                </li>
                <li>
                  Not attempt to gain unauthorised access to any part of the
                  Site, its servers or any connected systems.
                </li>
                <li>
                  Not use any automated system (e.g. bots, scrapers) to access
                  the Site without our prior written consent.
                </li>
                <li>
                  Not transmit any material that is unlawful, harmful,
                  threatening, defamatory, obscene or otherwise objectionable.
                </li>
                <li>
                  Not interfere with or disrupt the integrity or performance of
                  the Site.
                </li>
              </ul>
              <p>
                We reserve the right to restrict or terminate your access to the
                Site if you breach these Terms.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section
              id="intellectual-property"
              heading="4. Intellectual Property"
            >
              <p>
                All content on the Site — including text, graphics, logos,
                images, research publications, data visualisations, audio, video
                and software — is the property of TBPI CIC or its licensors and
                is protected by UK and international copyright, trademark and
                other intellectual-property laws.
              </p>
              <h3 className="text-[#0A0A0A] font-semibold text-sm mt-2">
                4.1 Permitted use
              </h3>
              <p>You may:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  View, download and print pages from the Site for your own
                  personal, non-commercial use.
                </li>
                <li>
                  Share links to our content, provided you do not alter it or
                  present it in a misleading context.
                </li>
                <li>
                  Quote short extracts of our research and publications for the
                  purposes of commentary, criticism or review, with proper
                  attribution to &ldquo;The Black Policy Institute&rdquo; and a
                  link to the original source.
                </li>
              </ul>
              <h3 className="text-[#0A0A0A] font-semibold text-sm mt-2">
                4.2 Restrictions
              </h3>
              <p>You must not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Reproduce, distribute or republish our content for commercial
                  purposes without prior written permission.
                </li>
                <li>
                  Modify, adapt or create derivative works from our content
                  without authorisation.
                </li>
                <li>
                  Remove or alter any copyright, trademark or other proprietary
                  notices.
                </li>
                <li>
                  Use our name, logo or branding in any way that implies
                  endorsement without our written consent.
                </li>
              </ul>
              <p>
                To request permission for uses beyond those listed, contact us
                at{" "}
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
            <Section
              id="research-publications"
              heading="5. Research &amp; Publications"
            >
              <p>
                Our research and publications are produced in good faith for
                informational and educational purposes. They are intended to
                contribute to public discourse and policy development, not to
                provide professional, legal or financial advice.
              </p>
              <p>
                While we strive for accuracy and rigour, we do not warrant that
                our research is error-free, complete, or up to date. Views
                expressed in our publications represent those of the authors and
                do not necessarily reflect the official position of TBPI CIC or
                its partners.
              </p>
              <p>
                You should not rely on our research as a substitute for
                professional advice. We accept no liability for decisions made on
                the basis of our published content.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section
              id="programmes-events"
              heading="6. Programmes &amp; Events"
            >
              <p>
                Participation in TBPI programmes (including YPAG, FGLP and
                Pioneers of Change) and events may be subject to additional
                terms, eligibility criteria or codes of conduct, which will be
                communicated to participants at the point of application or
                registration.
              </p>
              <p>
                We reserve the right to amend, postpone or cancel programmes and
                events. Where reasonably possible, we will give advance notice
                of any material changes.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="newsletter" heading="7. Newsletter &amp; Communications">
              <p>
                By subscribing to our newsletter, you consent to receive
                periodic emails containing policy analysis, research updates and
                programme news. You may unsubscribe at any time by clicking the
                unsubscribe link in any email or by contacting us directly.
              </p>
              <p>
                We will handle your email address in accordance with our{" "}
                <Link
                  href="/privacy"
                  className="text-[#E8581A] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="third-party-links" heading="8. Third-Party Links">
              <p>
                The Site may contain links to external websites and resources
                operated by third parties. These links are provided for your
                convenience and do not imply endorsement by TBPI.
              </p>
              <p>
                We have no control over and accept no responsibility for the
                content, privacy policies or practices of third-party sites. We
                encourage you to review the terms and privacy policies of any
                external site you visit.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="disclaimers" heading="9. Disclaimers">
              <p>
                The Site and its content are provided on an &ldquo;as is&rdquo;
                and &ldquo;as available&rdquo; basis. To the fullest extent
                permitted by law, TBPI disclaims all warranties, express or
                implied, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose and
                non-infringement.
              </p>
              <p>We do not warrant that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  The Site will be available at all times or operate without
                  interruption or errors.
                </li>
                <li>
                  Any defects or errors on the Site will be corrected.
                </li>
                <li>
                  The Site is free of viruses or other harmful components.
                </li>
              </ul>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="liability" heading="10. Limitation of Liability">
              <p>
                To the fullest extent permitted by applicable law, TBPI CIC, its
                directors, employees, volunteers and agents shall not be liable
                for any indirect, incidental, special, consequential or punitive
                damages, or any loss of profits, data or goodwill, arising out
                of or in connection with your use of the Site.
              </p>
              <p>
                Nothing in these Terms excludes or limits our liability for
                death or personal injury caused by our negligence, fraud or
                fraudulent misrepresentation, or any other liability that cannot
                be excluded or limited by English law.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="indemnification" heading="11. Indemnification">
              <p>
                You agree to indemnify, defend and hold harmless TBPI CIC, its
                directors, employees, volunteers and agents from and against any
                claims, liabilities, damages, losses and expenses (including
                reasonable legal fees) arising out of or related to your breach
                of these Terms or your use of the Site.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="changes" heading="12. Changes to These Terms">
              <p>
                We may revise these Terms at any time by updating this page.
                Material changes will be highlighted on the Site. Your continued
                use of the Site after changes are posted constitutes acceptance
                of the revised Terms.
              </p>
              <p>
                We encourage you to review this page periodically. The
                &ldquo;Last updated&rdquo; date at the top indicates when these
                Terms were last revised.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="governing-law" heading="13. Governing Law &amp; Jurisdiction">
              <p>
                These Terms are governed by and construed in accordance with the
                laws of England and Wales. Any disputes arising under or in
                connection with these Terms shall be subject to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="severability" heading="14. Severability">
              <p>
                If any provision of these Terms is found to be invalid or
                unenforceable by a court of competent jurisdiction, the remaining
                provisions shall continue in full force and effect.
              </p>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="contact" heading="15. Contact Us">
              <p>
                If you have any questions about these Terms, please contact us:
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
