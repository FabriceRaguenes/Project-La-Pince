import sequelize from "../database/sequelize-client.js";
import { Sequelize, Model, DataTypes } from "sequelize";

class Category extends Model {
  //methodes
}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: "#ff7d3d",
      allowNull: false,
      unique: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://placehold.co/32x32.png",
    },

    max_budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "categories" },
);

export default Category;
