export const situations = [
  {
    id: "overseas-sourcing", label: "Source a screened shortlist",
    title: "The role isn’t filling locally.",
    intro: "You need a wider search, with candidates who understand the job and fit the work.",
    help: "We agree the skills, experience, language and terms that matter, then source and screen candidates against that brief. We discuss the role with candidates and confirm interest and availability before presenting a shortlist for your interviews.",
    outputs: ["A candidate shortlist screened against your agreed role criteria.", "Notes on relevant experience, candidate interest and availability.", "A clear record of checks completed and any evidence or eligibility questions still open."],
    detail: "We agree the sourcing markets, screening methods, evidence to collect and shortlist expectations before delivery. Practical skills tests, reference checks or document verification are specified in the scope when included. Candidate availability is recorded separately from permission to work and a confirmed start date.",
    cta: "Discuss your vacancy",
  },
  {
    id: "candidate-start-date", label: "Prepare a start",
    title: "You’ve found someone. Now you need a plan to get them started.",
    intro: "The candidate is interested. Your team needs clarity on documents, responsibilities and timing.",
    help: "We map the agreed document, permit and qualification work alongside your hiring process. Your team and the candidate can see what is ready, what needs action and who handles it.",
    outputs: ["A checklist of documents and requirements to resolve.", "A sequence of actions with owners and timing dependencies.", "A status view of completed, pending and blocked steps."],
    detail: "The candidate’s current right to work, destination and role shape the checks. We distinguish your target start date from confirmed milestones and identify dependencies to discuss before making commitments.",
    cta: "Discuss a candidate’s start",
  },
  {
    id: "qualification-requirements", label: "Check qualifications",
    title: "They have the experience. Does their qualification meet the requirement?",
    intro: "A licence or certificate from another country needs to be assessed against the particular job and destination.",
    help: "We help identify the recognition, registration or licensing questions, the relevant competent body and the evidence needed. Those steps become part of the hiring plan, with responsibilities made clear.",
    outputs: ["A role-and-destination note on requirements to establish.", "A checklist of documents and any further steps to investigate.", "Qualification-related actions to include in your hiring timeline."],
    detail: "Requirements vary by profession, destination and qualification. Recognition and licensing decisions belong to the competent bodies. We help coordinate the agreed preparation and checks.",
    cta: "Discuss qualification requirements",
  },
] as const;
