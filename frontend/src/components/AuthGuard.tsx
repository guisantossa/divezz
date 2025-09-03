import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { me as fetchMe } from 'src/api';

const qc = new QueryClient();

type Props = {
  children: React.ReactElement | null;
};

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // if there's no token at all -> redirect immediately
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // validate token by calling /auth/me
  const { isLoading, isError } = useQuery(['me'], () => fetchMe(), {
    retry: false,
    staleTime: Infinity,
    cacheTime: 0,
  });

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (isError) {
    // token invalid/expired -> remove and redirect to login
    localStorage.removeItem('token');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export function useGroupById(groupId?: number | null) {
  return useQuery(
    ['group', groupId ?? 'none'],
    async () => {
      if (!groupId) throw new Error('no-id'); // <-- não deixa
    },
    {
      enabled: !!groupId,
    }
  );
}