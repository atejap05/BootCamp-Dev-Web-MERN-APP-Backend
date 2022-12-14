import express from 'express'
import * as dotenv from 'dotenv'
import dbConnect from './config/db.config.js'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import orgaoRouter from './routes/orgao.routes.js'
import UnidadeRouter from './routes/unidade.routes.js'
import intencaoRouter from "./routes/intencao.routes.js"
import stateRouter from "./routes/state.routes.js"
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json' assert { type : "json"}


//habilitar o servidor a ter variáveis de ambiente
dotenv.config()

dbConnect()

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express()

app.use(cors({origin: process.env.REACT_URL}))
app.use(express.json())

// rotas
app.use('/user', userRouter)

app.use('/intencao', intencaoRouter)
app.use('/orgao', orgaoRouter)
app.use('/unidade', UnidadeRouter)
app.use('/state', stateRouter)
app.use('/doc', swaggerUi.serve)
app.get('/doc', swaggerUi.setup(swaggerFile))

app.listen(Number(process.env.PORT),
    () => console.log(`server on port ${process.env.PORT}!'`))