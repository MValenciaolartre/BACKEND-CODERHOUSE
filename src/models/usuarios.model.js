import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    usuario: String,
    password: String, 
    rol: {
        type: String,
        enum: ["admin", "user"], //Aca enumeramos los roles permitidos
        default: "user"
    }
})

const UsuarioModel = mongoose.model("usuarios", usuarioSchema); 

export default UsuarioModel; 