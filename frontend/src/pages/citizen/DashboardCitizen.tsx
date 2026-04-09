import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import { useAuth } from '@/hooks/useAuth';
import DeclarationCard from '@/components/declaration/DeclarationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { DeclarationStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: DeclarationStatus | 'ALL' }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Brouillons', value: 'DRAFT' },
  { label: 'Soumises', value: 'SUBMITTED' },
  { label: 'En cours', value: 'IN_REVIEW' },
  { label: 'Approuvées', value: 'APPROVED' },
  { label: 'Rejetées', value: 'REJECTED' },
];

export default function DashboardCitizen() {
  const { fullName } = useAuth();
  const { declarations, isLoading, fetchMyDeclarations } = useDeclarationStore();
  const [filter, setFilter] = useState<DeclarationStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchMyDeclarations();
  }, [fetchMyDeclarations]);

  const filtered = filter === 'ALL' ? declarations : declarations.filter((d) => d.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {fullName}</h1>
            <p className="text-muted-foreground">Gérez vos déclarations de naissance</p>
          </div>
          <Button render={<Link to="/citizen/new-declaration" />}>
            Nouvelle Déclaration
          </Button>
        </div>

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
            <p className="text-muted-foreground mb-4">
              {filter === 'ALL'
                ? "Vous n'avez pas encore de déclaration."
                : 'Aucune déclaration avec ce statut.'}
            </p>
            {filter === 'ALL' && (
              <Button render={<Link to="/citizen/new-declaration" />}>
                Faire ma première déclaration
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d) => (
              <DeclarationCard key={d.id} declaration={d} linkPrefix="/citizen/declarations" />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
