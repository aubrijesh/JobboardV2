// Example prebuilt form templates for job board
// Add more templates as needed
const commonFields = [
  { type: 'name', label: 'Candidate Name', required: true },
  { type: 'email', label: 'Email', required: true },
  { type: 'phone', label: 'Phone Number' },
  { type: 'education', label: 'Education', repeatable: true },
  { type: 'experience', label: 'Work Experience', repeatable: true },
  { type: 'skills', label: 'Skills' },
  { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
  { type: 'cover_letter', label: 'Cover Letter' },
  { type: 'linkedin', label: 'LinkedIn Profile'},
  { type: 'portfolio', label: 'Portfolio URL'},
  { type: 'button', text: 'Submit' }
];

const formTemplates = [
  {
    id: 'senior_software_engineer',
    name: 'Senior Software Engineer',
    description: 'A template for senior software engineering job applications.',
    jobdesc: `<h1>Senior Software Engineer</h1>
<h3>About Tech Solutions Inc.</h3>
<p>Tech Solutions Inc. is a global leader in cloud-based enterprise solutions, serving Fortune 500 clients and innovative startups alike. Our mission is to empower businesses through scalable, secure, and intelligent technology platforms. We foster a culture of continuous learning, collaboration, and technical excellence.</p>

<h3>Position Overview</h3>
<p>We are seeking a highly experienced Senior Software Engineer to join our core engineering team. In this role, you will architect, design, and implement mission-critical systems that power our next-generation cloud platform. You will work closely with cross-functional teams to deliver robust, scalable, and high-performance solutions. This is an opportunity to make a significant impact on the direction of our technology and mentor the next generation of engineers.</p>

<h3>Key Responsibilities</h3>
<ul>
  <li>Lead the end-to-end design and development of distributed systems, microservices, and APIs.</li>
  <li>Architect scalable, secure, and maintainable solutions using Node.js, TypeScript, and modern cloud technologies (AWS, Azure, GCP).</li>
  <li>Collaborate with product managers, UX/UI designers, and DevOps to deliver new features and enhancements.</li>
  <li>Drive code reviews, enforce best practices, and champion clean code principles.</li>
  <li>Mentor and coach junior and mid-level engineers, fostering a culture of technical excellence and continuous improvement.</li>
  <li>Research and evaluate emerging technologies, tools, and frameworks to keep our stack cutting-edge.</li>
  <li>Participate in architectural discussions, sprint planning, and technical roadmap development.</li>
  <li>Ensure high standards of quality, reliability, and security in all deliverables.</li>
</ul>

<h3>Required Qualifications</h3>
<ul>
  <li>Bachelor’s or Master’s degree in Computer Science, Engineering, or a related field.</li>
  <li>7+ years of professional software engineering experience, with a strong background in backend and distributed systems.</li>
  <li>Expertise in JavaScript, Node.js, and at least one typed language (TypeScript, Java, C#).</li>
  <li>Hands-on experience with cloud platforms (AWS, Azure, or GCP), containerization (Docker, Kubernetes), and CI/CD pipelines.</li>
  <li>Deep understanding of RESTful API design, microservices architecture, and database technologies (SQL and NoSQL).</li>
  <li>Strong problem-solving skills, attention to detail, and a passion for building high-quality software.</li>
  <li>Excellent communication skills and a collaborative mindset.</li>
</ul>

<h3>Preferred Qualifications</h3>
<ul>
  <li>Experience with event-driven architectures, message queues (Kafka, RabbitMQ), and real-time data processing.</li>
  <li>Knowledge of security best practices, authentication/authorization, and compliance standards.</li>
  <li>Contributions to open-source projects or technical blogs.</li>
  <li>Experience mentoring or leading engineering teams.</li>
</ul>

<h3>Benefits</h3>
<ul>
  <li>Competitive salary and annual performance bonuses</li>
  <li>Remote work options and flexible hours</li>
  <li>Comprehensive health, dental, and vision insurance</li>
  <li>Professional development budget and paid certifications</li>
  <li>Generous paid time off and parental leave</li>
  <li>Modern office space, team events, and more</li>
</ul>

<h3>How to Apply</h3>
<p>Submit your application using the form below. Please include your resume, a cover letter highlighting your relevant experience, and links to your GitHub or portfolio if available. We look forward to learning how you can help shape the future of cloud technology at Tech Solutions Inc.</p>
`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'ui_ux_designer',
    name: 'UI/UX Designer',
    description: 'A template for UI/UX designer job applications.',
    jobdesc: `<h2>UI/UX Designer</h2>
<p>Creative Minds Studio is looking for a talented UI/UX Designer to craft intuitive and visually stunning user experiences for our web and mobile products. You will work closely with product teams to understand user needs and translate them into elegant design solutions.</p>
<ul>
  <li>Design wireframes, prototypes, and high-fidelity mockups for new features and products.</li>
  <li>Conduct user research, usability testing, and iterate on designs based on feedback.</li>
  <li>Collaborate with developers to ensure design consistency and feasibility.</li>
  <li>Maintain and evolve our design system and brand guidelines.</li>
</ul>
<p><strong>Requirements:</strong></p>
<ul>
  <li>Bachelor’s degree in Design, HCI, or related field.</li>
  <li>3+ years of experience in UI/UX design for web and mobile applications.</li>
  <li>Proficiency in Figma, Sketch, Adobe XD, and other design tools.</li>
  <li>Strong portfolio showcasing design thinking and problem-solving skills.</li>
</ul>
<p><strong>Benefits:</strong> Flexible hours, remote work, creative environment, and health benefits.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'junior_test_engineer',
    name: 'Junior Test Engineer',
    description: 'A template for junior test engineer job applications.',
    jobdesc: `<h2>Junior Test Engineer</h2>
<p>QA Solutions is hiring a Junior Test Engineer to join our growing quality assurance team. You will be responsible for executing test cases, reporting bugs, and helping ensure our products meet the highest standards of reliability.</p>
<ul>
  <li>Execute manual and automated test cases for web and mobile applications.</li>
  <li>Document and report defects clearly and concisely.</li>
  <li>Work with developers to reproduce and resolve issues.</li>
  <li>Participate in sprint planning and review meetings.</li>
</ul>
<p><strong>Requirements:</strong></p>
<ul>
  <li>Bachelor’s degree in Computer Science or related field.</li>
  <li>0-2 years of experience in software testing or QA.</li>
  <li>Basic knowledge of test automation tools (Selenium, Cypress, etc.) is a plus.</li>
  <li>Strong attention to detail and willingness to learn.</li>
</ul>
<p><strong>Benefits:</strong> Mentorship, training programs, health insurance, and career growth opportunities.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'senior_test_engineer',
    name: 'Senior Test Engineer',
    description: 'A template for senior test engineer job applications.',
    jobdesc: `<h2>Senior Test Engineer</h2>
<p>QA Solutions is seeking a Senior Test Engineer to lead our quality assurance efforts for mission-critical products. You will design test strategies, automate test suites, and drive continuous improvement in our QA processes.</p>
<ul>
  <li>Develop and maintain automated test frameworks for web and mobile applications.</li>
  <li>Lead test planning, execution, and reporting for major releases.</li>
  <li>Mentor junior QA engineers and promote best practices.</li>
  <li>Collaborate with development teams to ensure testability and reliability.</li>
</ul>
<p><strong>Requirements:</strong></p>
<ul>
  <li>Bachelor’s or Master’s degree in Computer Science or related field.</li>
  <li>5+ years of experience in software testing, automation, and QA leadership.</li>
  <li>Expertise in test automation tools (Selenium, Cypress, Appium, etc.).</li>
  <li>Strong analytical and communication skills.</li>
</ul>
<p><strong>Benefits:</strong> Competitive salary, remote work, health insurance, and leadership development programs.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'hr_manager',
    name: 'HR Manager',
    description: 'A template for HR manager job applications.',
    jobdesc: `<h2>HR Manager</h2>
<p>PeopleFirst Corp. is seeking an experienced HR Manager to lead our human resources department. You will oversee recruitment, employee relations, and HR policy development, ensuring a positive and productive workplace.</p>
<ul>
  <li>Develop and implement HR strategies and initiatives aligned with business goals.</li>
  <li>Manage recruitment, onboarding, and employee retention programs.</li>
  <li>Advise management on HR policies, labor law compliance, and performance management.</li>
  <li>Foster a culture of diversity, equity, and inclusion.</li>
</ul>
<p><strong>Requirements:</strong></p>
<ul>
  <li>Bachelor’s degree in Human Resources, Business Administration, or related field.</li>
  <li>5+ years of experience in HR management.</li>
  <li>Strong leadership, communication, and organizational skills.</li>
</ul>
<p><strong>Benefits:</strong> Health insurance, paid time off, professional development, and more.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'data_scientist',
    name: 'Data Scientist',
    description: 'A template for data scientist job applications.',
    jobdesc: `<h2>Data Scientist</h2><p>Innovate Analytics is seeking a Data Scientist to analyze complex datasets, build predictive models, and deliver actionable insights for our clients. You will work with big data technologies and collaborate with cross-functional teams to solve challenging business problems.</p><ul><li>Analyze large datasets to identify trends and patterns.</li><li>Develop and deploy machine learning models.</li><li>Communicate findings to stakeholders through visualizations and reports.</li><li>Collaborate with engineering and product teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Master’s degree in Data Science, Statistics, or related field.</li><li>3+ years of experience in data analysis and machine learning.</li><li>Proficiency in Python, R, SQL, and big data tools.</li></ul><p><strong>Benefits:</strong> Competitive salary, remote work, health insurance, and professional development.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'product_manager',
    name: 'Product Manager',
    description: 'A template for product manager job applications.',
    jobdesc: `<h2>Product Manager</h2><p>Visionary Apps is looking for a Product Manager to lead the strategy, roadmap, and execution of our flagship products. You will work with engineering, design, and marketing teams to deliver solutions that delight customers and drive business growth.</p><ul><li>Define product vision and strategy.</li><li>Gather and prioritize requirements from stakeholders.</li><li>Lead cross-functional teams through product development cycles.</li><li>Analyze market trends and customer feedback.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Business, Engineering, or related field.</li><li>5+ years of experience in product management.</li><li>Strong leadership and communication skills.</li></ul><p><strong>Benefits:</strong> Competitive salary, stock options, health insurance, and flexible work arrangements.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'devops_engineer',
    name: 'DevOps Engineer',
    description: 'A template for DevOps engineer job applications.',
    jobdesc: `<h2>DevOps Engineer</h2><p>CloudOps Solutions is hiring a DevOps Engineer to automate infrastructure, manage CI/CD pipelines, and ensure high availability of our cloud services. You will work with cutting-edge technologies and collaborate with development teams to streamline deployments.</p><ul><li>Design and implement CI/CD pipelines.</li><li>Automate infrastructure provisioning and monitoring.</li><li>Troubleshoot and resolve system issues.</li><li>Collaborate with developers to optimize workflows.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Computer Science or related field.</li><li>3+ years of experience in DevOps or system administration.</li><li>Experience with AWS, Docker, Kubernetes, and Terraform.</li></ul><p><strong>Benefits:</strong> Remote work, health insurance, and training opportunities.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'frontend_developer',
    name: 'Frontend Developer',
    description: 'A template for frontend developer job applications.',
    jobdesc: `<h2>Frontend Developer</h2><p>PixelWorks is seeking a Frontend Developer to build responsive and interactive web applications. You will work with designers and backend engineers to deliver seamless user experiences using modern JavaScript frameworks.</p><ul><li>Develop and maintain web interfaces using React, Vue, or Angular.</li><li>Optimize applications for speed and scalability.</li><li>Collaborate with UX/UI designers to implement designs.</li><li>Write clean, maintainable code and perform code reviews.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Computer Science or related field.</li><li>2+ years of experience in frontend development.</li><li>Proficiency in HTML, CSS, JavaScript, and frameworks.</li></ul><p><strong>Benefits:</strong> Flexible hours, remote work, and health insurance.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'backend_developer',
    name: 'Backend Developer',
    description: 'A template for backend developer job applications.',
    jobdesc: `<h2>Backend Developer</h2><p>ServerLogic is hiring a Backend Developer to build robust APIs and scalable server-side applications. You will work with databases, cloud services, and frontend teams to deliver reliable solutions.</p><ul><li>Design and implement RESTful APIs.</li><li>Optimize server performance and scalability.</li><li>Integrate with third-party services and databases.</li><li>Write unit and integration tests.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Computer Science or related field.</li><li>3+ years of experience in backend development.</li><li>Proficiency in Node.js, Python, Java, or similar languages.</li></ul><p><strong>Benefits:</strong> Competitive salary, remote work, and health insurance.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'mobile_app_developer',
    name: 'Mobile App Developer',
    description: 'A template for mobile app developer job applications.',
    jobdesc: `<h2>Mobile App Developer</h2><p>AppVenture is seeking a Mobile App Developer to create innovative and user-friendly mobile applications for iOS and Android platforms. You will work with designers and backend engineers to deliver seamless mobile experiences.</p><ul><li>Develop mobile apps using React Native, Flutter, or native SDKs.</li><li>Integrate with RESTful APIs and cloud services.</li><li>Optimize app performance and usability.</li><li>Collaborate with cross-functional teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Computer Science or related field.</li><li>2+ years of experience in mobile app development.</li><li>Proficiency in Swift, Kotlin, Dart, or JavaScript.</li></ul><p><strong>Benefits:</strong> Remote work, health insurance, and device budget.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'qa_automation_engineer',
    name: 'QA Automation Engineer',
    description: 'A template for QA automation engineer job applications.',
    jobdesc: `<h2>QA Automation Engineer</h2><p>TestPro is hiring a QA Automation Engineer to design and implement automated test suites for our web and mobile products. You will work with developers to ensure high quality and reliability in every release.</p><ul><li>Develop and maintain automated test scripts.</li><li>Integrate tests into CI/CD pipelines.</li><li>Analyze test results and report defects.</li><li>Collaborate with development teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Computer Science or related field.</li><li>3+ years of experience in QA automation.</li><li>Experience with Selenium, Cypress, or similar tools.</li></ul><p><strong>Benefits:</strong> Remote work, health insurance, and training programs.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'business_analyst',
    name: 'Business Analyst',
    description: 'A template for business analyst job applications.',
    jobdesc: `<h2>Business Analyst</h2><p>Insightful Solutions is seeking a Business Analyst to gather requirements, analyze business processes, and deliver solutions that drive efficiency and growth. You will work with stakeholders to understand needs and translate them into actionable plans.</p><ul><li>Gather and document business requirements.</li><li>Analyze processes and identify improvement opportunities.</li><li>Prepare reports and presentations for management.</li><li>Collaborate with IT and business teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Business, IT, or related field.</li><li>2+ years of experience in business analysis.</li><li>Strong analytical and communication skills.</li></ul><p><strong>Benefits:</strong> Health insurance, remote work, and professional development.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    description: 'A template for project manager job applications.',
    jobdesc: `<h2>Project Manager</h2><p>AgileWorks is hiring a Project Manager to lead software development projects from inception to delivery. You will manage timelines, resources, and stakeholder communications to ensure successful outcomes.</p><ul><li>Plan and manage project schedules and budgets.</li><li>Coordinate cross-functional teams.</li><li>Track progress and resolve issues.</li><li>Communicate with clients and stakeholders.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Project Management, Business, or related field.</li><li>4+ years of experience in project management.</li><li>PMP or Agile certification preferred.</li></ul><p><strong>Benefits:</strong> Competitive salary, remote work, and health insurance.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'it_support_specialist',
    name: 'IT Support Specialist',
    description: 'A template for IT support specialist job applications.',
    jobdesc: `<h2>IT Support Specialist</h2><p>HelpDesk Pro is seeking an IT Support Specialist to provide technical assistance and support for computer systems, hardware, and software. You will troubleshoot issues, resolve problems, and ensure smooth IT operations.</p><ul><li>Respond to user requests and troubleshoot technical issues.</li><li>Install and configure hardware and software.</li><li>Maintain IT documentation and inventory.</li><li>Provide training and support to staff.</li></ul><p><strong>Requirements:</strong></p><ul><li>Associate or Bachelor’s degree in IT or related field.</li><li>2+ years of experience in IT support.</li><li>Strong problem-solving and communication skills.</li></ul><p><strong>Benefits:</strong> Health insurance, paid time off, and training programs.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'marketing_manager',
    name: 'Marketing Manager',
    description: 'A template for marketing manager job applications.',
    jobdesc: `<h2>Marketing Manager</h2><p>BrandBoost is hiring a Marketing Manager to develop and execute marketing strategies that drive brand awareness and growth. You will lead campaigns, manage budgets, and analyze performance metrics.</p><ul><li>Develop and implement marketing plans.</li><li>Manage digital, print, and social media campaigns.</li><li>Analyze campaign performance and optimize strategies.</li><li>Collaborate with sales and product teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Marketing, Business, or related field.</li><li>5+ years of experience in marketing management.</li><li>Strong leadership and analytical skills.</li></ul><p><strong>Benefits:</strong> Competitive salary, remote work, and health insurance.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'content_writer',
    name: 'Content Writer',
    description: 'A template for content writer job applications.',
    jobdesc: `<h2>Content Writer</h2><p>WriteRight is seeking a Content Writer to create engaging and informative content for blogs, websites, and social media. You will research topics, write articles, and collaborate with marketing teams.</p><ul><li>Research and write high-quality content.</li><li>Edit and proofread articles.</li><li>Optimize content for SEO.</li><li>Collaborate with designers and marketers.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in English, Journalism, or related field.</li><li>2+ years of experience in content writing.</li><li>Excellent writing and editing skills.</li></ul><p><strong>Benefits:</strong> Remote work, flexible hours, and professional development.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'graphic_designer',
    name: 'Graphic Designer',
    description: 'A template for graphic designer job applications.',
    jobdesc: `<h2>Graphic Designer</h2><p>DesignHub is hiring a Graphic Designer to create visual assets for digital and print media. You will work with marketing and product teams to deliver creative solutions that enhance brand identity.</p><ul><li>Design graphics, logos, and layouts.</li><li>Prepare assets for web, social media, and print.</li><li>Collaborate with copywriters and marketers.</li><li>Maintain brand consistency across projects.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Graphic Design or related field.</li><li>2+ years of experience in graphic design.</li><li>Proficiency in Adobe Creative Suite.</li></ul><p><strong>Benefits:</strong> Flexible hours, remote work, and health insurance.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'customer_success_manager',
    name: 'Customer Success Manager',
    description: 'A template for customer success manager job applications.',
    jobdesc: `<h2>Customer Success Manager</h2><p>ClientFirst is seeking a Customer Success Manager to build strong relationships with clients, ensure satisfaction, and drive retention. You will onboard new customers, provide support, and identify opportunities for growth.</p><ul><li>Onboard and train new clients.</li><li>Monitor customer health and satisfaction.</li><li>Resolve issues and provide proactive support.</li><li>Collaborate with sales and product teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Business or related field.</li><li>3+ years of experience in customer success or account management.</li><li>Excellent communication and problem-solving skills.</li></ul><p><strong>Benefits:</strong> Health insurance, remote work, and professional development.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  },
  {
    id: 'sales_executive',
    name: 'Sales Executive',
    description: 'A template for sales executive job applications.',
    jobdesc: `<h2>Sales Executive</h2><p>GrowthForce is hiring a Sales Executive to drive revenue growth and build lasting client relationships. You will identify new business opportunities, manage sales pipelines, and close deals.</p><ul><li>Identify and pursue new sales leads.</li><li>Manage client accounts and build relationships.</li><li>Negotiate contracts and close deals.</li><li>Collaborate with marketing and product teams.</li></ul><p><strong>Requirements:</strong></p><ul><li>Bachelor’s degree in Business, Marketing, or related field.</li><li>2+ years of experience in sales.</li><li>Strong negotiation and communication skills.</li></ul><p><strong>Benefits:</strong> Competitive commission, remote work, and health insurance.</p>`,
    fields: [
      { type: 'h2', text: 'Application Form' },
      { type: 'name', label: 'Candidate Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'phone', label: 'Phone Number' },
      { type: 'education', label: 'Education', repeatable: true },
      { type: 'experience', label: 'Work Experience', repeatable: true },
      { type: 'skills', label: 'Skills' },
      { type: 'resume', label: 'Resume (PDF, DOCX, etc.)', required: true },
      { type: 'cover_letter', label: 'Cover Letter' },
      { type: 'linkedin', label: 'LinkedIn Profile'},
      { type: 'portfolio', label: 'Portfolio URL'},
      { type: 'button', text: 'Submit' }
    ]
  }
];
