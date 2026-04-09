import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import DeclarationDetail from '@/components/declaration/DeclarationDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyDeclarations() {
  const { id } = useParams<{ id: string }>();
  const { currentDeclaration, isLoading, fetchDeclarationById, clearCurrent } = useDeclarationStore();

  useEffect(() => {
    if (id) {
      fetchDeclarationById(Number(id));
    }
    return () => clearCurrent();
  }, [id, fetchDeclarationById, clearCurrent]);

  if (isLoading) return <LoadingSpinner />;

  if (!currentDeclaration) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Déclaration non trouvée.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <DeclarationDetail declaration={currentDeclaration} />
      </motion.div>
    </div>
  );
}
