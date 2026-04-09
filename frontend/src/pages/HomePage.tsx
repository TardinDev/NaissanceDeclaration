import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_MODE } from '@/mock/data';

const DEMO_ACCOUNTS = [
  {
    label: 'Citoyen',
    description: 'Déclarer une naissance, suivre ses demandes',
    email: 'citoyen@test.fr',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    badge: 'text-blue-700 bg-blue-100',
  },
  {
    label: 'Agent',
    description: 'Traiter les déclarations (approuver / rejeter)',
    email: 'agent@mairie.fr',
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    badge: 'text-amber-700 bg-amber-100',
  },
  {
    label: 'Admin',
    description: 'Statistiques, gestion des utilisateurs et rôles',
    email: 'admin@mairie.fr',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    badge: 'text-red-700 bg-red-100',
  },
];

export default function HomePage() {
  const { isAuthenticated, isCitizen, isAgent, isAdmin } = useAuth();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleDemoLogin = async (email: string) => {
    await login(email, 'demo');
    if (email === 'admin@mairie.fr') navigate('/admin/dashboard');
    else if (email === 'agent@mairie.fr') navigate('/agent/dashboard');
    else navigate('/citizen/dashboard');
  };

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

      {/* Section démo pour les recruteurs */}
      {MOCK_MODE && !isAuthenticated && (
        <motion.div
          className="max-w-3xl mx-auto mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Mode démo</p>
            <h2 className="text-xl font-semibold mt-1">Testez l'application avec un compte démo</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Cliquez sur un rôle pour vous connecter instantanément et explorer le circuit complet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email)}
                className={`rounded-lg border p-5 text-left transition-colors cursor-pointer ${account.color}`}
              >
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${account.badge}`}>
                  {account.label}
                </span>
                <p className="text-sm text-gray-700">{account.description}</p>
                <p className="text-xs text-gray-500 mt-2">{account.email}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
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
