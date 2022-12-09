import express from "express";
import StateModel from "../models/state.model.js";
import isAuth from "../middlewares/isAuth.js";


const stateRouter = express.Router();

stateRouter.post('/create', isAuth, async (req, res) => {

    try {

        const newState = await StateModel.create(req.body)

        return res.status(201).json(newState);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors);
    }
})

stateRouter.get('/all', isAuth, async (req, res) => {

    try {

        const estados = await StateModel.find().sort({nome: 1});

        /* #swagger.responses[200] = {
           description: "Returns an array of users" }
        */
        return res.status(200).json(estados);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors);
    }
})


export default stateRouter