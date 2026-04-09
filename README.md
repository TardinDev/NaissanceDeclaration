# Mairie - Déclaration de Naissance

Application web fullstack permettant aux citoyens de déclarer des naissances en ligne et aux agents de mairie de traiter les demandes.

## Fonctionnalités

### Citoyen
- Inscription et connexion sécurisée
- Déclaration de naissance via formulaire multi-étapes
- Suivi en temps réel du statut de la demande
- Historique des déclarations

### Agent de Mairie
- Tableau de bord des déclarations à traiter
- Consultation détaillée des déclarations
- Approbation ou rejet avec commentaire
- Vue d'ensemble des déclarations traitées

### Administrateur
- Gestion des utilisateurs et des rôles
- Tableau de bord avec statistiques
- Vue complète de toutes les déclarations

## Stack Technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite 5, shadcn/ui v4, Tailwind CSS v4, Zustand, Framer Motion |
| Backend | Java 21, Spring Boot 3.2, Spring Security, JWT |
| Base de données | MySQL 8 |
| Déploiement | Vercel (frontend), Render (backend) |

## Prérequis

- **Java** 21+
- **Maven** 3.8+
- **Node.js** 18+
- **npm** 9+
- **MySQL** 8+

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/<votre-username>/Mairie_declaration_Naissance.git
cd Mairie_declaration_Naissance
```

### 2. Backend

```bash
cd backend

# Configurer la base de données
# Créer une base MySQL nommée "declaration_naissance"
mysql -u root -p -e "CREATE DATABASE declaration_naissance;"

# Configurer les variables d'environnement
cp src/main/resources/application.yml src/main/resources/application-local.yml
# Modifier application-local.yml avec vos identifiants MySQL

# Lancer le serveur
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Le backend démarre sur `http://localhost:8080`

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'URL de l'API
# Créer un fichier .env.local avec :
# VITE_API_URL=http://localhost:8080/api/v1

# Lancer le serveur de développement
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

## Structure du Projet

```
Mairie_declaration_Naissance/
├── backend/                  # API Spring Boot
│   ├── src/main/java/       # Code source Java
│   ├── src/main/resources/  # Configuration
│   └── pom.xml              # Dépendances Maven
├── frontend/                 # Application React
│   ├── src/                 # Code source TypeScript
│   ├── public/              # Assets statiques
│   └── package.json         # Dépendances npm
├── CLAUDE.md                # Documentation technique détaillée
└── README.md                # Ce fichier
```

## API Documentation

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |

### Déclarations
| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/api/v1/declarations` | CITIZEN | Créer une déclaration |
| GET | `/api/v1/declarations/my` | CITIZEN | Mes déclarations |
| GET | `/api/v1/declarations/{id}` | ALL | Détail d'une déclaration |
| PUT | `/api/v1/declarations/{id}` | CITIZEN | Modifier un brouillon |
| PATCH | `/api/v1/declarations/{id}/submit` | CITIZEN | Soumettre |
| GET | `/api/v1/declarations/pending` | AGENT | Déclarations à traiter |
| PATCH | `/api/v1/declarations/{id}/review` | AGENT | Traiter une déclaration |
| GET | `/api/v1/declarations/all` | ADMIN | Toutes les déclarations |

### Administration
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/admin/users` | Liste des utilisateurs |
| PATCH | `/api/v1/admin/users/{id}/role` | Modifier un rôle |
| GET | `/api/v1/admin/stats` | Statistiques |

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
   - **Start Command** : `java -jar target/*.jar`
4. Ajouter les variables d'environnement :
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`

## Licence

Ce projet est à usage éducatif et administratif.
# NaissanceDeclaration
