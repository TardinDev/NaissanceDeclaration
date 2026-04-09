import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="container mx-auto px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <RegisterForm onSuccess={() => navigate('/citizen/dashboard')} />
    </motion.div>
  );
}
