import express from "express";
import IntencaoModel from "../models/intencao.model.js";
import isAuth from "../middlewares/isAuth.js";
import UserModel from "../models/user.model.js";

const IntencaoRouter = express.Router();

IntencaoRouter.post('/create', isAuth, async (req, res) => {
    /* 	#swagger.tags = ['Intencao']
        #swagger.path = '/intencao/create'
        #swagger.description = 'Endpoint to create an "intenção"'
    */

    /*	#swagger.parameters['body'] = {
        in: 'body',
        description: 'Intecao to be registered',
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
        const ids = allIntencoes.map(intent => intent.userId)
        const users = await UserModel.find({ '_id': { $in: ids } });

        const populatedIntents = [

        ]

        allIntencoes.forEach(intent => {
            const user = users.find(user => {
                return user._id.toString() === intent.userId.toString()
            })

            delete user['_doc'].passwordHash

            populatedIntents.push({
                origemId: intent.origemId,
                destinoId: intent.destinoId,
                user
            })
        } )

        return res.status(200).json(populatedIntents)

    } catch (error) {

    }
})


export default IntencaoRouter;