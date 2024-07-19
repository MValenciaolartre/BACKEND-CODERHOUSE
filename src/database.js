//conexion con mongoose 
import mongoose from "mongoose";

mongoose.connect()
.then(() => console.log("conectado exitosamente!"))
.catch((error) => console.log ("existe un error", error ))
