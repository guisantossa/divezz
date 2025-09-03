import apiClient from './client';

export type ReportSummary = {
  month_series?: { month: string; total: number }[];
  top_payers?: { user_id: number; total: number }[];
  top_debtors?: { user_id: number; total: number }[];
  totals?: { [category: string]: number } | null;
};

/**
 * GET /groups/{id}/reports/summary?month&year
 */
export async function getGroupSummaryReport(groupId: number, month?: number, year?: number): Promise<ReportSummary> {
  const params: Record<string, number | undefined> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const { data } = await apiClient.get<ReportSummary>(`/groups/${groupId}/reports/summary`, { params });
  return data;
}