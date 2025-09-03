import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, deleteExpense, Expense } from 'src/api';
import { ExpenseItem } from './ExpenseItem';

interface ExpenseListProps {
  groupId: number;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ groupId }) => {
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading, error } = useQuery<Expense[]>({
    queryKey: ['expenses', groupId],
    queryFn: () => fetchExpenses(groupId),
  });

  const handleDelete = async (id: number) => {
    await deleteExpense(id);
    await queryClient.invalidateQueries(['expenses', groupId]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={handleDelete} />
      ))}
    </div>
  );
};
