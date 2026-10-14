import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/common/FormError';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/format';
import { MOCK_MODE, mockGetUsers, mockChangeUserRole } from '@/mock/data';
import type { User, Role } from '@/types';

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrateur',
  AGENT: 'Agent',
  CITIZEN: 'Citoyen',
};

export default function UserManagement() {
  const { email: currentEmail } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<{ userId: number; newRole: Role } | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (MOCK_MODE) {
          setUsers(mockGetUsers());
        } else {
          const { default: api } = await import('@/api/axios');
          const { data } = await api.get('/admin/users');
          setUsers((data as { data: User[] }).data);
        }
      } catch {
        setError('Impossible de charger les utilisateurs.');
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const confirmRoleChange = async () => {
    if (!pendingChange) return;
    const { userId, newRole } = pendingChange;
    setIsSaving(true);
    setError(null);
    try {
      if (MOCK_MODE) {
        mockChangeUserRole(userId, newRole);
      } else {
        const { default: api } = await import('@/api/axios');
        await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      }
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setPendingChange(null);
    } catch {
      setError("Le changement de rôle a échoué. Le rôle n'a pas été modifié.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const pendingUser = pendingChange ? users.find((u) => u.id === pendingChange.userId) : null;

  return (
    <div className="space-y-5">
      <FormAlert message={error} />

      {pendingChange && pendingUser && (
        <div role="alertdialog" aria-labelledby="role-change-title" className="rounded-card bg-muted p-6">
          <p id="role-change-title" className="text-[17px] font-medium">
            Passer {pendingUser.firstName} {pendingUser.lastName} au rôle {ROLE_LABELS[pendingChange.newRole]} ?
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Ses droits d'accès changeront dès sa prochaine connexion.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={confirmRoleChange} disabled={isSaving}>
              {isSaving ? 'Enregistrement…' : 'Confirmer'}
            </Button>
            <Button variant="secondary" onClick={() => setPendingChange(null)} disabled={isSaving}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelf = user.email === currentEmail;
              return (
                <TableRow key={user.id}>
                  <TableCell className="text-[15px] font-medium">
                    {user.firstName} {user.lastName}
                    {isSelf && <span className="ml-2 font-normal text-muted-foreground">(vous)</span>}
                  </TableCell>
                  <TableCell className="text-[15px] text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {/* Un administrateur ne peut pas se retirer ses propres droits */}
                    <Select
                      value={user.role}
                      disabled={isSelf}
                      onValueChange={(v) => {
                        if (v && v !== user.role) setPendingChange({ userId: user.id, newRole: v as Role });
                      }}
                    >
                      <SelectTrigger size="sm" className="w-44" aria-label={`Rôle de ${user.firstName} ${user.lastName}`}>
                        <SelectValue>{(value: Role) => ROLE_LABELS[value]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[15px] text-muted-foreground tabular-nums">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
