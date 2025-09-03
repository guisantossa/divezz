import React from 'react';
import { deleteExpense, Expense } from 'src/api';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: number) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete }) => {
  const handleDelete = () => {
    onDelete(expense.id);
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h3 className="text-lg font-semibold">{expense.description}</h3>
        <p className="text-gray-500">{expense.date ? new Date(expense.date).toLocaleDateString() : 'Invalid Date'}</p>
      </div>
      <div className="flex items-center">
        <span className="text-xl font-bold">${expense.total_value.toFixed(2)}</span>
        <button onClick={handleDelete} className="ml-4 text-red-500 hover:text-red-700">
          Delete
        </button>
      </div>
    </div>
  );
};

export { ExpenseItem };
