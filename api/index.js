import express from "express";
import "dotenv/config";

import cors from "cors";

import categoryRouter from "./routes/category.router.js";
import expenseRouter from "./routes/expense.router.js";
import authRouter from "./routes/auth.router.js";

import { validateToken } from './middlewares/auth.middleware.js';
import { handleError } from './middlewares/common.middleware.js';

const app = express();

// Here CORS is enable for Frontend port. If cors() is called with no argument, CORS is enabled for all origin
app.use(cors());
// To use json in request body
app.use(express.json()); 

app.use(authRouter);
// Auth system, validateToken put user_id in the request if token is valid
app.use(validateToken);
app.use(categoryRouter);
app.use(expenseRouter);

app.use(handleError);

const port = process.env.PORT;
const base_url = process.env.BASE_URL;
app.listen(port, () => {
  console.log(`Server Listening on ${base_url}:${port}`);
});