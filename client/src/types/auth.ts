// client/src/types/auth.ts
export type UserRole = "student" | "faculty";

export interface RegisterData {
  name: string;
  universityId: string;
  email: string;
  password?: string;
  roles: UserRole;
  department: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    roles: string[];
  };
  message?: string;
}