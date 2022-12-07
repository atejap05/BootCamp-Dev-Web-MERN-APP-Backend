import {Schema, model} from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: Number,
    required: true,
    match: /^\d{11}$/,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  },
  orgaoId: {
    type: Schema.Types.ObjectId,
    ref: 'Orgao',
    required: false,
  },
  unidadeId: {
    type: Schema.Types.ObjectId,
    ref: 'Unidade',
    required: false,
  },
  passwordHash: { 
    type: String, 
    required: true },
    match: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  isAdmin: {
    type: Boolean, 
    required: true,
    default: false 
  },
},
{
  timestamps: true,
}
);


const UserModel = model("User", userSchema);

export default UserModel;