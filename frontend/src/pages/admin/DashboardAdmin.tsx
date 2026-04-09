import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import DeclarationCard from '@/components/declaration/DeclarationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserManagement from './UserManagement';
import { MOCK_MODE, mockGetStats } from '@/mock/data';
import type { Stats } from '@/types';

export default function DashboardAdmin() {
  const { declarations, isLoading, fetchAllDeclarations } = useDeclarationStore();
  const [stats, setStats] = useState<Stats | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-8">Administration</h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
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
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {declarations.map((d) => (
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
