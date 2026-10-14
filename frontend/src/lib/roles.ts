import type { Role } from '@/types';

export function homePathFor(role: Role | null): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'AGENT':
      return '/agent/dashboard';
    case 'CITIZEN':
      return '/citizen/dashboard';
    default:
      return '/';
  }
}
