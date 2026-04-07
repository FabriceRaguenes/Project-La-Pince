import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../utils/HttpError.js";

export function validateRegisterUser(req, res, next) {
  const passwordRegex =
    "(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*_-]).{8,30}";

  const registerUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp(passwordRegex)).required(),
  });

  const validation = registerUserSchema.validate(req.body);

  if (validation.error) {
    throw new HttpError(validation.error, 400);
  }

  next();
}

export function validateToken(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
      throw new HttpError("Authorization token missing or invalid", 401);
    }

    const token = bearerToken.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new HttpError("Authorization token missing or invalid", 401);
      }
      req.user_id = decoded.user_id;
    });

    next();
  } catch (error) {
    next(error);
  }
}
