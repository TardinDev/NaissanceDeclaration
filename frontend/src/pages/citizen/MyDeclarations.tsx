import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { downloadCertificate } from '@/api/certificate';
import { FormAlert } from '@/components/common/FormError';
import BackLink from '@/components/common/BackLink';
import DeclarationDetail from '@/components/declaration/DeclarationDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { MOCK_MODE } from '@/mock/data';
import { useDeclarationStore } from '@/store/useDeclarationStore';

export default function MyDeclarations() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentDeclaration, isLoading, error, fetchDeclarationById, submitDeclaration, clearCurrent } =
    useDeclarationStore();
  const [notice, setNotice] = useState((location.state as { notice?: string } | null)?.notice);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  usePageTitle(currentDeclaration ? `Déclaration ${currentDeclaration.reference}` : 'Déclaration');

  useEffect(() => {
    if (id) fetchDeclarationById(Number(id));
    return () => clearCurrent();
  }, [id, fetchDeclarationById, clearCurrent]);

  if (!currentDeclaration) {
    if (isLoading) return <LoadingSpinner />;
    return (
      <div className="wrap py-20 text-center">
        <h1 className="text-[32px] font-semibold">Déclaration introuvable.</h1>
        <Button className="mt-6" render={<Link to="/citizen/dashboard" />}>
          Mes déclarations
        </Button>
      </div>
    );
  }

  const d = currentDeclaration;

  const handleSubmit = async () => {
    try {
      await submitDeclaration(d.id);
      setConfirmSubmit(false);
      setNotice('Déclaration soumise. Le service de l’état civil va l’examiner.');
    } catch {
      // Error handled by store
    }
  };

  const handleDownload = async () => {
    setDownloadError(null);
    if (MOCK_MODE) {
      // Pas de backend en mode démo : on passe par l'impression du navigateur
      window.print();
      return;
    }
    try {
      await downloadCertificate(d.id, d.reference);
    } catch {
      setDownloadError("Le téléchargement de l'acte a échoué. Réessayez dans un instant.");
    }
  };

  const actions =
    d.status === 'DRAFT' ? (
      <>
        <Button variant="outline" render={<Link to={`/citizen/declarations/${d.id}/edit`} />}>
          Modifier
        </Button>
        <Button onClick={() => setConfirmSubmit(true)}>Soumettre</Button>
      </>
    ) : d.status === 'APPROVED' ? (
      <Button onClick={handleDownload}>{MOCK_MODE ? "Imprimer l'acte" : "Télécharger l'acte (PDF)"}</Button>
    ) : d.status === 'REJECTED' ? (
      <Button render={<Link to="/citizen/new-declaration" />}>Nouvelle déclaration</Button>
    ) : null;

  return (
    <motion.div
      className="wrap space-y-6 py-10 md:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <BackLink to="/citizen/dashboard">Mes déclarations</BackLink>

      {notice && (
        <p role="status" className="no-print rounded-lg bg-success/8 px-4 py-3 text-[15px] text-success">
          {notice}
        </p>
      )}
      <FormAlert message={error ?? downloadError} />

      {confirmSubmit && d.status === 'DRAFT' && (
        <div className="rounded-card bg-muted p-6">
          <p className="text-[17px] font-medium">Soumettre cette déclaration ?</p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Une fois soumise, elle ne pourra plus être modifiée. Assurez-vous de disposer de tous les justificatifs.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Envoi…' : 'Oui, soumettre'}
            </Button>
            <Button variant="secondary" onClick={() => setConfirmSubmit(false)} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      <DeclarationDetail declaration={d} actions={actions} />
    </motion.div>
  );
}
