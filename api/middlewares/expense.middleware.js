import Joi from 'joi';
import HttpError from '../utils/HttpError.js';

export function validateCreateExpense (req, res, next){

    const regexDate = /^\d{4}-\d{2}-\d{2}$/

    const createExpenseSchema = Joi.object ({
         title : Joi.string().required(),
         amount : Joi.number().positive().required(),
         date : Joi.string().pattern(new RegExp(regexDate)).required(),
         user_id : Joi.number().min(1).required(),
         category_id : Joi.number().min(1)// categorie pas obligatoire au moment de la creation une depense peut etre nue de categories


    });

        const validation = createExpenseSchema.validate(req.body)

        if(validation.error){
            throw new HttpError(validation.error, 400);
        }
    next();
}

export function validateUpdateExpense (req, res, next){
    const regexDate = /^\d{4}-\d{2}-\d{2}$/
    const updateExpenseSchema = Joi.object ({
         title : Joi.string(),
         amount : Joi.number().positive(),
         date : Joi.string().pattern(new RegExp(regexDate)),
         user_id : Joi.number().min(1),
         category_id : Joi.number().min(1)

    }).min(1) // au moins un champs requis a voir si on maintient

        const validation = updateExpenseSchema.validate(req.body)

        if(validation.error){
            throw new HttpError(validation.error, 400);
        }

    next();
    
}