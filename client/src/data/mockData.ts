import type { Project, Evaluation, AssessorRole } from "../App";

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "AI-Powered Campus Navigation System",
    studentName: "Kingkor",
    studentId: "CS2021-1234",
    description:
      "A mobile application that uses machine learning to provide real-time indoor navigation across campus buildings, helping students find classrooms, labs, and facilities efficiently.",
    department: "Computer Science",
    status: "In Progress",
    startDate: "2024-09-01",
    endDate: "2025-05-15",
    supervisor: "Dr. Sarah Johnson",
  },
  {
    id: "proj-2",
    title: "Smart Energy Management for Dormitories",
    studentName: "Sunvi",
    studentId: "EE2021-5678",
    description:
      "An IoT-based system that monitors and optimizes energy consumption in student dormitories, featuring automated lighting, HVAC control, and real-time energy usage analytics.",
    department: "Electrical Engineering",
    status: "In Progress",
    startDate: "2024-09-01",
    endDate: "2025-05-15",
    supervisor: "Dr. Robert Martinez",
  },
  {
    id: "proj-3",
    title: "Virtual Reality Chemistry Lab Simulation",
    studentName: "Sami",
    studentId: "CHEM2021-9012",
    description:
      "An immersive VR platform that simulates complex chemistry experiments, allowing students to practice lab procedures safely and repeatedly without physical materials.",
    department: "Chemistry",
    status: "Planning",
    startDate: "2024-10-01",
    endDate: "2025-06-01",
    supervisor: "Dr. Sarah Johnson",
  },
  {
    id: "proj-4",
    title: "Blockchain-Based Academic Credential Verification",
    studentName: "Naif",
    studentId: "CS2021-3456",
    description:
      "A decentralized system for issuing and verifying academic credentials using blockchain technology, ensuring tamper-proof records and instant verification for employers.",
    department: "Computer Science",
    status: "Review",
    startDate: "2024-08-15",
    endDate: "2025-04-30",
    supervisor: "Dr. Michael Chen",
  },
  {
    id: "proj-5",
    title: "Mental Health Support Chatbot for Students",
    studentName: "Badhon",
    studentId: "PSY2021-7890",
    description:
      "An AI-powered chatbot that provides 24/7 mental health support, resources, and crisis intervention for students, with integration to campus counseling services.",
    department: "Psychology",
    status: "Completed",
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    supervisor: "Dr. Patricia Brown",
  },
  {
    id: "proj-6",
    title: "Automated Course Scheduling Optimization",
    studentName: "Tonoy",
    studentId: "CS2021-2345",
    description:
      "A machine learning system that optimizes course scheduling based on student preferences, room availability, and faculty constraints, reducing conflicts and maximizing satisfaction.",
    department: "Computer Science",
    status: "Planning",
    startDate: "2024-10-15",
    endDate: "2025-06-15",
    supervisor: "Dr. Sarah Johnson",
  },
];

