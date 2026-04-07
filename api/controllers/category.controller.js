import { Category, Expense } from '../models/index.js';
import HttpError from '../utils/HttpError.js';

class CategoryController {

    getAll = async (req, res, next) => {
        try {
            const userId = req.user_id;
            const categoryList = await Category.findAll({
                where: {
                    user_id: userId
                }
            });

            if (!categoryList){
                throw new HttpError("Server Error", 500);
            }

            res.status(200).json(categoryList);
        }
        catch(error){
            next(error);
        }
    }

    getById = async (req, res, next) => {
        try {
            const userId = req.user_id;
            const categoryId = req.params.id;
            const categoryList = await Category.findOne({
                where: {
                    id: categoryId,
                    user_id: userId
                }
            });

            if (!categoryList){
                throw new HttpError("Category Not Found", 404);
            }

            res.status(200).json(categoryList);
        }
        catch(error){
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            const userId = req.user_id;
            const categoryId = req.params.id;
            const nbElementsDestroyed = await Category.destroy({
                where: {
                    id: categoryId,
                    user_id: userId
                }
            });

            if (nbElementsDestroyed === 0){
                throw new HttpError("Category Not Found", 404);
            }

            res.status(204).end();
        }
        catch(error){
            next(error);
        }
    }

    create = async (req, res, next) => {
        try {
            const userId = req.user_id;
            const categoryToAdd = req.body;

            const result = await Category.create({
                user_id: userId,
                name: categoryToAdd.name,
                color: categoryToAdd.color,
                icon: categoryToAdd.icon,
                max_budget: categoryToAdd.max_budget
            });

            if (!result){
                throw new HttpError("Bad Request", 400);
            }

            res.status(201).json(result);
        }
        catch(error){
            next(error);
        }
    }

    update = async (req, res, next) => {
        try {
            const userId = req.user_id;
            const categoryId = req.params.id;
            const fieldToEdit = req.body;

            const result = await Category.update(fieldToEdit, {
                where: {
                    id: categoryId,
                    user_id: userId
                },
                returning: true
            });
            
            if (!result[1][0]){
                throw new HttpError("Category Not Found", 404);
            }

            res.status(200).json(result[1][0]);
        }
        catch(error){
            next(error);
        }
    }
}

export default new CategoryController();