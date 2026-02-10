import { useState, useCallback } from 'react';
import { sendMessage } from '../utils/api';

export const useOpenRouter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async (messages, model) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sendMessage(messages, model);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    send,
    isLoading,
    error,
    clearError
  };
};
