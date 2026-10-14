import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import DeclarationCard from '@/components/declaration/DeclarationCard';
import StatusFilter, { type StatusFilterValue } from '@/components/declaration/StatusFilter';
import { FormAlert } from '@/components/common/FormError';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SearchField from '@/components/common/SearchField';
import UserManagement from './UserManagement';
import { matchesQuery } from '@/lib/declarations';
import { MOCK_MODE, mockGetStats } from '@/mock/data';
import type { Stats } from '@/types';

export default function DashboardAdmin() {
  usePageTitle('Administration');
  const { declarations, isLoading, error, fetchAllDeclarations } = useDeclarationStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilterValue>('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchAllDeclarations();
    if (MOCK_MODE) {
      setStats(mockGetStats());
    } else {
      import('@/api/axios')
        .then(({ default: api }) => api.get('/admin/stats'))
        .then(({ data }) => setStats((data as { data: Stats }).data))
        .catch(() => setStatsError('Les statistiques sont indisponibles pour le moment.'));
    }
  }, [fetchAllDeclarations]);

  const searched = declarations.filter((d) => matchesQuery(d, query));
  const filtered = filter === 'ALL' ? searched : searched.filter((d) => d.status === filter);

  const tiles: { label: string; value: number; className?: string }[] = stats
    ? [
        { label: 'Déclarations', value: stats.totalDeclarations },
        { label: 'En attente', value: stats.pendingDeclarations, className: 'text-warning' },
        { label: 'Approuvées', value: stats.approvedDeclarations, className: 'text-success' },
        { label: 'Rejetées', value: stats.rejectedDeclarations, className: 'text-destructive' },
        { label: 'Utilisateurs', value: stats.totalUsers },
        { label: 'Agents', value: stats.totalAgents },
      ]
    : [];

  return (
    <motion.div
      className="wrap py-10 md:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h1 className="text-[40px] font-semibold md:text-[48px]">Administration.</h1>

      <div className="mt-8 space-y-3">
        <FormAlert message={statsError} />
        <FormAlert message={error} />
      </div>

      {stats && (
        <dl className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {tiles.map((tile) => (
            <div key={tile.label} className="flex flex-col-reverse rounded-card bg-muted p-5">
              <dt className="mt-1 text-[13px] text-muted-foreground">{tile.label}</dt>
              <dd className={`text-[40px] leading-none font-semibold tabular-nums ${tile.className ?? ''}`}>
                {tile.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <Tabs defaultValue="declarations" className="mt-12">
        <TabsList>
          <TabsTrigger value="declarations">Déclarations</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="declarations" className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <StatusFilter declarations={searched} value={filter} onChange={setFilter} />
            <SearchField value={query} onChange={setQuery} label="Rechercher un nom ou une référence" />
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-[17px] text-muted-foreground">
              Aucune déclaration ne correspond à ces critères.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <DeclarationCard key={d.id} declaration={d} linkPrefix="/admin/declarations" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-8">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
