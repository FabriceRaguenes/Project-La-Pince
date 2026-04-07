# Manuel de Déploiement  
## API "La Pince" sur Render

Ce document définit la marche à suivre pour garantir un deploiement sur render

> ⚠️ **Règle imortante** : le schéma doit utiliser des noms de tables au pluriel  
> (`users`, `categories`, `expenses`).

---

## 1 Configuration de l’Infrastructure (Dashboard Render)

### Base de données
- Créez une instance **PostgreSQL** 


- une fois la bdd creer identifiez (allez dans **info**):
  - **External URL** → pour les accès **locaux** (ex : vscode)
  - **Internal URL** → pour la **configuration de l’API** (sur render)

---

## 2 Configuration de l’API (Web Service)

Configuration du **Web Service API** sur Render pour un projet utilisant un dossier `api`

### reglages du service API

| Paramètre        | Valeur à saisir                  |
|------------------|----------------------------------|
| Root Directory   | `./api`                            |
| Build Command    | `npm install && npm run db:create `(**db:create est a retirer apres le premier deploiment**)      **             |
| Start Command    | `npm start` (ou `node index.js`) |

---

### Variables d’Environnement (onglet *Environment*)

```env
DATABASE_URL = <bbd render internal PostgreSQL URL>
JWT_SECRET = <ta_phrase_secrète>
PORT = 3000
```

### 3 Configuration du Front (Static Site)

Si ton Front est dans un dossier séparé (ex : `frontend/`) ou à la racine du projet, crée un **Static Site** sur Render.

### réglages du Static Site

| Paramètre          | Valeur à saisir                                      |
|--------------------|------------------------------------------------------|
| Root Directory     | `./client`          |
| Build Command      | `npm run   build`                       |
| Publish Directory  | `dist` |

---

### Lien avec l’API

Ne pas oublier de modifier l’URL dE L'environnement **VITE_API_URL** dans ton code front  
pour pointer vers l’URL de production :

```env
VITE_API_URL=https://la_pince.onrender.com
```
