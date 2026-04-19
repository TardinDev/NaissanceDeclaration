# Mairie - Déclaration de Naissance

Application web fullstack permettant aux citoyens de déclarer des naissances en ligne et aux agents de mairie de traiter les demandes — avec génération d'un acte de naissance officiel en PDF.

> **Circuit complet** : Citoyen → Agent → Admin.
> Remplace les déplacements en mairie et les formulaires papier par un workflow en ligne, sécurisé et traçable de bout en bout.

---

## Fonctionnalités

### Citoyen
- Inscription et connexion sécurisée (JWT stateless)
- Déclaration de naissance via formulaire multi-étapes validé
- Suivi en temps réel du statut de la demande
- Historique des déclarations
- Téléchargement de l'acte de naissance officiel en **PDF** une fois approuvé

### Agent de Mairie
- Tableau de bord des déclarations à traiter
- Consultation détaillée des déclarations
- Approbation ou rejet avec commentaire
- Vue d'ensemble des déclarations traitées

### Administrateur
- Gestion des utilisateurs et des rôles
- Tableau de bord avec statistiques
- Vue complète de toutes les déclarations

---

## Stack Technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite 5, shadcn/ui v4, Tailwind CSS v4, Zustand, Framer Motion |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Base de données | MySQL 8 |
| Déploiement | Vercel (frontend), Render (backend) |

---

## Architecture & choix techniques (backend)

Le backend n'est pas un empilement de fichiers au hasard : c'est une API Spring Boot pensée pour être **maintenable, testable et documentée**, suivant les standards qu'on retrouve dans les équipes produit sérieuses.

### Structure en couches

```
controller → service → repository → entity
```

- **`controller`** : exposition HTTP + Swagger, ne contient aucune logique métier.
- **`service`** : logique métier + règles de validation applicative + transactions (`@Transactional`).
- **`repository`** : `JpaRepository` de Spring Data, requêtes dérivées.
- **`entity`** : modèle JPA — **jamais exposé** au monde extérieur.
- **`dto` (`request` / `response`)** : ce que le client envoie et reçoit. Découplé de la base.
- **`mapper`** : conversion DTO ↔ Entity générée à la compilation par MapStruct.
- **`exception`** : `@RestControllerAdvice` centralisé, format d'erreur unique.
- **`config`** : Spring Security, JWT, OpenAPI.

### Briques clés

| Brique | Rôle |
|--------|------|
| **Spring Data JPA** | Persistance déclarative, requêtes dérivées, transactions gérées par annotation |
| **Spring Security + JWT** | Auth stateless, filtre JWT dédié, RBAC par rôle (`CITIZEN` / `AGENT` / `ADMIN`) |
| **Bean Validation** (`@Valid`, `@NotBlank`, `@NotNull`) | Validation de tous les DTOs de requête avec messages localisés |
| **`@RestControllerAdvice`** | Gestion d'erreurs centralisée, réponses `ApiResponse<T>` cohérentes, pas de stacktrace qui fuit |
| **MapStruct** | Mapping DTO ↔ Entity généré à la compilation, zéro boilerplate, `componentModel = "spring"` |
| **iText 8** | Génération de l'acte de naissance officiel en PDF, téléchargement sécurisé après approbation |
| **springdoc-openapi** (Swagger UI) | Documentation interactive de l'API avec schéma de sécurité Bearer JWT |
| **Profiles Spring** | `application-dev.yml` vs `application-prod.yml` : logs, pool Hikari et `ddl-auto` adaptés |
| **Tests** | JUnit 5 + Mockito (unit) + Testcontainers (intégration sur vraie base MySQL) |

### Documentation de l'API

Une fois le backend lancé, Swagger UI est accessible à :

```
http://localhost:8080/api/v1/swagger-ui.html
```

Le schéma OpenAPI brut est disponible à `/api/v1/api-docs`.

### Profils d'exécution

