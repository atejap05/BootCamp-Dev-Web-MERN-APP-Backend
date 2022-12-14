import express from "express";
import IntencaoModel from "../models/intencao.model.js";
import isAuth from "../middlewares/isAuth.js";
import UserModel from "../models/user.model.js";
import sendMail from "../email/sendMail.js";
import UnidadeModel from "../models/unidade.model.js";

const IntencaoRouter = express.Router();

const populateIntencao = async (filter) => {
  return IntencaoModel.find(filter)
    .populate({
      path: "userId",
      select: { passwordHash: 0 },
      populate: { path: "unidadeId" },
    })
    .populate({
      path: "userId",
      select: { passwordHash: 0 },
      populate: { path: "orgaoId" },
    })
    .populate({ path: "origemId", populate: { path: "orgaoId" } })
    .populate({ path: "destinoId", populate: { path: "orgaoId" } });
};

IntencaoRouter.post("/create", isAuth, async (req, res) => {
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

    // Verifica se origem e destino são iguais
    if (req.body.origemId._id === req.body.destinoId) {
      return res.status(400).json({ msg: "Unidades de origem e destino não podem ser iguais."})
    }

    // Verifica se a intenção já existe
    const intencao = await IntencaoModel.findOne({
      userId: req.body.userId,
      destinoId: req.body.destinoId,
      origemId: req.body.origemId,
    });

    if (intencao) {
      return res.status(400).json({ msg: "Intenção duplicada" });
    }

    //Verificar como será passado o usuário logado e sua unidade
    const newIntencao = await IntencaoModel.create(req.body);

    //Envio de email confirmando a inclusao de nova intencao
    const user = await UserModel.findById(req.body.userId);
    const unidadeDestino = await UnidadeModel.findById(req.body.destinoId);

    const matchPermuta = await IntencaoModel.find({
      origemId: req.body.destinoId,
      destinoId: req.body.origemId,
    })
      .populate({ path: "userId", select: ["name", "email"] })
      .populate({ path: "origemId", select: "name" })
      .populate({ path: "destinoId", select: "name" });

    sendMail(user, unidadeDestino, matchPermuta);

    return res.status(201).json(newIntencao);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

IntencaoRouter.delete("/delete/:id", isAuth, async (req, res) => {
  try {
    /* 	#swagger.tags = ['Intencao']
                    #swagger.path = '/intencao/delete/{id}'
                    #swagger.description = 'Endpoint to delete an "intenção"'
                */
    const { id } = req.params;
    const deletedIntencao = await IntencaoModel.findByIdAndDelete(id);
    return res.status(200).json(deletedIntencao);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

IntencaoRouter.get("/all", isAuth, async (req, res) => {
  /* 	#swagger.tags = ['Intencao']
        #swagger.path = '/intencao/all'
        #swagger.description = 'Endpoint to get all"intenção"'
    */

  const filter = {};

  filter["orgaoId"] = req.query.orgaoId;

  if (req.query.origemId) filter["origemId"] = req.query.origemId;

  try {
    let allIntencoes = await populateIntencao(filter);

    if (req.query.state) {
      const state = req.query.state;
      allIntencoes = allIntencoes.filter(
        (i) => i["origemId"]["state"] === state
      );
    }

    return res.status(200).json(allIntencoes);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

IntencaoRouter.get("/byUser/:userId", async (req, res) => {
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
    const { userId } = req.params;
    //Verificar como o será passado o usuário logado e sua unidade
    const allIntencoes = await populateIntencao({ userId });
    return res.status(200).json(allIntencoes);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

IntencaoRouter.get("/:id", isAuth, async (req, res) => {
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
    const { id } = req.params;
    //Verificar como o será passado o usuário logado e sua unidade
    const allIntencoes = await IntencaoModel.findById(id);

    return res.status(200).json(allIntencoes);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

export default IntencaoRouter;
