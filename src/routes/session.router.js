import { Router } from "express";
const router = Router();
import UsuarioModel from "../models/usuarios.model.js";
import { createHash, isValidPassword } from "../util/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";

//Ruta de registro: 

router.post("/register", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        //Verificamos si el usuario ya existe. 
        const existeUsuario = await UsuarioModel.findOne({ usuario });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        //Creamos el nuevo usuario: 
        const nuevoUsuario = new UsuarioModel({
            usuario,
            password: createHash(password)
        })

        //Lo guardamos: 
        await nuevoUsuario.save();

        //Generar el token de JWT: 
        const token = jwt.sign({ usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol }, "coderhouse", { expiresIn: "1h" });

        //Generamos la cookie: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, //1 hora de vida
            httpOnly: true //recuerdo que esto es para que solo sea accesible mediante peticiones http. 
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor, nos vamos a moriiiiir");
    }
})

//Login

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        //Buscamos el usuario en MongoDB: 
        const usuarioEncontrado = await UsuarioModel.findOne({ usuario });

        //Verificamos si el usuario existe
        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no valido");
        }

        //Verificamos la contraseña
        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Password malvado");
        }

        //Generar el token de JWT: 
        const token = jwt.sign({ usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol }, "coderhouse", { expiresIn: "1h" });

        //Generamos la cookie: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, //1 hora de vida
            httpOnly: true //recuerdo que esto es para que solo sea accesible mediante peticiones http. 
        })

        res.redirect("/api/sessions/current");


    } catch (error) {
        res.status(500).send("Error interno del servidor, nos vamos a moriiiiir");
    }
})


//Ruta Current: 

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        //Renderizamos una vista especial "home" con la info del usuario: 
        res.render("home", { usuario: req.user.usuario });
    } else {
        //Si no hay un usuario asociado tiremos un error: 
        res.status(401).send("No autorizado");
    }
})

//Logout

router.post("/logout", (req, res) => {
    //Limpiar la cookie del toquen
    res.clearCookie("coderCookieToken");
    //Redirigir al login
    res.redirect("/login"); 
})


//Ruta exclusiva para admins: 

router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado, vete ladron de gallinas!"); 
    } 
    res.render("admin"); 
})




export default router; 