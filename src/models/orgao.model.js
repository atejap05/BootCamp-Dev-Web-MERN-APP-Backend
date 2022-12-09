import {model, Schema} from "mongoose";

const orgaoSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true
        },
        sigla: {
            type: String,
            require: true,
        }
    },
    {
        timestamps: true,
    }
);

const OrgaoModel = model('Orgao', orgaoSchema);

export default OrgaoModel;