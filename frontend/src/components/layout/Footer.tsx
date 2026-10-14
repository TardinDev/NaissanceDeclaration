import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-muted text-xs text-muted-foreground">
      <div className="wrap py-5">
        <p className="border-b border-[#d2d2d7] pb-4 leading-relaxed">
          Application de démonstration. Les déclarations saisies ici ne produisent aucun acte d'état civil.
        </p>
        <div className="flex flex-col gap-2 pt-4 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Mairie – Service de l'état civil</p>
          <nav aria-label="Liens légaux" className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/confidentialite" className="hover:text-foreground hover:underline">
              Confidentialité
            </Link>
            <Link to="/cgu" className="hover:text-foreground hover:underline">
              Conditions d'utilisation
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
