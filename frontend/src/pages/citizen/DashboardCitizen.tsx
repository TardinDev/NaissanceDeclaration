import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import DeclarationCard from '@/components/declaration/DeclarationCard';
import StatusFilter, { type StatusFilterValue } from '@/components/declaration/StatusFilter';
import { FormAlert } from '@/components/common/FormError';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardCitizen() {
  usePageTitle('Mes déclarations');
  const { firstName } = useAuth();
  const { declarations, isLoading, error, fetchMyDeclarations } = useDeclarationStore();
  const [filter, setFilter] = useState<StatusFilterValue>('ALL');

  useEffect(() => {
    fetchMyDeclarations();
  }, [fetchMyDeclarations]);

  const filtered = filter === 'ALL' ? declarations : declarations.filter((d) => d.status === filter);

  return (
    <motion.div
      className="wrap py-10 md:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[40px] font-semibold md:text-[48px]">Bonjour, {firstName}.</h1>
          <p className="mt-2 text-[19px] text-muted-foreground md:text-[21px]">
            Vos déclarations de naissance, au même endroit.
          </p>
        </div>
        <Button size="lg" className="self-start md:self-auto" render={<Link to="/citizen/new-declaration" />}>
          Nouvelle déclaration
        </Button>
      </div>

      <div className="mt-10">
        <FormAlert message={error} />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : declarations.length === 0 ? (
        !error && (
          <div className="mt-6 rounded-card bg-muted px-6 py-16 text-center">
            <h2 className="text-[28px] font-semibold">Aucune déclaration pour l'instant.</h2>
            <p className="mt-2 text-[17px] text-muted-foreground">La première prend environ cinq minutes.</p>
            <Button size="lg" className="mt-6" render={<Link to="/citizen/new-declaration" />}>
              Déclarer une naissance
            </Button>
          </div>
        )
      ) : (
        <>
          <StatusFilter declarations={declarations} value={filter} onChange={setFilter} />
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-[17px] text-muted-foreground">Aucune déclaration avec ce statut.</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <DeclarationCard key={d.id} declaration={d} linkPrefix="/citizen/declarations" />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
