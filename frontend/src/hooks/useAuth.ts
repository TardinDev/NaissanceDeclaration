import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const { isAuthenticated, role, firstName, lastName, email } = useAuthStore();

  return {
    isAuthenticated,
    role,
    firstName,
    lastName,
    email,
    isCitizen: role === 'CITIZEN',
    isAgent: role === 'AGENT',
    isAdmin: role === 'ADMIN',
    fullName: firstName && lastName ? `${firstName} ${lastName}` : '',
  };
}
