import sequelize from '../database/sequelize-client.js';
import { Sequelize, Model, DataTypes } from 'sequelize';

class User extends Model {
    // Méthodes ici
}

User.init({
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    },
    { sequelize, modelName: 'user'}
);

export default User;