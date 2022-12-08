import express from "express";
import IntencaoModel from "../models/intencao.model.js";
import isAuth from "../middlewares/isAuth.js";
import UserModel from "../models/user.model.js";
import UnidadeModel from "../models/unidade.model.js";

const IntencaoRouter = express.Router();

IntencaoRouter.post('/create', isAuth, async (req, res) => {
    /* 	#swagger.tags = ['Intencao']
        #swagger.path = '/intencao/create'
        #swagger.description = 'Endpoint to create an "intenção"'
    */

    /*	#swagger.parameters['body'] = {
        in: 'body',
        description: 'Intencao to be registered',
        required: true,
        schema: { $ref: "#/definitions/Intencao" }}
    */

    try {
        //Verificar como o será passado o usuário logado e sua unidade
        const newIntencao = await IntencaoModel.create(req.body)

        return res.status(201).json(newIntencao);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors);
    }
})

IntencaoRouter.delete('/delete', isAuth, async (req, res) => {

        /* 	#swagger.tags = ['Intencao']
            #swagger.path = '/intencao/delete'
            #swagger.description = 'Endpoint to delete an "intenção"'
        */


        try {
            const deletedIntencao = await IntencaoModel.findByIdAndDelete(req._id);
            return res.status(200).json(deletedIntencao);

        } catch (error) {
            console.log(error);
            return res.status(400).json(error.errors)
        }
    }
);

IntencaoRouter.get('/all', isAuth, async (req, res) => {

    /* 	#swagger.tags = ['Intencao']
        #swagger.path = '/intencao/all'
        #swagger.description = 'Endpoint to get all"intenção"'
    */

    try{

        const allIntencoes = await IntencaoModel.find()
        const userIds = allIntencoes.map(intent => intent.userId)
        const unidadesOrigemIds = allIntencoes.map(intent => intent.origemId)
        const unidadesDestinoIds = allIntencoes.map(intent => intent.destinoId)

        const users = await UserModel.find({ '_id': { $in: userIds } });
        const unidadesOrigem = await UnidadeModel.find({ '_id': { $in: unidadesOrigemIds } });
        const unidadesDestino = await UnidadeModel.find({ '_id': { $in: unidadesDestinoIds } });

        const populatedIntents = []

        allIntencoes.forEach(intent => {

            // Get user
            const user = users.find(user => user._id.toString() === intent.userId.toString())

            delete user['_doc'].passwordHash

            // get Unidade origem.
            const unidadeOrigem = unidadesOrigem.find(u => u._id.toString() === intent.origemId.toString())
            //console.log(unidadeOrigem)

            // get Unidade destino.
            const unidadeDestino = unidadesDestino.find(u => u._id.toString() === intent.destinoId.toString())
            //console.log(unidadeDestino)

            populatedIntents.push({
                unidadeOrigem,
                unidadeDestino,
                user
            })
        } )

        return res.status(200).json(populatedIntents)

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors)
    }
})


export default IntencaoRouter;