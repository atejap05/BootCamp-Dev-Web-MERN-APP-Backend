import { Schema, model} from mongoose;

const unidadeSchema = new Schema (
    {
    name: {
        type: String,
        require: true
    },
    sigla: {
        type: String,
        require: true
    },
    orgaoId: {
        type: Schema.Types.ObjectId,
        require:true
    },
    state: {
        type: String,
        require: true,
        minLength: 2,
        maxLength: 2
    },
    city: {
        type: String,
        require:true
    }
    },
    {
        timestamps: true,  
    }
);

const UnidadeModel = model('Unidade',unidadeSchema);

export default UnidadeModel;