import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { validateToken, validateRegisterUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/auth/register", validateRegisterUser, authController.register);

router.post("/auth/login", authController.login);
router.get("/auth/me", validateToken, authController.getLoggedUser);

router.post("/auth/logout", validateToken, authController.logout);


export default router;