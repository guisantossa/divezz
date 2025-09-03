import apiClient from './client';

export async function exportGroupCSV(groupId: number): Promise<void> {
  const response = await apiClient.get(`/groups/${groupId}/export`, {
    params: { format: 'csv' },
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `group-${groupId}-export.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}