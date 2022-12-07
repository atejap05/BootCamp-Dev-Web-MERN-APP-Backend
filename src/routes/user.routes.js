import express from "express";
import UserModel from '../models/user.model.js'
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";

const userRoute = express.Router();
const saltRounds = 10;

userRoute.post('/sign-up', async (req, res) => {
    try {

        const {password} = req.body;
        if (!password || !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/)) {
            return res.status(400).json({msg: "Senha não tem os requisitos mínimos de segurança"});
        }
        // generate salt
        const salt = await bcrypt.genSalt(saltRounds); //10

        // create hashed password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password.
        const newUser = await UserModel.create({...req.body, passwordHash: hashedPassword,});

        // Remove passwordHash property from object.
        delete newUser['_doc'].passwordHash;

        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }
})


export default userRoute