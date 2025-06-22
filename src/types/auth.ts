export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CITIZEN' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: User;
}