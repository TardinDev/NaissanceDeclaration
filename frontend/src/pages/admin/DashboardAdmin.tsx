import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import DeclarationCard from '@/components/declaration/DeclarationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserManagement from './UserManagement';
import { MOCK_MODE, mockGetStats } from '@/mock/data';
import type { Stats, DeclarationStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: DeclarationStatus | 'ALL' }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Brouillons', value: 'DRAFT' },
  { label: 'Soumises', value: 'SUBMITTED' },
  { label: 'En cours', value: 'IN_REVIEW' },
  { label: 'Approuvées', value: 'APPROVED' },
  { label: 'Rejetées', value: 'REJECTED' },
];

export default function DashboardAdmin() {
  const { declarations, isLoading, fetchAllDeclarations } = useDeclarationStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<DeclarationStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchAllDeclarations();
    if (MOCK_MODE) {
      setStats(mockGetStats());
    } else {
      import('@/api/axios').then(({ default: api }) =>
        api.get('/admin/stats').then(({ data }) => setStats((data as { data: Stats }).data))
      );
    }
  }, [fetchAllDeclarations]);

  const filtered = filter === 'ALL' ? declarations : declarations.filter((d) => d.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-8">Administration</h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Déclarations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalDeclarations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-500">{stats.pendingDeclarations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approuvées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.approvedDeclarations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rejetées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-500">{stats.rejectedDeclarations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-500">{stats.totalAgents}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="declarations">
          <TabsList>
            <TabsTrigger value="declarations">Déclarations</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="declarations" className="mt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {f.label}
                  {f.value !== 'ALL' && (
                    <span className="ml-1 opacity-70">
                      {declarations.filter((d) => d.status === f.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune déclaration avec ce statut.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((d) => (
                  <DeclarationCard key={d.id} declaration={d} linkPrefix="/admin/declarations" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
