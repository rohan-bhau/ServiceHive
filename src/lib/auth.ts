import { useGetMeQuery } from '@/store/api/authApi';

export const useAuth = () => {
  const { data: user, isLoading, isError } = useGetMeQuery(undefined, {
    skip: typeof window === 'undefined',
  });
  return { user: user ?? null, isLoading, isAuthenticated: !!user && !isError };
};
