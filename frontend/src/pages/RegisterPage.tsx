import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '@/components/auth/RegisterForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { homePathFor } from '@/lib/roles';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  usePageTitle('Créer un compte');
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={homePathFor(role)} replace />;
  }

  return (
    <motion.div
      className="wrap py-[60px] md:py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <RegisterForm onSuccess={() => navigate('/citizen/dashboard', { replace: true })} />
    </motion.div>
  );
}
