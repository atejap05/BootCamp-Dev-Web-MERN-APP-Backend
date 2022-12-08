import express from "express";
import UserModel from '../models/user.model.js'
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

const userRouter = express.Router();
const saltRounds = 10;

const getUser = async (req) => {
    const {email} = req.body;
    return UserModel.findOne({email: email});

}

userRouter.post('/sign-up', async (req, res) => {
    /* 	#swagger.tags = ['User']
        #swagger.description = 'Endpoint to sign up a specific user'
    */

    /*	#swagger.parameters['body'] = {
        in: 'body',
        description: 'User to be registered',
        required: true,
        schema: { $ref: "#/definitions/RegisterUser" }}
    */


    try {

        const user = await getUser(req)

        if (user) {
            /* #swagger.responses[409] = {
               description: "User already registered." }
            */
            return res.status(409).json({msg: "e-mail já cadastrado"})
        }

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

        /* #swagger.responses[201] = {
           schema: { "$ref": "#/definitions/User" },
           description: "User registered successfully." }
        */
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        /* #swagger.responses[500] = {
           description: "Registration error." }
        */
        return res.status(500).json(error.errors);
    }
})

userRouter.post('/login', async (req, res) => {
    /* 	#swagger.tags = ['User']
        #swagger.description = 'Endpoint to sign in a specific user'
    */

    /*	#swagger.parameters['body'] = {
        in: 'body',
        description: 'Email and password from user',
        required: true,
        schema: { $ref: "#/definitions/SignIn" }}
    */

    try {
        const user = await getUser(req)

        if (!user) {
            return res.status(400).json({msg: "e-mail não cadastrado"})
        }

        const {password} = req.body;

        if (await bcrypt.compare(password, user['passwordHash'])) {
            delete user['_doc'].passwordHash
            const token = generateToken(user)

            /* #swagger.responses[200] = {
               schema: { "$ref": "#/definitions/LoggedUser" },
               description: "User signed in successfully." }
            */
            return res.status(200).json({
                user: {...user['_doc']},
                token: token
            })
        } else {
            return res.status(401).json({msg: 'senha e e-mail não está correta'})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'algo deu errado no login'})
    }
})

export default userRouter