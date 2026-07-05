export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'CLIENT';
}

export interface AuthResponse {
  token: string;
  role: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}
