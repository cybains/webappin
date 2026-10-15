export type SectionKey = "drivers" | "agencies" | "employers" | "sufoniq";
type ListEntry = string | { label: string; value: string };
type Highlight = { title: string; detail: string; accent?: string };
type ContentList = { title: string; entries: ListEntry[]; footnote?: string };
type DualList = { title: string; entries: string[]; accentTitle?: string };
type DriverSubSection = {
  key: string;
  label: string;
  description?: string;
  highlights?: Highlight[];
  dualLists?: DualList[];
  lists?: ContentList[];
};
type AudienceSection = {
  key: SectionKey;
  label: string;
  title: string;
  description: string;
  highlights: Highlight[];
  dualLists?: DualList[];
  lists?: ContentList[];
  subSections?: DriverSubSection[];
  action?: { label: string; href: string; description: string };
};

export const paymentResponsibilities = [
  { item: "Fees for Sufoniq’s recruitment and mobility services", payer: "Employer pays Sufoniq. Drivers pay Sufoniq nothing." },
  { item: "Ghana recruitment agency’s service fees", payer: "Sufoniq pays the agency under its partner agreement. Drivers do not pay recruitment fees." },
  { item: "Flight to Lithuania", payer: "Employer pays." },
  { item: "Code 95 training", payer: "Employer pays." },
  { item: "Police clearance certificate (PCC)", payer: "Driver pays unless the employer explicitly agrees to cover it." },
  { item: "Medical examinations", payer: "Driver pays unless the employer explicitly agrees to cover them." },
  { item: "Required translations", payer: "Driver pays unless the employer explicitly agrees to cover them." },
] as const;

const driverHighlights: Highlight[] = [
  { title: "Employer confirmation before permit steps", detail: "We coordinate matching with a Lithuanian transport company. The employer decides the hire; the role and employment terms are set out in writing before the route proceeds." },
  { title: "Documents and application coordination", detail: "We help prepare the relevant documents and coordinate the employer’s and applicant’s steps. Authorities decide applications, and you must complete any required personal appointments." },
  { title: "Driving requirements checked", detail: "We identify the licence, Code 95 and tachograph requirements for the role. Any exchange, testing or training steps need to be established before treating a driver as ready to work." },
  { title: "Arrival and onboarding", detail: "We coordinate the agreed arrival, registration and onboarding arrangements with you and the employer." },
  { title: "No fees to Sufoniq", detail: "The employer pays Sufoniq, and Sufoniq pays the Ghana agency. The employer also pays for your flight and Code 95 training. Your preparation costs are listed separately.", accent: "text-emerald-700" },
];

const driverDualLists: DualList[] = [
  { title: "Driver pays, unless the employer agrees otherwise", entries: ["Police clearance certificate (PCC)", "Medical examinations", "Required translations", "Any employer agreement to cover these costs is recorded in writing."] },
  { title: "Employer-funded support", entries: ["Sufoniq’s recruitment and mobility services", "Flight to Lithuania", "Code 95 training", "Sufoniq pays the Ghana recruitment agency under a separate partner agreement."], accentTitle: "text-green-700" },
];

const requirements: ContentList = {
  title: "What we review with you",
  entries: [
    "Your Ghanaian driving licence and category, assessed against the Lithuanian C/CE role requirements.",
    "Evidence of recent professional heavy-truck or articulated driving experience.",
    "Police clearance and medical evidence required for the specific route and role.",
    "Working English for communication, training and daily work.",
    "Your passport and the validity required for the applicable applications.",
    "Any licence exchange, testing, Code 95 training and tachograph driver-card requirements.",
  ],
  footnote: "A Ghanaian licence alone does not establish readiness to drive professionally in Lithuania. The applicable licensing and qualification steps must be checked.",
};

const process: ContentList = {
  title: "The sequence and who owns each step",
  entries: [
    { label: "Registration and initial information", value: "Driver · Ghana partner" },
    { label: "Licence, experience and document review", value: "Sufoniq · driver" },
    { label: "Role, terms and hiring decision", value: "Employer · driver" },
    { label: "PCC, medicals and translations", value: "Driver · suppliers" },
    { label: "Application preparation and coordination", value: "Sufoniq · employer · driver" },
    { label: "Required appointments and identity checks", value: "Driver · official service provider" },
    { label: "Residence and any other required permissions", value: "Relevant authorities" },
    { label: "Flight and arrival arrangements", value: "Employer · Sufoniq · driver" },
    { label: "Licensing, qualification and work-readiness checks", value: "Driver · employer · relevant bodies" },
  ],
  footnote: "The exact sequence depends on the candidate and current route. Sufoniq coordinates within the agreed scope; we do not replace the applicant, employer or decision-making authority.",
};

const timing: ContentList = {
  title: "Plan around milestones, not a promised start date",
  entries: [
    "Confirm the role, employment terms, cost allocation and responsibilities before the route proceeds.",
    "Review document readiness, application requirements and appointment availability for this candidate.",
    "Treat any application decision date as provisional until the authority has issued its decision.",
    "Agree travel only after checking the required decisions, documents and entry conditions.",
    "Start professional driving only when the relevant work, licence and qualification requirements are met.",
  ],
  footnote: "We discuss an individual planning window after reviewing the route. No fixed permit, arrival or employment start date is guaranteed.",
};

const costs: ContentList = {
  title: "Costs agreed before you commit",
  entries: paymentResponsibilities.map(row => ({ label: row.item, value: row.payer })),
  footnote: "Third-party amounts depend on current supplier and official charges. The written route budget must also identify any passport, attestation, permit, appointment, card or other required charges and who pays them. A driver is never invoiced by Sufoniq.",
};

