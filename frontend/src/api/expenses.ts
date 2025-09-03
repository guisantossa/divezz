// ...existing code...
import apiClient from './client';

export type ExpenseSplit = {
  id?: number;
  user_id: number;
  type: 'equal' | 'percent' | 'custom' | 'igual' | 'percentual' | 'custom';
  amount?: number;
  percent?: number;
};

export type Expense = {
  id: number;
  group_id: number;
  payer_id: number;
  description?: string;
  total_amount: number;
  date?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  splits?: ExpenseSplit[];
  total_value: number; // Alias for total_amount for compatibility with frontend components
};

export type ExpenseCreate = {
  group_id: number;
  payer_id: number;
  description?: string;
  total_amount: number;
  date?: string;
  splits: ExpenseSplit[];
};

export type ExpenseUpdate = Partial<ExpenseCreate>;

export async function createExpense(payload: ExpenseCreate): Promise<Expense> {
  const { data } = await apiClient.post<Expense>(`/groups/${payload.group_id}/expenses`, payload);
  return data;
}

export async function getGroupExpenses(groupId: number, params?: { skip?: number; limit?: number }): Promise<Expense[]> {
  const { data } = await apiClient.get<Expense[]>(`/groups/${groupId}/expenses`, { params });
  return data;
}

export async function getExpense(expenseId: number): Promise<Expense> {
  const { data } = await apiClient.get<Expense>(`/expenses/${expenseId}`);
  return data;
}

export async function updateExpense(expenseId: number, payload: ExpenseUpdate): Promise<Expense> {
  const { data } = await apiClient.put<Expense>(`/expenses/${expenseId}`, payload);
  return data;
}

export async function deleteExpense(expenseId: number): Promise<void> {
  await apiClient.delete(`/expenses/${expenseId}`);
}

// Aliases compatíveis com nomes usados em alguns componentes (fetchExpenses / fetchExpense)
export const fetchExpenses = getGroupExpenses;
export const fetchExpense = getExpense;

