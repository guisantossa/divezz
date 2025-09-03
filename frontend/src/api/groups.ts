import apiClient from './client';

export type Group = {
  id: number;
  owner_id: number;
  name: string;
  emoji?: string | null;
  photo_url?: string | null;
  created_at?: string;
};

export type GroupCreate = {
  name: string;
  emoji?: string;
};

export type GroupUpdate = Partial<GroupCreate>;

export type InviteResponse = {
  token: string;
  url: string;
  expires_at?: string | null;
};

export async function createGroup(payload: GroupCreate): Promise<Group> {
  const { data } = await apiClient.post<Group>('/groups', payload);
  return data;
}

export async function getGroups(): Promise<Group[]> {
  const { data } = await apiClient.get<Group[]>('/groups');
  return data;
}

export async function getGroup(groupId: number): Promise<Group> {
  const { data } = await apiClient.get<Group>(`/groups/${groupId}`);
  return data;
}

export async function updateGroup(groupId: number, payload: GroupUpdate): Promise<Group> {
  const { data } = await apiClient.put<Group>(`/groups/${groupId}`, payload);
  return data;
}

export async function deleteGroup(groupId: number): Promise<void> {
  await apiClient.delete(`/groups/${groupId}`);
}

export async function generateInvite(groupId: number): Promise<InviteResponse> {
  const { data } = await apiClient.post<InviteResponse>(`/groups/${groupId}/invite`);
  return data;
}

export async function joinGroupByInvite(groupId: number, token: string): Promise<void> {
  await apiClient.post(`/groups/${groupId}/members`, null, { params: { token } });
}

export async function removeMember(groupId: number, userId: number): Promise<void> {
  await apiClient.delete(`/groups/${groupId}/members/${userId}`);
}
