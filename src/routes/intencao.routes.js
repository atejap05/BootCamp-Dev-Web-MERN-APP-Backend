import express from "express";
import nodemailer from "nodemailer";
import IntencaoModel from "../models/intencao.model.js";
import isAuth from "../middlewares/isAuth.js";
import UserModel from "../models/user.model.js";
import OrgaoModel from "../models/orgao.model.js";

const IntencaoRouter = express.Router();

const transporter = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
        secure: false,
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const populateIntencao = async (filter) => {


    return IntencaoModel.find(filter)
        .populate({path: "userId", select: {passwordHash: 0}, populate: {path: "unidadeId"}})
        .populate({path: "userId", select: {passwordHash: 0}, populate: {path: "orgaoId"}})
        .populate({path: "origemId", populate: {path: "orgaoId"}})
        .populate({path: "destinoId", populate: {path: "orgaoId"}})

}

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

        //Envio de email confirmando a inclusao de nova intencao
        const user = await UserModel.findById(req.body.userId)
        
        const matchPermuta = await IntencaoModel
            .find({
                origemId: req.body.destinoId,
                destinoId: req.body.origemId
            })
            .populate({path: 'userId', select: ['name', 'email']})
            .populate({path: 'origemId', select: 'name'})
            .populate({path: 'destinoId', select: 'name'})

        if (matchPermuta.length === 0) {
            const message =
                `No momento, não consta em nossa base de dados intenção de remoção que viabilize a permuta.
                Caso seja incluída intenção que a viabilize, você será comunicado.`
                console.log(message);
        } else {
            matchPermuta.forEach((match)=>{
                const messageCurrentUser =
                    `${user.name},
                    Consta da nossa base da dados que o servidor ${match.userId.name}
                    está lotado no(a) ${match.origemId.name} e 
                    tem interesse de remover-se para ${match.destinoId.name}.
                    Seu e-mail para contato é ${match.userId.email}.`
                console.log(messageCurrentUser);
                // const mailOptions = {
                //     from: process.env.EMAIL,
                //     to: user.email,
                //     subject: "Inclusão de intenção de permuta confirmada",
                //     txt: messageCurrentUser
                // };
                // await transporter.sendMail(mailOptions);

                const messageMatchedUser =
                    `${match.userId.name},
                    O sevidor ${user.name} registrou interesse em remover-se do(a) ${match.origemId.name}
                    para ${match.origemId.name}.
                    Seu e-mail para contato é ${user.email}.`
                console.log(messageMatchedUser);
                // const mailOptions = {
                //     from: process.env.EMAIL,
                //     to: match.userId.name,
                //     subject: "Inclusão de intenção de permuta confirmada",
                //     txt: messageCurrentUser
                // };
                // await transporter.sendMail(mailOptions);
            });
        }
        
        return res.status(201).json(newIntencao);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors);
    }
});

IntencaoRouter.delete('/delete/:id', isAuth, async (req, res) => {
        try {
            /* 	#swagger.tags = ['Intencao']
                    #swagger.path = '/intencao/delete'
                    #swagger.description = 'Endpoint to delete an "intenção"'
                */
            const {id} = req.params;
            const deletedIntencao = await IntencaoModel.findByIdAndDelete(id);
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

    const filter = {}

    if (req.query.destinoId) filter['destinoId'] = req.query.destinoId

    try {

        let allIntencoes = await populateIntencao(filter);

        if (req.query.state) {
            const state = req.query.state
            allIntencoes = allIntencoes.filter(i => i['origemId']['state'] === state || i['destinoId']['state'] === state)
        }

        return res.status(200).json(allIntencoes)

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors)
    }
});

IntencaoRouter.get('/byUser/:userId', async (req, res) => {

    /* 	#swagger.tags = ['Intencao']
        #swagger.path = '/intencao/byUser/{userId}'
        #swagger.description = 'Endpoint to get all "intenção" per user'
    */

    /*  #swagger.parameters['userId'] = {
            in: 'path',
            description: 'User ID.',
            required: true
        }
    */

    try {
        const {userId} = req.params;
        //Verificar como o será passado o usuário logado e sua unidade
        const allIntencoes = await populateIntencao({userId})
        return res.status(200).json(allIntencoes)

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors);
    }
});

IntencaoRouter.get('/:id', isAuth, async (req, res) => {

    /* 	#swagger.tags = ['Intencao']
        #swagger.path = '/intencao/{id}'
        #swagger.description = 'Endpoint to get a "intenção" by id'
    */

    /*  #swagger.parameters['id'] = {
        in: 'path',
        description: 'Intecao ID.',
        required: true
    }
*/

    try {
        const {id} = req.params;
        //Verificar como o será passado o usuário logado e sua unidade
        const allIntencoes = await IntencaoModel.findById(id)

        return res.status(200).json(allIntencoes);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.errors);
    }
});

export default IntencaoRouter;