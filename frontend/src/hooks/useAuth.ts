import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useAuth = () => {
  const [error, setError] = useState(null);

  const login = useMutation(async (credentials) => {
    const response = await axios.post('/api/v1/auth/login', credentials);
    return response.data;
  }, {
    onError: (err) => {
      setError(err.response.data.message);
    }
  });

  const register = useMutation(async (userData) => {
    const response = await axios.post('/api/v1/auth/register', userData);
    return response.data;
  }, {
    onError: (err) => {
      setError(err.response.data.message);
    }
  });

  const logout = async () => {
    await axios.post('/api/v1/auth/logout');
  };

  return {
    login,
    register,
    logout,
    error,
  };
};

export default useAuth;