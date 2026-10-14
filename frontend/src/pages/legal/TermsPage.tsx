import { Link } from 'react-router-dom';
import LegalLayout from './LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Conditions d'utilisation" updatedAt="14 octobre 2026">
      <section>
        <h2>Objet</h2>
        <p>
          Ce site permet de saisir une déclaration de naissance en ligne et d'en suivre l'instruction. Il s'agit d'un
          projet de démonstration : les déclarations saisies n'ont aucune valeur juridique et ne remplacent pas la
          démarche auprès d'un officier d'état civil.
        </p>
      </section>

      <section>
        <h2>Compte</h2>
        <p>
          La création d'un compte est gratuite. Vous êtes responsable de la confidentialité de votre mot de passe et
          de l'usage fait de votre compte.
        </p>
      </section>

      <section>
        <h2>Exactitude des informations</h2>
        <p>
          Vous vous engagez à fournir des informations exactes et à disposer des justificatifs demandés. Une
          déclaration incomplète ou inexacte peut être rejetée par le service.
        </p>
      </section>

      <section>
        <h2>Disponibilité</h2>
        <p>
          Le service est fourni en l'état, sans garantie de disponibilité. Les données de démonstration peuvent être
          réinitialisées à tout moment.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans la{' '}
          <Link to="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
