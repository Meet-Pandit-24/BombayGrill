import { apiRequest } from "./queryClient";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface LoginResponse {
  message: string;
  user: AuthUser;
}

interface AuthCheckResponse {
  authenticated: boolean;
  user?: AuthUser;
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await apiRequest('POST', '/api/login', credentials);
  const data = await response.json() as LoginResponse;
  return data.user;
}

export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/logout');
}

export async function checkAuth(): Promise<AuthCheckResponse> {
  const response = await apiRequest('GET', '/api/auth/check');
  return await response.json() as AuthCheckResponse;
}
