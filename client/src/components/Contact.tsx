import WorkforceEnquiryForm from "./WorkforceEnquiryForm";

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 px-6 py-16 scroll-mt-24 text-foreground" aria-labelledby="contact-title">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
        <div className="space-y-5">
          <p className="sufoniq-meta-label">Talk to us</p>
          <h2 id="contact-title" className="text-3xl md:text-4xl font-semibold">Tell us the role. Let’s assess the route.</h2>
          <p className="text-base sufoniq-body-text">A short outline is enough to begin: the job, location, timing and any requirement you already know is difficult. If we cannot help, we will say so.</p>
          <div className="sufoniq-card space-y-3">
            <h3 className="text-base font-semibold">What happens after you enquire</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm sufoniq-body-text">
              <li>We read your requirement and reply to discuss fit and the questions that need answering.</li>
              <li>We agree the scope, responsibilities and first action in writing before substantive work begins.</li>
              <li>Within that scope, we assess eligibility, documents, timing and the handoffs the route depends on.</li>
            </ol>
          </div>
          <p className="text-sm sufoniq-body-text">Prefer a direct conversation? <a href="mailto:support@sufoniq.com" className="font-semibold text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Email us</a> or <a href="https://wa.me/420778604430" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">contact us on WhatsApp</a>.</p>
          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-semibold">Looking for work in Europe?</h3>
            <p className="mt-2 text-sm sufoniq-body-text">We support job seekers too. Start with <a href="/core-services#job-search-support" className="font-semibold text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">job-search support</a> to explore realistic routes and requirements. Sufoniq does not charge recruitment or placement fees to candidates, and support does not guarantee a job or a permit.</p>
          </div>
        </div>
        <WorkforceEnquiryForm />
      </div>
    </section>
  );
}
