import apiClient from './client';

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  photo_url?: string | null;
  created_at?: string;
};

export type UserUpdate = {
  name?: string;
  phone?: string | null;
  photo_url?: string | null;
};

export async function getUser(userId: number): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${userId}`);
  return data;
}

export async function updateUser(userId: number, payload: UserUpdate): Promise<User> {
  const { data } = await apiClient.put<User>(`/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId: number): Promise<User> {
  const { data } = await apiClient.delete<User>(`/users/${userId}`);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/users/me');
  return data;
}