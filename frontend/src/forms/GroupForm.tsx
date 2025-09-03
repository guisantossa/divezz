import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createGroup } from '../api/client';
import Button from '../components/ui/Button';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  emoji: z.string().optional(),
});

type GroupFormInputs = z.infer<typeof groupSchema>;

const GroupForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<GroupFormInputs>({
    resolver: zodResolver(groupSchema),
  });

  const mutation = useMutation(createGroup, {
    onSuccess: () => {
      // Handle success (e.g., show a success message or redirect)
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error(error);
    },
  });

  const onSubmit = (data: GroupFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">Emoji (optional)</label>
        <input
          id="emoji"
          type="text"
          {...register('emoji')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Creating...' : 'Create Group'}
      </Button>
    </form>
  );
};

export default GroupForm;