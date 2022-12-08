import express from "express";
import OrgaoModel from "../models/orgao.model.js"
import UnidadeModel from "../models/orgao.model.js"

const orgaoRoute = express.Router();

orgaoRoute.post('/create', async (req,res) => {

    try {
        const newOrgao = await OrgaoModel.create(req.body)
        
        return res.status(201).json(newOrgao);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

orgaoRoute.get('/', async (req,res) => {

    try {
        const allOrgaos = await OrgaoModel.find()
        
        return res.status(200).json(allOrgaos);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

orgaoRoute.get('/:id', async (req,res) => {

    try {

        const { id } = req.params;

        const orgao = await OrgaoModel.findById(id);
        
        return res.status(200).json(orgao);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

orgaoRoute.delete('/delete/:id', async (req,res) => {

    try {

        const { id } = req.params;

        const deletedorgao = await OrgaoModel.findByIdAndDelete(id);
        
        if (!deletedorgao) {
            return res.status(400).json({ msg: "Orgão não encontrado!" });
          }

        await UnidadeModel.deleteMany({ orgaoId: id });

        return res.status(200).json(deletedorgao);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

orgaoRoute.put('/update/:id', async (req,res) => {

    try {

        const { id } = req.params;

        const updatedOrgao = await OrgaoModel.findByIdAndUpdate(
            id,
            {...req.body},
            {new:true , runValidators:true});
        
        if (!updatedOrgao) {
            return res.status(400).json({ msg: "Orgão não encontrado!" });
          }


        return res.status(200).json(updatedOrgao);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.errors)
    }

})

export default orgaoRoute;