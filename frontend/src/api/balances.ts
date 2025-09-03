import apiClient from './client';

export type BalanceItem = {
  user_id: number;
  balance: number; // positive = they should receive, negative = they owe
};

export async function getGroupBalances(groupId: number): Promise<BalanceItem[]> {
  const { data } = await apiClient.get<BalanceItem[]>(`/groups/${groupId}/balances`);
  return data;
}