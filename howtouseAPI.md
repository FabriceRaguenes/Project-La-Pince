# Comment faire des requetes vers l'API lapince ?

Pour les requetes POST, tous les champs du body sont **obligatoires**

## Authentification

| Verbe  | Chemin          | Description                                                     |
|--------|-----------------|-----------------------------------------------------------------|
| POST   | /auth/login     | Requête de connexion qui renvois un JWT si identifiants valides |
| POST   | /auth/register  | Requête d'inscription                                           |
| POST   | /auth/logout    | Requête de deconnexion                                          |
| GET    | /auth/me        | Requête pour récupérer l'id et le nom du user connecté          |

### Body attendu pour POST :
```
{
    "name": <string, minimum 3 caractères>,
    "email": <string, format d'email standard>,
    "password": <string, entre 8 et 30 caractères, qui contient au moins un chiffe/majuscule/minuscule/caractère spécial parmi : ! @ # $ & * - _ >
}
```


## Categories

| Verbe  | Chemin          | Description                                                     |
|--------|-----------------|-----------------------------------------------------------------|
| GET    | /categories/:id   | Requête pour récupérer une catégorie. id est un entier positif >= 1                            |
| GET    | /categories       | Requête pour récupérer les catégories                           |
| POST   | /categories       | Requête pour ajouter une catégorie                              |
| PATCH  | /categories/:id   | Requête pour modifier une catégorie. id est un entier positif >= 1                             |
| DELETE | /categories/:id   | Requête pour supprimer une catégorie. id est un entier positif >= 1                          |

### Body attendu pour POST/UPDATE :
```
{
    "name": <string>,
    "color": <string, couleur en hexadecimal maximum 7 caractères>,
    "icon": <string, url vers icone>,
    "max_budget": <number, toujours supérieur à 0>,
    "user_id": <integer, propriétaire de la catégorie, ne jamais mettre pour UPDATE>
}
```

## Expenses

| Verbe  | Chemin          | Description                                                     |
|--------|-----------------|-----------------------------------------------------------------|
| GET    | /expenses/:id    | Requête pour récupérer une dépense                             |
| GET    | /expenses        | Requête pour récupérer toutes les dépenses                     |
| GET    | /expenses?limit=        | Requête pour récupérer un nombre fini de dépenses à inscrire après 'limit='                     |
| GET    | /expenses/by-month/:date | Requête pour récupérer les dépenses d'un mois. Le format de ':date' est 'AAAA-MM'                 |
| GET    | /expenses/by-category/:date | Requête pour récupérer les dépenses d'une catégorie. id est celui de la catégorie                |
| POST   | /expenses        | Requête pour ajouter une dépense                               |
| PATCH  | /expenses/:id    | Requête pour modifier une dépense. id est un entier positif >= 1                              |
| DELETE  | /expenses/:id    | Requête pour supprimer une dépense. id est un entier positif >= 1
| GET    | /expenses/total    | Requête pour récupérer le total des dépenses du mois en cours. (Stocker dans la clé 'total')
| GET    | /expenses/total/by-category/:id    | Requête pour récupérer le total des dépenses du mois en cours pour une catégorie en particulier. (Stocker dans la clé 'total')
### Body attendu pour POST/UPDATE :
```
{
    "title": <string>,
    "user_id": <integer, propriétaire de la dépense, ne jamais mettre pour UPDATE>,
    "category_id": <integer, catégorie de la dépense>,
    "amount": <number, toujours supérieur à 0>,
    "date": <string, date de la dépense récupérée via formulaire. format AAAA-MM-JJ>
}
```