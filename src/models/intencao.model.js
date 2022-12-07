import { Schema, model } from "mongoose";

const intencaoSchema = new Schema (
    {
        origemId: {
            type: Schema.Types.ObjectId,
            ref: 'Unidade',
            require:true
        },
        destinoId: {
            type: Schema.Types.ObjectId,
            ref:'Unidade',
            require: true
        },
        user: {
            type: Schema.Types.ObjectId,
            require:true
        }
    },
    {
        timestamps: true,   
    }
)

const IntencaoModel = model('Intencao', intencaoSchema);

export default IntencaoModel;