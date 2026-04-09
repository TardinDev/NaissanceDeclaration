import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeclarationForm from '@/components/declaration/DeclarationForm';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import type { DeclarationFormData } from '@/types';

export default function NewDeclaration() {
  const navigate = useNavigate();
  const { createDeclaration, submitDeclaration, isLoading } = useDeclarationStore();

  const handleSubmit = async (data: DeclarationFormData) => {
    const declaration = await createDeclaration(data);
    await submitDeclaration(declaration.id);
    navigate('/citizen/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-2">Nouvelle Déclaration de Naissance</h1>
        <p className="text-muted-foreground mb-8">
          Remplissez le formulaire ci-dessous pour déclarer une naissance.
        </p>

        <DeclarationForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}
