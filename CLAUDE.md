# CLAUDE.md — Mairie Déclaration de Naissance

## Projet
Application fullstack permettant aux citoyens de déclarer des naissances en ligne.
Les agents de mairie traitent les demandes. Les admins gèrent le système.

## Stack Technique

### Backend
- **Langage** : Java 17+ (compilé avec Java 21, JAVA_HOME doit pointer vers JDK 21)
- **Framework** : Spring Boot 3.2
- **Sécurité** : Spring Security + JWT (jjwt 0.12.x)
- **ORM** : Spring Data JPA / Hibernate
- **BDD** : MySQL 8
- **Validation** : Jakarta Validation
- **Build** : Maven

### Frontend
- **Runtime** : Vite 5 + React 19
- **Langage** : TypeScript 6 strict
- **UI** : shadcn/ui v4 + Tailwind CSS v4
- **State** : Zustand
- **Animations** : Framer Motion
- **HTTP** : Axios
- **Routing** : React Router v6

### Déploiement
- **Frontend** : Vercel
- **Backend** : Render
- **BDD** : MySQL (service cloud ou Render)

## Architecture

### Rôles
| Rôle | Enum | Description |
|------|------|-------------|
| Citoyen | `CITIZEN` | Déclare des naissances, suit ses demandes |
| Agent | `AGENT` | Traite les déclarations (approuve/rejette) |
| Admin | `ADMIN` | Gère les utilisateurs, statistiques système |

### Workflow Déclaration
```
DRAFT → SUBMITTED → IN_REVIEW → APPROVED | REJECTED
```

### Endpoints API (préfixe `/api/v1`)

#### Auth (`/api/v1/auth`) — Public
- `POST /register` — Inscription citoyen
- `POST /login` — Connexion (retourne JWT)

#### Déclarations (`/api/v1/declarations`)
- `POST /` — Créer (CITIZEN)
- `GET /my` — Mes déclarations (CITIZEN)
- `GET /{id}` — Détail (CITIZEN propriétaire, AGENT, ADMIN)
- `PUT /{id}` — Modifier brouillon (CITIZEN propriétaire)
- `PATCH /{id}/submit` — Soumettre (CITIZEN)
- `GET /pending` — Déclarations à traiter (AGENT, ADMIN)
- `GET /all` — Toutes les déclarations (ADMIN)
- `PATCH /{id}/review` — Traiter une déclaration (AGENT)

#### Admin (`/api/v1/admin`)
- `GET /users` — Liste utilisateurs (ADMIN)
- `PATCH /users/{id}/role` — Changer rôle (ADMIN)
- `GET /stats` — Statistiques (ADMIN)

### Structure BDD

#### Table `users`
- id, email (unique), password (BCrypt), first_name, last_name, role, created_at, updated_at

#### Table `declarations`
- id, reference (unique, auto), child_last_name, child_first_names, child_birth_date, child_birth_place, child_gender
- father_last_name, father_first_names, father_birth_date, father_nationality, father_profession, father_address
- mother_last_name, mother_first_names, mother_birth_date, mother_nationality, mother_profession, mother_address
- declarant_last_name, declarant_first_names, declarant_quality
- status, agent_comment, declaration_date, processing_date
- created_by (FK users), processed_by (FK users)
- created_at, updated_at

## Commandes

### Backend
```bash
cd backend

# IMPORTANT : utiliser Java 21 (Lombok incompatible avec Java 25)
export JAVA_HOME=/Users/tardindavy/Library/Java/JavaVirtualMachines/ms-21.0.9/Contents/Home

mvn clean compile        # Compiler
mvn spring-boot:run      # Lancer en dev
mvn test                 # Tests
mvn package              # Build JAR
```

### Frontend
```bash
cd frontend
npm install              # Installer dépendances
npm run dev              # Lancer en dev (port 5173)
npm run build            # Build production
npm run preview          # Preview build
```

## Conventions

### Code Backend
- Package base : `com.mairie.declaration`
- Annotations Lombok : `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- DTOs séparés pour request/response
- Validation via annotations Jakarta (`@NotBlank`, `@Email`, `@Size`, etc.)
- Gestion d'erreurs centralisée via `@RestControllerAdvice`

### Code Frontend
- Composants fonctionnels avec TypeScript strict
- Fichiers en PascalCase pour composants, camelCase pour utils/hooks
- Store Zustand : un store par domaine (auth, declaration)
- API calls dans des services dédiés via Axios
- Pas de `any` — typer tout explicitement

### Git
- Branches : `main`, `develop`, `feature/*`, `fix/*`
- Commits conventionnels : `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- PR obligatoire pour merge dans main

## Sécurité
- Mots de passe hashés BCrypt (strength 12)
- JWT avec expiration 24h
- CORS configuré pour le domaine frontend uniquement
- Validation des entrées côté serveur
- Protection CSRF désactivée (API stateless)
- Rate limiting recommandé en production
- Variables sensibles dans les variables d'environnement (jamais dans le code)
