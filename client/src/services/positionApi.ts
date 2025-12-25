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

export interface Application {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  positionType: 'ST' | 'RA' | 'TA';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  reviewedBy?: {
    _id: string;
    name: string;
  };
  reviewedAt?: string;
  studentName: string;
  email: string;
  studentId: string;
  gpa: string;
  expertise: string[];
  availability: string;
  experience: string;
  coverLetter: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ASSESSOR' | 'ADMIN';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Position {
  id: string;
  type: 'ST' | 'RA' | 'TA';
  title: string;
  department: string;
  course?: string;
  faculty: string;
  description: string;
  requirements: string[];
  hoursPerWeek: number;
  payRate: string;
  startDate: string;
  endDate: string;
  spots: number;
  filled: number;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string, role: string): Promise<{ message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Position API calls
export const positionApi = {
  getPositions: async (filters?: { type?: string; available?: boolean }): Promise<{ data: Position[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters?.available === true) {
      params.append('available', 'true');
    }

    const response = await axios.get(`${API_BASE_URL}/positions?${params.toString()}`);
    return { data: response.data.data, total: response.data.total };
  }
};

// Application API calls
export const applicationApi = {
  // Submit new application
  submitApplication: async (applicationData: {
    positionType: 'ST' | 'RA' | 'TA';
    studentName: string;
    email: string;
    studentId: string;
    gpa: string;
    expertise: string[];
    availability: string;
    experience: string;
    coverLetter: string;
  }): Promise<Application> => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Get all applications
  getAllApplications: async (): Promise<Application[]> => {
    const response = await api.get('/applications');
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (id: string, status: 'ACCEPTED' | 'REJECTED'): Promise<Application> => {
    const response = await api.patch(`/applications/${id}`, { status });
    return response.data;
  }
};
