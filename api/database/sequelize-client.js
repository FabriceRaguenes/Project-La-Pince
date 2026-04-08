import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL,
	{
		define: {
			// Une convention pour que Sequelize ne mette pas les noms de table au pluriel
			freezeTableName: true,
			// Ajoute les colonnes createdAt et updatedAt à chaque table
			timestamps: true,
			// Utilise le snake_case pour les champs auto-générés (createdAt -> created_at)
			underscored: true,
		},
	}
);

// synchronize la BDD et reset la bdd
await sequelize.sync({ force: true });

export default sequelize;