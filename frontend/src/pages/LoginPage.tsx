import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    const r = localStorage.getItem('user');
    if (r) {
      const user = JSON.parse(r);
      switch (user.role) {
        case 'AGENT':
          navigate('/agent/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/citizen/dashboard');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LoginForm onSuccess={handleSuccess} />
    </motion.div>
  );
}
