# 💰 La Pince - Application de Gestion de Finances Personnelles

## 📝 Présentation

**La Pince** est une application web de gestion de finance personnelle pour une entreprise fictive, à destination de divers profils de particuliers/travailleurs indépendants (étudiants, actifs, couples et familles, auto-entrepreneurs, etc.) souhaitant suivre, catégoriser et anticiper les dépenses mensuelles.

---

## ✨ Fonctionnalités

### 🔐 Authentification utilisateur

- Inscription
- Connexion
- Déconnexion

### 📁 Gestion des catégories

- Créer, modifier, supprimer des catégories de dépenses

### 💸 Gestion des dépenses

- Ajouter, modifier, supprimer des dépenses par catégorie et par date

### 🔔 Notification

- Alerte lorsque la somme des dépenses mensuelles pour une catégorie dépasse le budget prévu

### 📱 Interface réactive

- Navigation fluide avec sidebar et burger menu

### 🔒 Sécurité

- Système d'authentification avec JWT pour sécuriser les endpoints API

---

## 🛠️ Technologies Utilisées

### Frontend

- **Svelte**
- **HTML**
- **CSS**
- **JavaScript**

### Backend

- **Node.js**
- **Express**

### Base de données

- **PostgreSQL**
- **Sequelize**

---

## 🚀 Installation et Lancement

### 1. Cloner le repo en local

```bash
git clone https://github.com/votre-repo/la-pince.git
cd la-pince
```

### 2. Installation du client (dans `/client`)

**Installation des modules :**

```bash
cd client
npm install
```

**Création du fichier `.env` :**

```env
VITE_API_URL=<url de l'api>
```

### 3. Installation de l'API (dans `/api`)

**Installation des modules :**

```bash
cd ../api
npm install
```

**Création du fichier `.env` :**

```env
PORT=<port d'écoute pour l'api>
BASE_URL=<url de base (ex: http://localhost)>
DATABASE_URL=<url de la base de donnée avec identifiants>
JWT_SECRET=<phrase secrète pour les jsonwebtoken>
```

### 4. Lancer l'application

**Client :**

```bash
cd client
npm run dev
```

**API :**

```bash
cd api
npm run dev
```

---

## 📱 Utilisation

### 1. Page d'accueil

- Présentation de l'application
- Cibles utilisateurs (étudiants, familles, indépendants)
- Services proposés

### 2. Inscription

- Remplir le formulaire avec nom/pseudo, email et mot de passe
- Accepter les mentions légales
- Redirection automatique vers le dashboard

### 3. Connexion

- Se connecter avec email et mot de passe
- Redirection automatique vers le dashboard

### 4. Dashboard

- Visualiser les dépenses totales mensuelles
- Voir le graphique de répartition des postes de dépenses par catégories
- Ajouter de nouvelles dépenses (via sidebar)
- Rechercher et filtrer par catégorie et dates
- Fonction de tri par montant de dépenses
- Modifier ou supprimer des dépenses
- Alerte lorsque le budget mensuel d'une catégorie est dépassé

### 5. Catégories

- Créer des catégories personnalisées (via sidebar)
- Choisir une couleur et une icône
- Définir un budget maximum
- Modifier ou supprimer des catégories

---

## 📂 Structure du Projet

```
la-pince/
├── client/              # Application frontend
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
├── api/                 # API backend
│   ├── src/
│   ├── .env
│   └── package.json
└── README.md
```

---

## 👥 Auteurs

Développé par l'équipe La Pince

---

## 📄 Licence

Ce projet est un projet fictif à des fins éducatives.

---

**Fait avec ❤️ par l'équipe La Pince**
