import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-semibold mb-2">Page introuvable</h1>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button size="lg" render={<Link to="/" />}>
          Retour à l'accueil
        </Button>
      </motion.div>
    </div>
  );
}
