import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeclarationForm from '@/components/declaration/DeclarationForm';
import BackLink from '@/components/common/BackLink';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import type { Declaration, DeclarationFormData } from '@/types';

function toFormData(d: Declaration): DeclarationFormData {
  return {
    childLastName: d.childLastName,
    childFirstNames: d.childFirstNames,
    childBirthDate: d.childBirthDate,
    childBirthPlace: d.childBirthPlace,
    childGender: d.childGender,
    fatherLastName: d.fatherLastName ?? '',
    fatherFirstNames: d.fatherFirstNames ?? '',
    fatherBirthDate: d.fatherBirthDate ?? '',
    fatherNationality: d.fatherNationality ?? '',
    fatherProfession: d.fatherProfession ?? '',
    fatherAddress: d.fatherAddress ?? '',
    motherLastName: d.motherLastName,
    motherFirstNames: d.motherFirstNames,
    motherBirthDate: d.motherBirthDate ?? '',
    motherNationality: d.motherNationality ?? '',
    motherProfession: d.motherProfession ?? '',
    motherAddress: d.motherAddress ?? '',
    declarantLastName: d.declarantLastName,
    declarantFirstNames: d.declarantFirstNames,
    declarantQuality: d.declarantQuality,
  };
}

/** Création d'une déclaration, ou reprise d'un brouillon quand la route porte un id. */
export default function NewDeclaration() {
  const { id } = useParams<{ id: string }>();
  const editingId = id ? Number(id) : null;
  usePageTitle(editingId ? 'Modifier le brouillon' : 'Nouvelle déclaration');

  const navigate = useNavigate();
  const {
    currentDeclaration,
    isLoading,
    error,
    fetchDeclarationById,
    createDeclaration,
    updateDeclaration,
    submitDeclaration,
    clearError,
    clearCurrent,
  } = useDeclarationStore();

  // Si l'envoi échoue après la création, un nouvel essai met à jour le brouillon au lieu d'en créer un second
  const savedId = useRef<number | null>(editingId);

  useEffect(() => {
    clearError();
    if (editingId) fetchDeclarationById(editingId);
    return () => clearCurrent();
  }, [editingId, fetchDeclarationById, clearError, clearCurrent]);

  const save = async (data: DeclarationFormData): Promise<number> => {
    if (savedId.current) {
      await updateDeclaration(savedId.current, data);
      return savedId.current;
    }
    const created = await createDeclaration(data);
    savedId.current = created.id;
    return created.id;
  };

  const handleSaveDraft = async (data: DeclarationFormData) => {
    try {
      const declarationId = await save(data);
      navigate(`/citizen/declarations/${declarationId}`, { state: { notice: 'Brouillon enregistré.' } });
    } catch {
      // Error handled by store
    }
  };

  const handleSubmit = async (data: DeclarationFormData) => {
    try {
      const declarationId = await save(data);
      await submitDeclaration(declarationId);
      navigate(`/citizen/declarations/${declarationId}`, {
        state: { notice: 'Déclaration soumise. Le service de l’état civil va l’examiner.' },
      });
    } catch {
      // Error handled by store
    }
  };

  const draft = editingId && currentDeclaration?.id === editingId ? currentDeclaration : null;

  if (editingId && !draft) {
    if (error && !isLoading) return <Navigate to="/citizen/dashboard" replace />;
    return <LoadingSpinner />;
  }

  if (draft && draft.status !== 'DRAFT') {
    return <Navigate to={`/citizen/declarations/${draft.id}`} replace />;
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-[740px] px-5 py-10 md:px-6 md:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <BackLink to="/citizen/dashboard">Mes déclarations</BackLink>
      <h1 className="mt-4 text-[40px] font-semibold md:text-[48px]">
        {draft ? 'Reprenez votre brouillon.' : 'Nouvelle déclaration.'}
      </h1>
      <p className="mt-3 mb-10 text-[19px] text-muted-foreground md:text-[21px]">
        {draft ? `Référence ${draft.reference}.` : 'Cinq étapes. Comptez cinq minutes.'}
      </p>

      <DeclarationForm
        initialData={draft ? toFormData(draft) : undefined}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isLoading={isLoading}
        error={error}
      />
    </motion.div>
  );
}
