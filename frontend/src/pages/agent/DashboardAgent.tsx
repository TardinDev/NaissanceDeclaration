import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import DeclarationStatusBadge from '@/components/declaration/DeclarationStatusBadge';
import { FormAlert } from '@/components/common/FormError';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SearchField from '@/components/common/SearchField';
import { matchesQuery } from '@/lib/declarations';
import { formatDate } from '@/lib/format';

export default function DashboardAgent() {
  usePageTitle('Déclarations à traiter');
  const { declarations, isLoading, error, fetchPendingDeclarations } = useDeclarationStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchPendingDeclarations();
  }, [fetchPendingDeclarations]);

  // Les plus anciennes d'abord : ce sont celles qui attendent depuis le plus longtemps
  const pending = declarations
    .filter((d) => d.status === 'SUBMITTED' || d.status === 'IN_REVIEW')
    .sort((a, b) => (a.declarationDate ?? a.createdAt).localeCompare(b.declarationDate ?? b.createdAt));
  const filtered = pending.filter((d) => matchesQuery(d, query));

  return (
    <motion.div
      className="wrap py-10 md:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[40px] font-semibold md:text-[48px]">À traiter.</h1>
          <p className="mt-2 text-[19px] text-muted-foreground md:text-[21px]">
            {isLoading
              ? 'Chargement…'
              : pending.length === 0
                ? 'Aucune déclaration en attente.'
                : `${pending.length} déclaration${pending.length > 1 ? 's' : ''} en attente, les plus anciennes d'abord.`}
          </p>
        </div>
        {pending.length > 0 && (
          <SearchField value={query} onChange={setQuery} label="Rechercher un nom ou une référence" />
        )}
      </div>

      <div className="mt-10">
        <FormAlert message={error} />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : pending.length === 0 ? (
        !error && (
          <div className="rounded-card bg-muted px-6 py-16 text-center">
            <h2 className="text-[28px] font-semibold">Tout est traité.</h2>
            <p className="mt-2 text-[17px] text-muted-foreground">
              Les nouvelles déclarations apparaîtront ici dès leur soumission.
            </p>
          </div>
        )
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-[17px] text-muted-foreground">Aucun résultat pour « {query} ».</p>
      ) : (
        <ul className="divide-y border-y">
          {filtered.map((d) => (
            <li key={d.id}>
              <Link
                to={`/agent/declarations/${d.id}/review`}
                className="group -mx-3 flex flex-col gap-3 rounded-lg px-3 py-5 transition-colors outline-none hover:bg-muted focus-visible:ring-4 focus-visible:ring-ring/30 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-[19px] font-semibold">
                    {d.childFirstNames} {d.childLastName}
                  </p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    <span className="tabular-nums">{d.reference}</span> · déclarée par {d.createdByName} · soumise le{' '}
                    {formatDate(d.declarationDate ?? d.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <DeclarationStatusBadge status={d.status} />
                  <span className="text-[15px] text-primary group-hover:underline">
                    Traiter <span aria-hidden="true">›</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
