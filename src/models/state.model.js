import {model, Schema} from "mongoose";

const stateSchema = new Schema(
    {
        nome: {
            type: String,
            require: true,
            unique: true
        },
        sigla: {
            type: String,
            require: true,
            unique: true
        }
    },
    {
        timestamps: true,
    }
);

const StateModel = model('State', stateSchema);

export default StateModel;