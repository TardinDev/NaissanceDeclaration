import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import DeclarationStatusBadge from '@/components/declaration/DeclarationStatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardAgent() {
  const { declarations, isLoading, fetchPendingDeclarations } = useDeclarationStore();

  useEffect(() => {
    fetchPendingDeclarations();
  }, [fetchPendingDeclarations]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord Agent</h1>
          <p className="text-muted-foreground">Déclarations en attente de traitement</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : declarations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune déclaration en attente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {declarations.map((d) => (
              <Card key={d.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{d.reference}</CardTitle>
                  <DeclarationStatusBadge status={d.status} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Enfant :</span>{' '}
                        {d.childFirstNames} {d.childLastName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Déclarant :</span>{' '}
                        {d.createdByName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Soumise le{' '}
                        {d.declarationDate
                          ? new Date(d.declarationDate).toLocaleDateString('fr-FR')
                          : new Date(d.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button render={<Link to={`/agent/declarations/${d.id}/review`} />}>
                      Traiter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
