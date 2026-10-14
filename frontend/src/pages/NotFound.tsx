import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page introuvable');

  return (
    <motion.div
      className="wrap flex flex-col items-center py-[100px] text-center md:py-[120px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <p className="text-[17px] font-medium text-muted-foreground">Erreur 404</p>
      <h1 className="mt-3 text-[48px] font-bold md:text-[56px]">Cette page n'existe pas.</h1>
      <p className="mt-4 max-w-[520px] text-[21px] text-muted-foreground">
        L'adresse est peut-être erronée, ou la page a été déplacée.
      </p>
      <Button size="lg" className="mt-8" render={<Link to="/" />}>
        Retour à l'accueil
      </Button>
    </motion.div>
  );
}
