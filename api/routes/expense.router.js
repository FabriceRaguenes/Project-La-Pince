import { Router } from "express";
import expenseController from "../controllers/expense.controller.js";
import { validateDate } from "../middlewares/common.middleware.js";
import { validateId } from '../middlewares/common.middleware.js';
import { validateCreateExpense, validateUpdateExpense } from '../middlewares/expense.middleware.js';

const router = Router();

router.get("/expenses", expenseController.getAll);
router.get("/expenses/:id", validateId, expenseController.getById);

router.get("/expenses/total", expenseController.getTotalAmount);
router.get("/expenses/total/by-category/:id", validateId, expenseController.getTotalAmountByCategory);

router.get("/expenses/by-month/:date", validateDate, expenseController.getAllByMonth);
router.get("/expenses/by-category/:id", validateId, expenseController.getAllByCategory);
router.post("/expenses", validateCreateExpense, expenseController.create);
router.patch("/expenses/:id", validateId, validateUpdateExpense, expenseController.update);
router.delete("/expenses/:id", expenseController.delete);

export default router;

