import HttpError from "../utils/HttpError.js";
import { User } from "../models/index.js";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

class AuthController {

    // TODO first : register and login
    // TODO after : get and logout + connecting auth system for Category/Expense

    register = async (req, res, next) => {

        try {
            const newUserJson = req.body;

            const hashedPassword = await argon2.hash(newUserJson.password);

            const result = await User.create({
                name: newUserJson.name,
                email: newUserJson.email,
                password: hashedPassword
            });

            if (!result){
                throw new HttpError("Bad Request", 400);
            }

            // Registering succeed
            // To connect the user right after, sending token to the client
            const newUser = await User.findOne({
                where: { email: newUserJson.email }
            });

            // sign() arguments : token payload, api secret, token expiration time
            const token = jwt.sign(
                { user_id: newUser.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            
            res.status(201).json({ token });
        }
        catch(error) {
            next(error);
        }
    }

    login = async (req, res, next) => {

        try {
            const loginJson = req.body;

            // Finding user by email
            const user = await User.findOne({
                where: {
                    email: loginJson.email
                }
            });

            // Never tells if email is incorrect
            if (!user){
                throw new HttpError("Email or password incorrect", 401);
            }

            // Checks if password is incorrect
            if (! await argon2.verify(user.password, loginJson.password)) {
                throw new HttpError("Email or password incorrect", 401);
            }

            // Email and password are correct, create token
            // sign() arguments : token payload, api secret, token expiration time
            const token = jwt.sign(
                { user_id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Sending token to the client
            res.status(200).json({ token });
        }
        catch(error) {
            next(error);
        }
    }

    getLoggedUser = async (req, res, next) => {
        try {
            // validateToken middleware gave the user id in req.user_id
            const userId = req.user_id;

            const user = await User.findOne({
                where: {
                    id: userId
                }
            });

            if(!user){
                throw new HttpError("Internal Server Error", 500);
            }

            res.status(200).json({
                user_id: userId,
                name: user.name
            });
        }
        catch(error) {
            next(error);
        }
    }

    logout = async (req, res, next) => {
        // To logout the client, send a new token but empty (and client delete the token)
        // It's not perfect because the token is still valid. (blocklist?)
        const token = "";
        res.status(200).json({ token });
    }
}

export default new AuthController();