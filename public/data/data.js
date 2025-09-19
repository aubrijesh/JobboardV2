// Predefined job fields
const fields = [
  { id: "button", label: "Button", type: "button", text: "Submit", inputType: "noninput", icon: "fa-solid fa-circle-check" },
  {
    type: "editor",
    label: "Job Description",
    required: false,
    inputType: "input",
    icon: "fa-solid fa-align-left"
  },
  {
    type: "container",
    label: "Container",
    description: "A container to group and nest other fields.",
    children: [],
    inputType: "noninput",
    allowMultiple: true,
    icon: "fa-solid fa-box"
  },
  {
    type: "education",
    label: "Education",
    repeatable: true,
    inputType: "input",
    icon: "fa-solid fa-graduation-cap",
    fields: [
      { type: "text", label: "Education Name", fieldKey: "education_name", inputType: "input" },
      {
        type: "select",
        label: "Degree",
        fieldKey: "degree",
        options: [
          { label: "Bachelor's", value: "bachelor" },
          { label: "Master's", value: "master" },
          { label: "PhD", value: "phd" },
          { label: "Other", value: "other" }
        ],
        inputType: "input"
      },
      { type: "text", label: "Percentage", fieldKey: "percentage", inputType: "input" },
      {
        type: "select",
        label: "University",
        fieldKey: "university",
        options: [
          { label: "Harvard University", value: "harvard" },
          { label: "Stanford University", value: "stanford" },
          { label: "MIT", value: "mit" },
          { label: "University of Oxford", value: "oxford" },
          { label: "University of Cambridge", value: "cambridge" },
          { label: "Other", value: "other" }
        ],
        inputType: "input"
      }
    ]
  },
  {type:"email", label: "Email", required: true, inputType: "input", icon: "fa-solid fa-envelope" },
  { type: "name", label: "Name", required: true, inputType: "input", icon: "fa-solid fa-signature" },
  { type: "total_experience", label: "Total Experience", required: true, inputType: "input", icon: "fa-solid fa-briefcase" },
  { type: "relevant_experience", label: "Relevant Experience", required: true, inputType: "input", icon: "fa-solid fa-calculator" },
  { type: "current_city", label: "City", required: true, inputType: "input", icon: "fa-solid fa-briefcase" },
  { type: "job_title", label: "Job Title", required: true, inputType: "input", icon: "fa-solid fa-briefcase" },
  { type: "company_name", label: "Company", required: true, inputType: "input", icon: "fa-solid fa-building" },
  { type: "location", label: "Location", inputType: "input", icon: "fa-solid fa-location-dot" },
  {
    type: "job_type",
    label: "Job Type",
    options: [
      { label: "Full-time", value: "full_time" },
      { label: "Part-time", value: "part_time" },
      { label: "Contract", value: "contract" },
      { label: "Internship", value: "internship" },
      { label: "Temporary", value: "temporary" },
    ],
    inputType: "input",
    icon: "fa-solid fa-user-tag"
  },
  {
    type: "experience_level",
    label: "Experience",
    options: [
      { label: "Entry Level", value: "entry" },
      { label: "Mid Level", value: "mid" },
      { label: "Senior Level", value: "senior" },
      { label: "Manager", value: "manager" },
      { label: "Director", value: "director" },
    ],
    inputType: "input",
    icon: "fa-solid fa-chart-line"
  },
  {
    type: "resume",
    label: "Resume",
    accept: ".pdf,.doc,.docx,.txt,.rtf",
    inputType: "input",
    icon: "fa-solid fa-file-pdf"
  },
  {
    type: "other_files",
    label: "Other Files",
    accept: "*",
    multiple: true,
    inputType: "input",
    icon: "fa-solid fa-file"
  },
  { type: "salary_range", label: "Salary", inputType: "input", icon: "fa-solid fa-money-bill" },
  { type: "description", label: "Description", inputType: "input", icon: "fa-solid fa-file-lines" },
  { type: "responsibilities", label: "Responsibilities", inputType: "input", icon: "fa-solid fa-list-check" },
  { type: "requirements", label: "Requirements", inputType: "input", icon: "fa-solid fa-list-ul" },
  { type: "phone", label: "Phone", inputType: "input", icon: "fa-solid fa-phone" },
  { type: "highest_qualification", label: "Qualification", inputType: "dropdown", icon: "fa-solid fa-graduation-cap",
    options: [
        "Associate's Degree",
        "Bachelor's Degree",
        "Master's Degree",
        "Doctoral Degree",
        "Others"
    ]
   },
  { type: "benefits", label: "Benefits", inputType: "input", icon: "fa-solid fa-gift" },
  { type: "application_deadline", label: "Deadline", inputType: "input", icon: "fa-solid fa-calendar-days" },
  { type: "apply_link", label: "Apply Link", inputType: "input", icon: "fa-solid fa-link" },
  { label: "Paragraph", type: "paragraph", text: "Paragraph", inputType: "noninput", icon: "fa-solid fa-paragraph" },
  { label: "Spacing", type: "spacing", inputType: "noninput", icon: "fa-solid fa-arrows-up-down" },
  { label: "Heading 1", type: "h1", text: "Heading 1", inputType: "noninput", icon: "fa-solid fa-heading" },
  { label: "Heading 2", type: "h2", text: "Heading 2", inputType: "noninput", icon: "fa-solid fa-heading" },
  {
    label: "Bulleted",
    type: "list",
    listType: "ul",
    options: ["List item 1", "List item 2"],
    inputType: "noninput",
    icon: "fa-solid fa-list-ul"
  },
  {
    label: "Numbered",
    type: "list",
    listType: "ol",
    options: ["List item 1", "List item 2"],
    inputType: "noninput",
    icon: "fa-solid fa-list-ol"
  },
  {
    type: "terms",
    label: "Terms and Conditions",
    text: "I agree to the terms and conditions.",
    inputType: "input",
    icon: "fa-solid fa-file-contract"
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Adds vertical space between fields.",
    inputType: "noninput",
    allowMultiple: true,
    icon: "fa-solid fa-arrows-up-down"
  },
  {
    id: "skills",
    type: "skills",
    label: "Skills",
    description: "Select relevant skills",
    inputType: "dropdown",
    allowMultiple: true,
    options: [
        "JavaScript",
        "Python",
        "SQL",
        "Java",
        "C#",
        "React",
        "Node.js",
        "Django",
        "AWS",
        "Docker"
    ],
    placeholder: "Select skills",
    icon: "fa-solid fa-lightbulb"
  }
];

// Field groupings for palette UI
const fieldsGroup = [
  {
    group: "Basic",
    fields: ["name","email","phone","total_experience","relevant_experience","current_city","highest_qualification","exerience_level","resume", "other_files", "skills","terms"]
  },
   {
    group: "Candidate Info",
    fields: ["education", "experience_level"]
  },
  {
    group: "Job-related",
    fields: ["job_title","job_type", "location", "salary_range", "description", "responsibilities", "requirements", "benefits", "application_deadline", "apply_link", "editor", "container"]
  },
  {
    group: "formating",
    fields:["paragraph", "spacing", "h1", "h2", "list", "button", "spacer"]
  },
  {
    group: "Other",
    fields: ["company_name"]
  }
];
