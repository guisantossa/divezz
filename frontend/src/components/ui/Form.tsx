import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormProps<T> {
  onSubmit: SubmitHandler<T>;
  schema: z.ZodSchema<T>;
  children: React.ReactNode;
}

const Form = <T,>({ onSubmit, schema, children }: FormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {children}
      {errors && (
        <div className="text-red-500">
          {Object.values(errors).map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default Form;