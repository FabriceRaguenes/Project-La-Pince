import User from './User.js';
import Expense from './Expense.js';
import Category from './Category.js';

User.hasMany(Category,
    {
        foreignKey: 'user_id',
        as: 'categories',
        onDelete: 'CASCADE' 
    }
);

Category.belongsTo(User,
    {
        foreignKey: 'user_id',
        as: 'user'
    }
);

User.hasMany(Expense,
    {
        foreignKey: 'user_id',
        as: 'expenses',
        onDelete: 'CASCADE'
    }
);

Expense.belongsTo(User,
    {
        foreignKey: 'user_id',
        as: 'user'
    }
);


Category.hasMany(Expense,
    {
        foreignKey: 'category_id',
        as: 'expenses',
    }
);

Expense.belongsTo(Category,
    {
        foreignKey: 'category_id',
        as: 'category',   
    }
);

export { Category, Expense, User };