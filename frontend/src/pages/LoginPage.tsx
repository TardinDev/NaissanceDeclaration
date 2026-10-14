import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { homePathFor } from '@/lib/roles';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  usePageTitle('Connexion');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAuthStore();
  const from = (location.state as { from?: string } | null)?.from;

  if (isAuthenticated) {
    return <Navigate to={from ?? homePathFor(role)} replace />;
  }

  const handleSuccess = () => {
    navigate(from ?? homePathFor(useAuthStore.getState().role), { replace: true });
  };

  return (
    <motion.div
      className="wrap py-[60px] md:py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <LoginForm onSuccess={handleSuccess} />
    </motion.div>
  );
}
