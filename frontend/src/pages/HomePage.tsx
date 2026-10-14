import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_MODE } from '@/mock/data';

const DEMO_ACCOUNTS = [
  {
    label: 'Citoyen',
    description: 'Déclarer une naissance et suivre ses demandes.',
    email: 'citoyen@test.fr',
    path: '/citizen/dashboard',
  },
  {
    label: 'Agent',
    description: 'Examiner les déclarations, les approuver ou les rejeter.',
    email: 'agent@mairie.fr',
    path: '/agent/dashboard',
  },
  {
    label: 'Administrateur',
    description: 'Consulter les statistiques et gérer les rôles.',
    email: 'admin@mairie.fr',
    path: '/admin/dashboard',
  },
];

const STEPS = [
  {
    title: 'Créez votre compte.',
    text: 'Une adresse e-mail et un mot de passe suffisent.',
  },
  {
    title: 'Remplissez le formulaire.',
    text: "L'enfant, les parents, le déclarant : cinq étapes guidées, avec enregistrement en brouillon.",
  },
  {
    title: 'Suivez votre demande.',
    text: "Chaque changement de statut apparaît dans votre espace, avec le commentaire de l'agent.",
  },
];

const DOCUMENTS = [
  "Certificat médical d'accouchement",
  "Pièce d'identité du déclarant",
  "Pièce d'identité de la mère",
  'Livret de famille, si vous en avez un',
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -60px 0px' },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

export default function HomePage() {
  usePageTitle();
  const { isAuthenticated, isCitizen, isAgent, isAdmin } = useAuth();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleDemoLogin = async (email: string, path: string) => {
    await login(email, 'demo');
    navigate(path);
  };

  const primaryCta = !isAuthenticated
    ? { to: '/register', label: 'Commencer' }
    : isCitizen
      ? { to: '/citizen/new-declaration', label: 'Nouvelle déclaration' }
      : isAgent
        ? { to: '/agent/dashboard', label: 'Déclarations à traiter' }
        : { to: '/admin/dashboard', label: 'Administration' };

  const secondaryCta = !isAuthenticated
    ? { to: '/login', label: 'Se connecter' }
    : isCitizen
      ? { to: '/citizen/dashboard', label: 'Mes déclarations' }
      : isAdmin
        ? { to: '/agent/dashboard', label: 'Déclarations à traiter' }
        : null;

  return (
    <>
      {/* Hero */}
      <section className="bg-background">
        <motion.div
          className="wrap flex flex-col items-center py-[100px] text-center md:py-[120px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="text-[17px] font-medium text-muted-foreground md:text-[21px]">Service de l'état civil</p>
          <h1 className="mt-3 text-[48px] leading-[1.05] font-bold md:text-[56px] lg:text-[80px]">
            Déclarez une naissance.
          </h1>
          <p className="mt-4 max-w-[640px] text-[21px] leading-[1.38] text-muted-foreground md:text-[28px] md:leading-[1.25]">
            En ligne, depuis chez vous. Sans file d'attente.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Button size="lg" render={<Link to={primaryCta.to} />}>
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Link to={secondaryCta.to} className="text-[17px] text-primary hover:underline">
                {secondaryCta.label} <span aria-hidden="true">›</span>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Étapes */}
      <section className="bg-muted py-[60px] md:py-20 lg:py-[100px]">
        <div className="wrap">
          <motion.h2 {...reveal} className="text-center text-[32px] font-semibold md:text-[48px]">
            Trois étapes. C'est tout.
          </motion.h2>
          <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.15 }}
                className="rounded-card bg-card p-8"
              >
                <p className="text-[48px] leading-none font-semibold text-muted-foreground/50" aria-hidden="true">
                  {i + 1}
                </p>
                <h3 className="mt-6 text-[24px] font-semibold">{step.title}</h3>
                <p className="mt-3 text-[17px] text-muted-foreground">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Justificatifs */}
      <section className="bg-background py-[60px] md:py-20 lg:py-[100px]">
        <div className="wrap grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
          <motion.div {...reveal}>
            <h2 className="text-[32px] font-semibold md:text-[48px]">Ce qu'il vous faut.</h2>
            <p className="mt-4 text-[19px] text-muted-foreground md:text-[21px]">
              Préparez ces quatre documents avant de commencer. Le formulaire vous demandera de confirmer que vous
              les avez.
            </p>
          </motion.div>
          <motion.ul {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="divide-y border-y">
            {DOCUMENTS.map((doc) => (
              <li key={doc} className="py-5 text-[19px] font-medium md:text-[21px]">
                {doc}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Comptes de démonstration */}
      {MOCK_MODE && !isAuthenticated && (
        <section className="bg-muted py-[60px] md:py-20 lg:py-[100px]">
          <div className="wrap">
            <motion.div {...reveal} className="text-center">
              <h2 className="text-[32px] font-semibold md:text-[48px]">Essayez sans compte.</h2>
              <p className="mx-auto mt-4 max-w-[640px] text-[19px] text-muted-foreground md:text-[21px]">
                Choisissez un rôle pour vous connecter en un clic et parcourir le circuit complet.
              </p>
            </motion.div>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
              {DEMO_ACCOUNTS.map((account, i) => (
                <motion.button
                  key={account.email}
                  type="button"
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.15 }}
                  onClick={() => handleDemoLogin(account.email, account.path)}
                  className="group flex cursor-pointer flex-col items-start rounded-card bg-card p-8 text-left shadow-card transition-shadow outline-none hover:shadow-hover focus-visible:ring-4 focus-visible:ring-ring/30"
                >
                  <h3 className="text-[24px] font-semibold">{account.label}</h3>
                  <p className="mt-3 flex-1 text-[17px] text-muted-foreground">{account.description}</p>
                  <p className="mt-6 text-[17px] text-primary group-hover:underline">
                    Se connecter <span aria-hidden="true">›</span>
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Appel à l'action */}
      {!isAuthenticated && (
        <section className="bg-ink py-[60px] text-center text-white md:py-20 lg:py-[100px]">
          <motion.div {...reveal} className="wrap flex flex-col items-center">
            <h2 className="text-[32px] font-semibold md:text-[48px]">Prêt à commencer ?</h2>
            <p className="mt-4 max-w-[640px] text-[19px] text-[#a1a1a6] md:text-[21px]">
              La création du compte est gratuite et prend moins d'une minute.
            </p>
            <Button size="lg" className="mt-8" render={<Link to="/register" />}>
              Créer mon compte
            </Button>
          </motion.div>
        </section>
      )}
    </>
  );
}
