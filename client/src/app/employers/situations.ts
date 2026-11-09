export const situations = [
  {
    id: "overseas-sourcing",
    label: "Find suitable candidates",
    title: "Build a shortlist your team can interview.",
    intro: "You have a vacancy and need suitable people to interview.",
    help: "We work from your job requirements, pay, location and timing. Each candidate is screened against that brief and spoken to about the role before an introduction.",
    outputs: [
      "A shortlist screened against the criteria agreed with you.",
      "Candidate notes covering relevant experience, interest in your terms and stated availability.",
      "A record of the checks completed and questions still to resolve before hiring."
    ],
    detailLabel: "What screening covers",
    detail: "We agree the experience, skills and language to assess, the sourcing markets and the evidence to collect. Practical skills tests, references and document verification are included when specified in the scope. An interested, available candidate may still need permission to work.",
    cta: "Discuss your vacancy",
  },
  {
    id: "candidate-start-date",
    label: "Help a selected candidate start work",
    title: "You’ve selected a candidate. Plan the steps to starting work.",
    intro: "You have selected someone and need help with the steps before they start.",
    help: "We coordinate the agreed document and application steps with your team and the candidate. You can see what is ready, what needs action and what could affect the start date.",
    outputs: [
      "A checklist of the documents and requirements for the hire.",
      "An action plan showing who handles each step and the order it needs to happen in.",
      "Written updates on completed steps, outstanding actions and delays."
    ],
    detailLabel: "How start dates are planned",
    detail: "The job, destination and candidate’s current right to work determine the preparation needed. We plan around your preferred date and flag outstanding applications or checks. A target date becomes a confirmed start only when the required conditions are met.",
    cta: "Discuss the steps to starting work",
  },
  {
    id: "qualification-requirements",
    label: "Clarify qualification requirements",
    title: "Understand the qualification steps for the job.",
    intro: "You need to know which recognition or licensing requirements apply.",
    help: "We help identify whether recognition, registration or licensing needs to be addressed for the role and country, which body handles it and what evidence the candidate needs to prepare.",
    outputs: [
      "A written summary of the qualification requirements to check for this job and country.",
      "A checklist of supporting documents and any questions for the relevant body.",
      "The qualification steps to include in your hiring plan."
    ],
    detailLabel: "Who decides on recognition",
    detail: "Requirements depend on the profession, country and qualification. The relevant competent body makes recognition or licensing decisions. Sufoniq coordinates the preparation agreed with you.",
    cta: "Discuss a qualification question",
  },
] as const;
