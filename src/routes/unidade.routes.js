import express from "express";
import UnidadeModel from "../models/unidade.model.js"

const unidadeRoute = express.Router();

unidadeRoute.post('/create', async (req,res) => {

    try {
        const newUnidade = await UnidadeModel.create(req.body)
        
        return res.status(201).json(newUnidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

unidadeRoute.get('/', async (req,res) => {

    try {
        const allUnidades = await UnidadeModel.find()
        
        return res.status(200).json(allUnidades);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

unidadeRoute.get('/:id', async (req,res) => {

    try {

        const { id } = req.params;

        const unidade = await UnidadeModel.findById(id).populate("orgaoId");
        
        return res.status(200).json(unidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

unidadeRoute.delete('/delete/:id', async (req,res) => {

    try {

        const { id } = req.params;

        const deletedUnidade = await UnidadeModel.findByIdAndDelete(id);
        
        if (!deletedUnidade) {
            return res.status(400).json({ msg: "Unidade não encontrada!" });
          }

        return res.status(200).json(deletedUnidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

unidadeRoute.put('/update/:id', async (req,res) => {

    try {

        const { id } = req.params;

        const updatedUnidade = await UnidadeModel.findByIdAndUpdate(
            id,
            {...req.body},
            {new:true , runValidators:true});
        
        if (!updatedUnidade) {
            return res.status(400).json({ msg: "Unidade não encontrada!" });
          }


        return res.status(200).json(updatedUnidade);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

export default unidadeRoute;