export const audienceSections: AudienceSection[] = [
  {
    key: "drivers", label: "Drivers", title: "For Ghanaian professional drivers",
    description: "Understand the role, the steps and the costs before deciding whether to proceed. The employer decides the hire, the authorities decide applications, and the payment responsibilities are set out in writing.",
    highlights: driverHighlights,
    subSections: [
      { key: "support", label: "What we do", description: "The support Sufoniq coordinates within the agreed route.", highlights: driverHighlights },
      { key: "preparation", label: "What you pay and prepare", description: "Drivers pay no fees to Sufoniq. Employers pay for flights and Code 95 training; PCC, medicals and translations are driver costs unless the employer explicitly covers them.", dualLists: driverDualLists, lists: [requirements] },
      { key: "process", label: "How it runs", description: "Check the owners, dependencies and written budget before committing to the route.", lists: [process, timing, costs] },
    ],
  },
  {
    key: "agencies", label: "Agencies", title: "For Ghana recruitment agencies",
    description: "We work with Ghana partners on sourcing, candidate preparation and clear handoffs. Employers pay Sufoniq, and Sufoniq pays its Ghana agency partners under written agreements.",
    highlights: [
      { title: "Paid by Sufoniq", detail: "Your service fees and payment milestones are agreed with Sufoniq. They are not charged to drivers, and payment timing is governed by the partner agreement." },
      { title: "Clear candidate communication", detail: "Candidates must receive accurate role information, an itemised cost allocation and clear explanations of decisions that remain with employers or authorities." },
      { title: "Standards before volume", detail: "We assess candidate handling, document practices and applicable licensing requirements before agreeing a partnership." },
    ],
    lists: [{ title: "How we work with partners", entries: [
      "Agree a written scope, responsibilities, fees and payment milestones before introducing candidates.",
      "Do not charge candidates to be selected, matched or hired.",
      "Explain the driver’s PCC, medical and translation costs, including any employer-funded exceptions.",
      "Keep candidate records and communications accurate and handle personal documents appropriately.",
      "Use the enquiry form and select Ghana recruitment agency to discuss a partnership.",
    ] }],
  },
  {
    key: "employers", label: "Employers", title: "Recruit Ghanaian C/CE drivers with sourcing and mobility coordinated.",
    description: "Sufoniq connects candidate sourcing, role-specific screening and the steps needed for a lawful start in Lithuania. We coordinate the Ghana agency and the agreed handoffs with your team and candidates, so you can assess people and plan the route together. You retain the hiring decision.",
    highlights: [
      { title: "Sourcing against your actual role", detail: "Start with the vehicle category, routes, experience, communication needs and employment terms. We use that brief to shape sourcing with our Ghana partner and identify candidates for your assessment." },
      { title: "Screening beyond the CV", detail: "Review driving experience, licence evidence and document readiness against the role. We flag licensing, qualification and eligibility questions that still need checking before the route proceeds." },
      { title: "A route your team can follow", detail: "Connect the hiring decision, documents, applications, employer-funded travel and Code 95 training through named responsibilities. We track agreed handoffs and make pending or blocked steps visible." },
    ],
    lists: [
      { title: "What your team receives", entries: [
        "Candidate profiles organised against the agreed role criteria, for your hiring decision.",
        "A view of document readiness and outstanding licensing, qualification or eligibility checks.",
        "A route with named responsibilities, dependencies and next actions.",
        "Updates on agreed milestones and the steps that need action from your team, the candidate or a partner.",
      ], footnote: "The service scope and deliverables are agreed for your requirement before sourcing or delivery begins." },
      { title: "What you fund", entries: [
        "Sufoniq’s agreed service fees. Sufoniq pays the Ghana agency under its partner agreement.",
        "The driver’s flight to Lithuania and Code 95 training.",
        "PCC, medicals and translations only where you explicitly agree to cover them; otherwise these are driver costs.",
        "Any other official or third-party costs according to the written route budget and agreed allocation.",
      ] },
      { title: "What we need from you to start", entries: [
        "The number of drivers, vehicle category, route type and work location.",
        "Pay, working pattern, essential experience and the employment terms you can offer.",
        "Your target start window, any existing candidates and the issue currently holding up the hire.",
        "A named contact who can confirm requirements and make the hiring decision.",
      ] },
    ],
    action: { label: "Discuss your driver requirement", href: "#callback", description: "Send a brief outline of the role, headcount, terms and target timing. We will review fit and discuss the scope, costs and first action before work begins." },
  },
  {
    key: "sufoniq", label: "Sufoniq", title: "About Sufoniq",
    description: "Sufoniq is a brand operated by UAB Skillaxis, registered in Lithuania and operated from Vienna, Austria. We coordinate recruitment and mobility support within an agreed scope; we are not the employer or an immigration authority.",
    highlights: [
      { title: "How we are paid", detail: "The employer pays Sufoniq for agreed services. Sufoniq pays its Ghana agency partner. Drivers pay Sufoniq no recruitment, immigration processing or administration fees, before or after a decision." },
      { title: "What we coordinate", detail: "Sourcing, screening, employer matching, document preparation and agreed application and arrival support, with named responsibilities." },
      { title: "What stays explicit", detail: "The hiring decision belongs to the employer. Application, licensing and qualification decisions stay with the relevant authorities or competent bodies. Outcomes and dates cannot be guaranteed." },
    ],
    lists: [{ title: "Before anyone commits", entries: ["Set out the role and employment terms in writing.", "Agree service scope, responsibilities and the next action.", "Record the cost allocation, including any employer-funded preparation costs.", "Explain outstanding checks and decisions that remain outside Sufoniq’s control."] }],
  },
];
