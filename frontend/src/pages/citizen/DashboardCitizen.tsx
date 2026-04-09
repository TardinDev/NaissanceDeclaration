import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import { useAuth } from '@/hooks/useAuth';
import DeclarationCard from '@/components/declaration/DeclarationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardCitizen() {
  const { fullName } = useAuth();
  const { declarations, isLoading, fetchMyDeclarations } = useDeclarationStore();

  useEffect(() => {
    fetchMyDeclarations();
  }, [fetchMyDeclarations]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {fullName}</h1>
            <p className="text-muted-foreground">Gérez vos déclarations de naissance</p>
          </div>
          <Button render={<Link to="/citizen/new-declaration" />}>
            Nouvelle Déclaration
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : declarations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore de déclaration.</p>
            <Button render={<Link to="/citizen/new-declaration" />}>
              Faire ma première déclaration
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {declarations.map((d) => (
              <DeclarationCard key={d.id} declaration={d} linkPrefix="/citizen/declarations" />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
