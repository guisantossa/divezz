import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createExpense, updateExpense, fetchExpense } from 'src/api';
import Button from '../components/ui/Button';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  total_value: z.number().positive('Total value must be positive'),
  date: z.string().nonempty('Date is required'),
  group_id: z.string().nonempty('Group ID is required'),
});

type ExpenseFormInputs = z.infer<typeof expenseSchema>;

const ExpenseForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormInputs>({
    resolver: zodResolver(expenseSchema),
  });

  const mutation = useMutation(createExpense, {
    onSuccess: () => {
      // Handle success (e.g., show a success message or redirect)
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error(error);
    },
  });

  const onSubmit = (data: ExpenseFormInputs) => {
    mutation.mutate({
      ...data,
      payer_id: 1, // Replace with actual payer_id logic (e.g., fetch or calculate the correct number)
      total_amount: data.total_value, // Map total_value to total_amount
      group_id: Number(data.group_id), // Convert group_id to a number
      splits: [], // Replace with actual splits logic
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          id="description"
          type="text"
          {...register('description')}
          className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="total_value" className="block text-sm font-medium text-gray-700">Total Value</label>
        <input
          id="total_value"
          type="number"
          {...register('total_value')}
          className={`mt-1 block w-full border ${errors.total_value ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.total_value && <p className="text-red-500 text-sm">{errors.total_value.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          type="date"
          {...register('date')}
          className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="group_id" className="block text-sm font-medium text-gray-700">Group ID</label>
        <input
          id="group_id"
          type="text"
          {...register('group_id')}
          className={`mt-1 block w-full border ${errors.group_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.group_id && <p className="text-red-500 text-sm">{errors.group_id.message}</p>}
      </div>

      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export default ExpenseForm;