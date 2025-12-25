import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Project {
  _id: string;
  student: string;
  studentName: string;
  studentId: string;
  title: string;
  description: string;
  department: string;
  supervisorName: string;
  startDate: string;
  expectedEndDate: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'EVALUATED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  studentId: string;
  title: string;
  description: string;
  department: string;
  supervisorName: string;
  startDate: string;
  expectedEndDate: string;
}

export const projectApi = {
  // Create new project
  createProject: async (projectData: CreateProjectData): Promise<Project> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Get projects for logged-in student
  listMyProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects/mine');
    return response.data;
  },

  // Get all projects (admin/assessor)
  listAllProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  }
};
