export type CampaignKind = "seasonal" | "driver";
export type CampaignField = {
  key: string; label: string; required?: boolean; type?: string; placeholder?: string;
  options?: readonly (readonly [string, string])[];
};

const common: readonly CampaignField[] = [
  { key: "email", label: "Business email", required: true, type: "email", placeholder: "you@company.com" },
  { key: "company", label: "Company name", placeholder: "Your company" },
];
export const campaignFields: Record<CampaignKind, readonly CampaignField[]> = {
  seasonal: [...common,
    { key: "operation", label: "Crop or agricultural operation", required: true, placeholder: "For example: apple harvest or greenhouse vegetables" },
    { key: "region", label: "Region or work location in Austria", required: true, placeholder: "For example: Styria" },
    { key: "headcount", label: "Workers needed", type: "number", placeholder: "For example: 8" },
    { key: "timing", label: "Preferred start and end dates", placeholder: "For example: June to September 2027" },
    { key: "accommodation", label: "Accommodation arrangements", options: [["available", "Accommodation is available"], ["arranging", "We are arranging accommodation"], ["discuss", "We need to discuss accommodation"]] },
  ],
  driver: [...common,
    { key: "country", label: "Hiring country", required: true, placeholder: "For example: Germany" },
    { key: "transport", label: "Transport and vehicle type", required: true, placeholder: "For example: C+E refrigerated freight, international routes" },
    { key: "headcount", label: "Number of drivers", type: "number", placeholder: "For example: 1" },
    { key: "timing", label: "Preferred hiring date", placeholder: "An approximate date is fine" },
    { key: "languages", label: "Languages needed for the job", placeholder: "Language and practical level needed" },
    { key: "code95", label: "EU Code 95 / professional qualification", options: [["at_start", "Required before a professional driving start"], ["at_introduction", "Must already be held when candidates are introduced"], ["discuss", "Please help us clarify the requirement"]] },
    { key: "qualification", label: "Could you support qualification steps?", options: [["yes", "We could support training and qualification"], ["no", "We need candidates who already meet the requirements"], ["discuss", "We need to understand the options first"]] },
  ],
};

export const campaignCopy = {
  seasonal: {
    title: "Your seasonal staffing brief",
    introduction: "Start with your operation and location. Add dates, headcount and accommodation if known; we can clarify the rest together.",
    subject: "Austria seasonal staffing enquiry — 2027",
    notes: "Tasks, employment terms or other questions",
    placeholder: "Tell us about the work, hours and anything that could affect the season.",
    success: "Enquiry received. We’ll contact you about your season and the preparation needed. If there’s a fit, you’ll receive a proposal from UAB Skillaxis before any paid work is agreed.",
    submit: "Send our staffing enquiry",
  },
  driver: {
    title: "Your driver vacancy",
    introduction: "Start with the country and driving work. One vacancy is enough; add the other details you know so we can discuss a practical next step.",
    subject: "Truck driver recruitment enquiry",
    notes: "Routes, employment terms or other questions",
    placeholder: "Add route patterns, working terms or questions about the proposed hire.",
    success: "Enquiry received. We’ll contact you about the vacancy, qualification needs and timing. If there’s a fit, you’ll receive a proposal from UAB Skillaxis before any paid work is agreed.",
    submit: "Send our driver enquiry",
  },
} as const;
