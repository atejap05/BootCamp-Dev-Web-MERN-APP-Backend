import express from "express";
import UnidadeModel from "../models/unidade.model.js"
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const UnidadeRouter = express.Router();

UnidadeRouter.post('/create', isAuth, isAdmin, async (req, res) => {

    /* 	#swagger.tags = ['Unidade']
        #swagger.path = '/unidade/create'
        #swagger.description = 'Endpoint to include an "Unidade"'
    */

    /*	#swagger.parameters['body'] = {
        in: 'body',
        description: 'Unidade to be registered',
        required: true,
        schema: { $ref: "#/definitions/Unidade" }}
    */

    try {
        const newUnidade = await UnidadeModel.create(req.body)

        return res.status(201).json(newUnidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

UnidadeRouter.get('/', isAuth, async (req, res) => {

    /* 	#swagger.tags = ['Unidade']
        #swagger.path = '/unidade/'
        #swagger.description = 'Endpoint to get all "Unidade"'
    */

    try {
        const allUnidades = await UnidadeModel.find()
        return res.status(200).json(allUnidades);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

UnidadeRouter.get('/:id', isAuth, async (req, res) => {

    /* 	#swagger.tags = ['Unidade']
        #swagger.path = '/unidade/:id'
        #swagger.description = 'Endpoint to get a specific "Unidade"'
    */

    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Unidade ID.',
            required: true
        }
    */

    try {

        const {id} = req.params;

        const unidade = await UnidadeModel.findById(id).populate("orgaoId");

        return res.status(200).json(unidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

UnidadeRouter.delete('/delete/:id', isAuth, isAdmin, async (req, res) => {

    /* 	#swagger.tags = ['Unidade']
        #swagger.path = '/unidade/delete/:id'
        #swagger.description = 'Endpoint to get a specific "Unidade"'
    */

    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Unidade ID.',
            required: true
        }
    */

    try {

        const {id} = req.params;

        const deletedUnidade = await UnidadeModel.findByIdAndDelete(id);

        if (!deletedUnidade) {
            return res.status(400).json({msg: "Unidade não encontrada!"});
        }

        return res.status(200).json(deletedUnidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

UnidadeRouter.put('/update/:id', isAuth, isAdmin, async (req, res) => {

    /* 	#swagger.tags = ['Unidade']
        #swagger.path = '/unidade/delete/:id'
        #swagger.description = 'Endpoint to get a specific "Unidade"'
    */

    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Unidade ID.',
            required: true
        }
    */

    /*	#swagger.parameters['body'] = {
        in: 'body',
        description: 'Unidade to be deleted',
        required: true,
        schema: { $ref: "#/definitions/Unidade" }}
    */

    try {

        const {id} = req.params;

        const updatedUnidade = await UnidadeModel.findByIdAndUpdate(
            id,
            {...req.body},
            {new: true, runValidators: true});

        if (!updatedUnidade) {
            return res.status(400).json({msg: "Unidade não encontrada!"});
        }


        return res.status(200).json(updatedUnidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

export default UnidadeRouter;