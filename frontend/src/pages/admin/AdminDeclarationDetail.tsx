import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import BackLink from '@/components/common/BackLink';
import DeclarationDetail from '@/components/declaration/DeclarationDetail';
import ReviewPanel from '@/components/declaration/ReviewPanel';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminDeclarationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDeclaration, isLoading, error, fetchDeclarationById, reviewDeclaration, clearCurrent } =
    useDeclarationStore();
  usePageTitle(currentDeclaration ? `Déclaration ${currentDeclaration.reference}` : 'Déclaration');

  useEffect(() => {
    if (id) fetchDeclarationById(Number(id));
    return () => clearCurrent();
  }, [id, fetchDeclarationById, clearCurrent]);

  const handleReview = async (approved: boolean, comment: string) => {
    if (!id) return;
    try {
      await reviewDeclaration(Number(id), { approved, comment });
      navigate('/admin/dashboard');
    } catch {
      // Error handled by store
    }
  };

  if (!currentDeclaration) {
    if (isLoading) return <LoadingSpinner />;
    return (
      <div className="wrap py-20 text-center">
        <h1 className="text-[32px] font-semibold">Déclaration introuvable.</h1>
        <Button className="mt-6" render={<Link to="/admin/dashboard" />}>
          Administration
        </Button>
      </div>
    );
  }

  const canReview = currentDeclaration.status === 'SUBMITTED' || currentDeclaration.status === 'IN_REVIEW';

  return (
    <motion.div
      className="wrap space-y-6 py-10 md:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <BackLink to="/admin/dashboard">Administration</BackLink>
      <DeclarationDetail declaration={currentDeclaration} />
      {canReview && <ReviewPanel onReview={handleReview} isLoading={isLoading} error={error} />}
    </motion.div>
  );
}
