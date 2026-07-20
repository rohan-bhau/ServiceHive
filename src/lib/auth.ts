import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetMeQuery } from '@/store/api/authApi';

export const useAuth = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useGetMeQuery(undefined, {
    skip: typeof window === 'undefined' || isAuthenticated,
  });
  return { user, isLoading, isAuthenticated };
};