```bash
# Dev (défaut)
mvn spring-boot:run

# Prod (lit uniquement les variables d'env)
java -Dspring.profiles.active=prod -jar target/*.jar
```

### Tests

```bash
# Tests unitaires (Mockito)
mvn test

# Tests d'intégration (Testcontainers — nécessite Docker)
mvn verify
```

---

## Prérequis

- **Java** 17+
- **Maven** 3.8+
- **Node.js** 18+
- **npm** 9+
- **MySQL** 8+
- **Docker** (optionnel — pour les tests d'intégration Testcontainers)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/TardinDev/NaissanceDeclaration.git
cd NaissanceDeclaration
```

### 2. Backend

```bash
cd backend

# Créer une base MySQL locale
mysql -u root -p -e "CREATE DATABASE declaration_naissance;"

# Lancer le serveur (profil dev par défaut)
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080` (context-path `/api/v1`).

### 3. Frontend

```bash
cd frontend
npm install

# Configurer l'URL de l'API
# Créer un fichier .env.local avec :
# VITE_API_URL=http://localhost:8080/api/v1

npm run dev
```

Le frontend démarre sur `http://localhost:5173`.

---

## Structure du Projet

```
NaissanceDeclaration/
├── backend/
│   ├── src/main/java/com/mairie/declaration/
│   │   ├── controller/     # Endpoints HTTP + Swagger
│   │   ├── service/        # Logique métier + génération PDF
│   │   ├── repository/     # Spring Data JPA
│   │   ├── entity/         # Modèle JPA (non exposé)
│   │   ├── dto/
│   │   │   ├── request/    # Payloads entrants (Bean Validation)
│   │   │   └── response/   # Payloads sortants
│   │   ├── mapper/         # MapStruct DTO ↔ Entity
│   │   ├── exception/      # @RestControllerAdvice
│   │   └── config/         # Security, JWT, OpenAPI
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   └── application-prod.yml
│   ├── src/test/java/      # JUnit + Mockito + Testcontainers
│   └── pom.xml
├── frontend/                # Application React
├── CLAUDE.md
└── README.md
```

---

## API Documentation

> Toutes les routes sont préfixées par `/api/v1`. Authentification Bearer JWT sauf mention contraire.

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription |
| POST | `/auth/login` | Connexion |

### Déclarations
| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/declarations` | CITIZEN | Créer une déclaration |
| GET | `/declarations/my` | CITIZEN | Mes déclarations |
| GET | `/declarations/{id}` | ALL | Détail d'une déclaration |
| PUT | `/declarations/{id}` | CITIZEN | Modifier un brouillon |
| PATCH | `/declarations/{id}/submit` | CITIZEN | Soumettre |
| GET | `/declarations/pending` | AGENT | Déclarations à traiter |
| PATCH | `/declarations/{id}/review` | AGENT | Approuver / rejeter |
| GET | `/declarations/all` | ADMIN | Toutes les déclarations |
| GET | `/declarations/{id}/pdf` | ALL | **Télécharger l'acte officiel en PDF** (si approuvé) |

### Administration
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/users` | Liste des utilisateurs |
| PATCH | `/admin/users/{id}/role` | Modifier un rôle |
| GET | `/admin/stats` | Statistiques |

---

## Déploiement

### Frontend (Vercel)

1. Connecter le repo GitHub à Vercel
2. Configurer :
   - **Framework** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
3. Ajouter la variable d'environnement `VITE_API_URL`

### Backend (Render)

1. Créer un nouveau Web Service sur Render
2. Connecter le repo GitHub
3. Configurer :
   - **Root Directory** : `backend`
   - **Build Command** : `mvn clean package -DskipTests`
   - **Start Command** : `java -Dspring.profiles.active=prod -jar target/*.jar`
4. Ajouter les variables d'environnement :
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`

---

## Licence

Ce projet est à usage éducatif et administratif.
