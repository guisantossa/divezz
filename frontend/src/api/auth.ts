import apiClient from './client';

export type Token = {
  access_token: string;
  token_type: 'bearer' | string;
};

export type UserCreate = {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  photo_url?: string | null;
};

export type UserLogin = {
  email: string;
  password: string;
};

export async function register(payload: UserCreate): Promise<Token> {
  const { data } = await apiClient.post<Token>('/auth/register', payload);
  // salvar token cru no localStorage (interceptor espera localStorage.getItem('token') -> token)
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function login(payload: UserLogin): Promise<Token> {
  console.debug('login payload', payload);
  const { data } = await apiClient.post<Token>('/auth/login', payload);
  localStorage.setItem('token', data.access_token);
  return data;
}

// CORREÇÃO: rota correta para obter o usuário atual está em /users/me (Users router)
export async function me(): Promise<any> {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}