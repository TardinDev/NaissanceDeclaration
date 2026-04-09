import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, isCitizen, isAgent, isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Déclaration de Naissance{' '}
          <span className="text-primary">en ligne</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Simplifiez vos démarches administratives. Déclarez la naissance de votre enfant
          directement depuis chez vous, en toute sécurité.
        </p>

        {!isAuthenticated ? (
          <div className="flex gap-4 justify-center">
            <Button size="lg" render={<Link to="/register" />}>
              Commencer
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/login" />}>
              Se connecter
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            {isCitizen && (
              <>
                <Button size="lg" render={<Link to="/citizen/new-declaration" />}>
                  Nouvelle Déclaration
                </Button>
                <Button size="lg" variant="outline" render={<Link to="/citizen/dashboard" />}>
                  Mon tableau de bord
                </Button>
              </>
            )}
            {isAgent && (
              <Button size="lg" render={<Link to="/agent/dashboard" />}>
                Tableau de bord Agent
              </Button>
            )}
            {isAdmin && (
              <Button size="lg" render={<Link to="/admin/dashboard" />}>
                Administration
              </Button>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-3">1</div>
            <h3 className="font-semibold mb-2">Créez votre compte</h3>
            <p className="text-sm text-muted-foreground">
              Inscrivez-vous gratuitement en quelques secondes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-3">2</div>
            <h3 className="font-semibold mb-2">Remplissez le formulaire</h3>
            <p className="text-sm text-muted-foreground">
              Saisissez les informations de naissance étape par étape.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-3">3</div>
            <h3 className="font-semibold mb-2">Suivez votre demande</h3>
            <p className="text-sm text-muted-foreground">
              Suivez le traitement de votre déclaration en temps réel.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
