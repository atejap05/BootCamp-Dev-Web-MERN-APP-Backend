import express from 'express'
import * as dotenv from 'dotenv'
import dbConnect from './config/db.config.js'
import cors from 'cors'
import userRouter from './routes/user.routes.js'

//habilitar o servidor a ter variáveis de ambiente
dotenv.config()

dbConnect()

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express()

app.use(cors( { origin: process.env.REACT_URL } ))
app.use(express.json())

// rotas
app.use('/user', userRouter)

app.listen(Number(process.env.PORT),
    () => console.log(`server on port ${process.env.PORT}!'`))