export const mockEvaluations: Evaluation[] = [
  // Project 1 - AI-Powered Campus Navigation System (All evaluations submitted)
  {
    id: "eval-1-1",
    projectId: "proj-1",
    assessorId: "user-1",
    assessorName: "Dr. Sarah Johnson",
    assessorRole: "Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 18,
        comment:
          "Excellent understanding of indoor navigation challenges and user needs.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 17,
        comment:
          "Clean code architecture with proper ML model integration.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 19,
        comment:
          "Novel approach to combining computer vision with traditional mapping.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 16,
        comment:
          "Good documentation, could include more API examples.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 18,
        comment:
          "Clear and confident presentation with good demo.",
      },
    ],
    finalComment:
      "Outstanding project that addresses a real campus need. The ML model shows impressive accuracy, and the user interface is intuitive. The student demonstrated deep understanding during the viva. Recommend for departmental showcase.",
    totalScore: 88,
    submittedAt: new Date("2024-12-10"),
    status: "Submitted",
  },
  {
    id: "eval-1-2",
    projectId: "proj-1",
    assessorId: "assessor-2",
    assessorName: "Dr. Michael Chen",
    assessorRole: "Co-Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 17,
        comment: "Good analysis of the problem domain.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 18,
        comment: "Excellent code quality and testing coverage.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 17,
        comment: "Innovative use of ML for indoor positioning.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 17,
        comment:
          "Comprehensive documentation with clear examples.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 17,
        comment: "Well-prepared presentation.",
      },
    ],
    finalComment:
      "Strong project with solid technical implementation. The student showed good problem-solving skills and ability to integrate multiple technologies effectively.",
    totalScore: 86,
    submittedAt: new Date("2024-12-11"),
    status: "Submitted",
  },
  {
    id: "eval-1-3",
    projectId: "proj-1",
    assessorId: "assessor-3",
    assessorName: "Prof. Lisa Anderson",
    assessorRole: "External Examiner",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 16,
        comment:
          "Solid understanding of navigation challenges.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 17,
        comment:
          "Good implementation with minor optimization opportunities.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 18,
        comment:
          "Creative solution to indoor navigation problem.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 15,
        comment:
          "Documentation adequate but could be more detailed.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 16,
        comment: "Good presentation skills.",
      },
    ],
    finalComment:
      "Very good project with practical applications. The technical execution is strong, and the project demonstrates good understanding of machine learning principles.",
    totalScore: 82,
    submittedAt: new Date("2024-12-12"),
    status: "Submitted",
  },

  // Project 2 - Smart Energy Management (2 submitted, 1 pending)
  {
    id: "eval-2-1",
    projectId: "proj-2",
    assessorId: "assessor-4",
    assessorName: "Dr. Robert Martinez",
    assessorRole: "Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 19,
        comment:
          "Excellent analysis of energy consumption patterns.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 18,
        comment:
          "Robust IoT implementation with good sensor integration.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 17,
        comment:
          "Good use of predictive algorithms for optimization.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 18,
        comment: "Comprehensive technical documentation.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 19,
        comment: "Excellent presentation with live demo.",
      },
    ],
    finalComment:
      "Exceptional work addressing sustainability on campus. The system shows measurable energy savings and could be deployed campus-wide. The student demonstrated expertise in both hardware and software aspects.",
    totalScore: 91,
    submittedAt: new Date("2024-12-13"),
    status: "Submitted",
  },
  {
    id: "eval-2-2",
    projectId: "proj-2",
    assessorId: "assessor-5",
    assessorName: "Dr. Jennifer Lee",
    assessorRole: "TA",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 17,
        comment:
          "Good understanding of energy management challenges.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 16,
        comment:
          "Solid implementation with room for optimization.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 15,
        comment:
          "Standard approach with some innovative features.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 17,
        comment: "Clear documentation and user guides.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 16,
        comment: "Good presentation with clear explanations.",
      },
    ],
    finalComment:
      "Solid project with practical applications. The implementation is technically sound and the energy savings projections are well-supported by data.",
    totalScore: 81,
    submittedAt: new Date("2024-12-14"),
    status: "Submitted",
  },
  {
    id: "eval-2-3",
    projectId: "proj-2",
    assessorId: "assessor-6",
    assessorName: "Prof. David Wong",
    assessorRole: "External Examiner",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
    ],
    finalComment: "",
    totalScore: 0,
    status: "Pending",
  },

  // Project 3 - VR Chemistry Lab (All pending)
  {
    id: "eval-3-1",
    projectId: "proj-3",
    assessorId: "user-1",
    assessorName: "Dr. Sarah Johnson",
    assessorRole: "Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
    ],
    finalComment: "",
    totalScore: 0,
    status: "Pending",
  },

  // Project 4 - Blockchain Credentials (2 submitted)
  {
    id: "eval-4-1",
    projectId: "proj-4",
    assessorId: "assessor-2",
    assessorName: "Dr. Michael Chen",
    assessorRole: "Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 18,
        comment:
          "Strong understanding of credential verification challenges.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 19,
        comment:
          "Excellent blockchain implementation and smart contracts.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 20,
        comment:
          "Highly innovative approach to credential management.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 17,
        comment:
          "Good documentation, needs more deployment guides.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 18,
        comment:
          "Clear explanation of complex blockchain concepts.",
      },
    ],
    finalComment:
      "Outstanding project with significant real-world potential. The blockchain implementation is robust and the security considerations are well-addressed. This could revolutionize how academic credentials are managed.",
    totalScore: 92,
    submittedAt: new Date("2024-12-15"),
    status: "Submitted",
  },
  {
    id: "eval-4-2",
    projectId: "proj-4",
    assessorId: "assessor-7",
    assessorName: "Dr. Amanda Foster",
    assessorRole: "Co-Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 17,
        comment:
          "Good analysis of current credential verification issues.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 18,
        comment: "Strong technical implementation.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 19,
        comment: "Innovative use of blockchain technology.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 16,
        comment:
          "Documentation could include more user scenarios.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 17,
        comment: "Good presentation and Q&A handling.",
      },
    ],
    finalComment:
      "Impressive project that addresses a critical need in academic administration. The student demonstrated strong technical skills and understanding of blockchain principles.",
    totalScore: 87,
    submittedAt: new Date("2024-12-16"),
    status: "Submitted",
  },

  // Project 5 - Mental Health Chatbot (1 submitted)
  {
    id: "eval-5-1",
    projectId: "proj-5",
    assessorId: "assessor-8",
    assessorName: "Dr. Patricia Brown",
    assessorRole: "Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: 19,
        comment:
          "Excellent understanding of mental health support needs.",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: 17,
        comment:
          "Good NLP implementation with appropriate safeguards.",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: 18,
        comment: "Innovative integration with campus services.",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: 19,
        comment:
          "Excellent documentation including ethical considerations.",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: 18,
        comment:
          "Thoughtful presentation addressing ethical concerns.",
      },
    ],
    finalComment:
      "Exceptional project with important social impact. The student showed maturity in handling sensitive mental health topics and implemented appropriate safeguards. The integration with campus counseling services is particularly well-done.",
    totalScore: 91,
    submittedAt: new Date("2024-12-17"),
    status: "Submitted",
  },

  // Project 6 - Course Scheduling (All pending)
  {
    id: "eval-6-1",
    projectId: "proj-6",
    assessorId: "assessor-1",
    assessorName: "Dr. Sarah Johnson",
    assessorRole: "Supervisor",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
    ],
    finalComment: "",
    totalScore: 0,
    status: "Pending",
  },
  {
    id: "eval-6-2",
    projectId: "proj-6",
    assessorId: "assessor-2",
    assessorName: "Dr. Michael Chen",
    assessorRole: "TA",
    criteria: [
      {
        name: "Problem Understanding & Analysis",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Technical Implementation & Code Quality",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Innovation & Creativity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Documentation & Clarity",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
      {
        name: "Presentation & Communication (Viva)",
        maxScore: 20,
        score: undefined,
        comment: "",
      },
    ],
    finalComment: "",
    totalScore: 0,
    status: "Pending",
  },
];
