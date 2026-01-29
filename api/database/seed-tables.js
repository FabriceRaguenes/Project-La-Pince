// Import du client Sequelize configuré pour se connecter à la base de données
import sequelize from './sequelize-client.js';

// Import d'argon2,pour hasher les mots de passe de manière sécurisée
import argon2 from 'argon2';

// Import des modèles Sequelize (tables de la BDD)
import { Category, Expense, User } from '../models/index.js';

// Import des json pour seed la BDD
// L'assertion 'with { type: json }' est la syntaxe moderne pour importer du JSON
import data from './test-data.json' with { type: 'json' };

async function seed() {
    console.log("Syncing database...");

    try {
        // force: true va DROP les tables avant de les recréer. Pour le dev uniquement !
        // Utile en développement mais DANGEREUX en production car efface toutes les données
		await sequelize.sync({ force: true });

        // Extraction des données depuis le fichier JSON
        const users = data.users;
        const categories = data.categories;
        const expenses = data.expenses;

        // CRÉATION DES UTILISATEURS
        // Boucle sur chaque utilisateur du JSON
        for (let user of users) {
            // Hash du mot de passe avec argon2 pour la sécurité
            // Ne JAMAIS stocker les mots de passe en clair !

            const hash = await argon2.hash(user.password);

            // Création de l'utilisateur dans la BDD avec le mot de passe hashé
            await User.create({
                name: user.name,
                email: user.email,
                password: hash // Mot de passe hashé, pas en clair
            });
        }
        // CRÉATION DES CATÉGORIES
        // Boucle sur chaque catégorie du JSON
        for (let category of categories) {
            await Category.create(category);
        }

        // CRÉATION DES DÉPENSES
        // Boucle sur chaque dépense du JSON
        for (let expense of expenses) {
            await Expense.create(expense);
        }

        console.log('✅ Seeding complete!');
    }
    catch(error) {
        // Capture et affichage des erreurs éventuelles
        console.log("Error seeding DB", error);
    }
    finally {
        // Fermeture de la connexion à la base de données
        await sequelize.close();
    }
}
// Exécution de la fonction seed
await seed();