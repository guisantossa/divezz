import apiClient from './client';

export type Payment = {
  id: number;
  group_id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  status: 'pending' | 'paid';
  created_at?: string;
  paid_at?: string | null;
};

export type PaymentCreate = {
  group_id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  status?: 'pending' | 'paid';
};

export type SimplifyPair = {
  from_user_id: number;
  to_user_id: number;
  amount: number;
};

export async function createSettlement(payload: PaymentCreate): Promise<Payment> {
  const { data } = await apiClient.post<Payment>('/settlements', payload);
  return data;
}

export async function getSettlements(skip = 0, limit = 20): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>('/settlements', { params: { skip, limit } });
  return data;
}

export async function getSettlement(settlementId: number): Promise<Payment> {
  const { data } = await apiClient.get<Payment>(`/settlements/${settlementId}`);
  return data;
}

export async function deleteSettlement(settlementId: number): Promise<void> {
  await apiClient.delete(`/settlements/${settlementId}`);
}

/**
 * Simplify payments for a group. Returns suggested pairs (not persisted).
 */
export async function simplifyPayments(groupId: number): Promise<SimplifyPair[]> {
  const { data } = await apiClient.post<SimplifyPair[]>(`/groups/${groupId}/settlements/simplify`);
  return data;
}

/**
 * Confirm and persist suggested pairs returned by simplify endpoint.
 * Payload: { payments: SimplifyPair[] }
 */
export async function confirmSimplifiedPayments(groupId: number, payments: SimplifyPair[]): Promise<Payment[]> {
  const { data } = await apiClient.post<Payment[]>(`/groups/${groupId}/settlements/confirm`, { payments });
  return data;
}

export async function markSettlementPaid(settlementId: number, paidAt?: string): Promise<Payment> {
  const { data } = await apiClient.put<Payment>(`/settlements/${settlementId}`, { status: 'paid', paid_at: paidAt });
  return data;
}