import { calculateSummary, type Evaluation, type EvaluationSummary } from "../utils/evaluationMath";

const mockEvaluations: Evaluation[] = [
  {
    id: "eval-1",
    projectId: "proj-1",
    assessorName: "Dr. Sarah Johnson",
    assessorRole: "Supervisor",
    totalScore: 88,
    status: "Submitted",
    submittedAt: "2024-12-10",
    criteria: [
      { name: "Problem Understanding & Analysis", maxScore: 20, score: 18 },
      { name: "Technical Implementation & Code Quality", maxScore: 20, score: 17 },
      { name: "Innovation & Creativity", maxScore: 20, score: 19 },
      { name: "Documentation & Clarity", maxScore: 20, score: 16 },
      { name: "Presentation & Communication (Viva)", maxScore: 20, score: 18 }
    ]
  },
  {
    id: "eval-2",
    projectId: "proj-1",
    assessorName: "Prof. Lisa Anderson",
    assessorRole: "External Examiner",
    totalScore: 82,
    status: "Submitted",
    submittedAt: "2024-12-12",
    criteria: [
      { name: "Problem Understanding & Analysis", maxScore: 20, score: 16 },
      { name: "Technical Implementation & Code Quality", maxScore: 20, score: 17 },
      { name: "Innovation & Creativity", maxScore: 20, score: 18 },
      { name: "Documentation & Clarity", maxScore: 20, score: 15 },
      { name: "Presentation & Communication (Viva)", maxScore: 20, score: 16 }
    ]
  },
  {
    id: "eval-3",
    projectId: "proj-2",
    assessorName: "Dr. Robert Martinez",
    assessorRole: "Supervisor",
    totalScore: 91,
    status: "Submitted",
    submittedAt: "2024-12-13",
    criteria: [
      { name: "Problem Understanding & Analysis", maxScore: 20, score: 19 },
      { name: "Technical Implementation & Code Quality", maxScore: 20, score: 18 },
      { name: "Innovation & Creativity", maxScore: 20, score: 17 },
      { name: "Documentation & Clarity", maxScore: 20, score: 18 },
      { name: "Presentation & Communication (Viva)", maxScore: 20, score: 19 }
    ]
  },
  {
    id: "eval-4",
    projectId: "proj-2",
    assessorName: "Dr. Jennifer Lee",
    assessorRole: "Teaching Assistant",
    totalScore: 81,
    status: "Submitted",
    submittedAt: "2024-12-14",
    criteria: [
      { name: "Problem Understanding & Analysis", maxScore: 20, score: 17 },
      { name: "Technical Implementation & Code Quality", maxScore: 20, score: 16 },
      { name: "Innovation & Creativity", maxScore: 20, score: 15 },
      { name: "Documentation & Clarity", maxScore: 20, score: 17 },
      { name: "Presentation & Communication (Viva)", maxScore: 20, score: 16 }
    ]
  },
  {
    id: "eval-5",
    projectId: "proj-3",
    assessorName: "Dr. Sarah Johnson",
    assessorRole: "Supervisor",
    totalScore: 0,
    status: "Pending",
    criteria: [
      { name: "Problem Understanding & Analysis", maxScore: 20 },
      { name: "Technical Implementation & Code Quality", maxScore: 20 },
      { name: "Innovation & Creativity", maxScore: 20 },
      { name: "Documentation & Clarity", maxScore: 20 },
      { name: "Presentation & Communication (Viva)", maxScore: 20 }
    ]
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const evaluationApi = {
  list: async (projectId: string): Promise<Evaluation[]> => {
    await delay(150);
    return mockEvaluations.filter(evaluation => evaluation.projectId === projectId);
  },
  summary: async (projectId: string): Promise<EvaluationSummary> => {
    await delay(150);
    const evaluations = mockEvaluations.filter(evaluation => evaluation.projectId === projectId);
    return calculateSummary(evaluations);
  },
  create: async (evaluation: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
    await delay(150);
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: `eval-${Date.now()}`,
      status: 'Pending'
    };
    mockEvaluations.push(newEvaluation);
    return newEvaluation;
  },
  update: async (id: string, updates: Partial<Evaluation>): Promise<Evaluation> => {
    await delay(150);
    const index = mockEvaluations.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Evaluation not found');

    mockEvaluations[index] = { ...mockEvaluations[index], ...updates };
    return mockEvaluations[index];
  }
};
