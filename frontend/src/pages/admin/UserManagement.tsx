import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { MOCK_MODE, mockGetUsers, mockChangeUserRole } from '@/mock/data';
import type { User, Role } from '@/types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingChange, setPendingChange] = useState<{ userId: number; newRole: Role } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      if (MOCK_MODE) {
        setUsers(mockGetUsers());
      } else {
        const { default: api } = await import('@/api/axios');
        const { data } = await api.get('/admin/users');
        setUsers((data as { data: User[] }).data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRoleChange = async () => {
    if (!pendingChange) return;
    const { userId, newRole } = pendingChange;
    if (MOCK_MODE) {
      mockChangeUserRole(userId, newRole);
    } else {
      const { default: api } = await import('@/api/axios');
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setPendingChange(null);
  };

  const roleBadgeColor = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'AGENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const roleLabel = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'AGENT': return 'Agent';
      default: return 'Citoyen';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {/* Dialog de confirmation */}
      {pendingChange && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">
            Changer le rôle de{' '}
            <strong>
              {users.find((u) => u.id === pendingChange.userId)?.firstName}{' '}
              {users.find((u) => u.id === pendingChange.userId)?.lastName}
            </strong>{' '}
            en <strong>{roleLabel(pendingChange.newRole)}</strong> ?
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={confirmRoleChange}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Confirmer
            </button>
            <button
              onClick={() => setPendingChange(null)}
              className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle actuel</TableHead>
              <TableHead>Changer le rôle</TableHead>
              <TableHead>Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadgeColor(user.role)}>
                    {roleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(v) => setPendingChange({ userId: user.id, newRole: v as Role })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CITIZEN">Citoyen</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
