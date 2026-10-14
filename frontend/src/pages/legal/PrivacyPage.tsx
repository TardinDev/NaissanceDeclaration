import { Link } from 'react-router-dom';
import LegalLayout from './LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="14 octobre 2026">
      <section>
        <h2>Une application de démonstration</h2>
        <p>
          Ce site est un projet de démonstration. Il n'est rattaché à aucune mairie et ne produit aucun acte d'état
          civil. N'y saisissez pas de données personnelles réelles.
        </p>
      </section>

      <section>
        <h2>Données traitées</h2>
        <ul>
          <li>Compte : prénom, nom, adresse e-mail et mot de passe (stocké sous forme hachée).</li>
          <li>
            Déclaration : identité, date et lieu de naissance de l'enfant ; identité, date de naissance, nationalité,
            profession et adresse des parents ; identité et qualité du déclarant.
          </li>
          <li>Traitement : statut de la déclaration, commentaire de l'agent et dates de traitement.</li>
        </ul>
      </section>

      <section>
        <h2>Finalité et accès</h2>
        <p>
          Ces données servent uniquement à enregistrer une déclaration de naissance et à en suivre le traitement.
          Elles sont consultées par le déclarant, par les agents chargés de l'instruction et par les administrateurs
          du service.
        </p>
      </section>

      <section>
        <h2>Cookies et stockage local</h2>
        <p>
          Le site ne dépose aucun cookie et n'utilise aucun outil de mesure d'audience ou de publicité. Seul un jeton
          de session est conservé dans le stockage local de votre navigateur pour vous maintenir connecté. Il est
          supprimé à la déconnexion.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Le règlement général sur la protection des données vous donne un droit d'accès, de rectification,
          d'effacement, de limitation et d'opposition sur vos données. Dans un déploiement réel, ces demandes
          s'adressent au délégué à la protection des données de la commune, et vous pouvez saisir la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            CNIL
          </a>{' '}
          en cas de difficulté.
        </p>
      </section>

      <section>
        <h2>Voir aussi</h2>
        <p>
          <Link to="/cgu">Conditions d'utilisation</Link>
        </p>
      </section>
    </LegalLayout>
  );
}
