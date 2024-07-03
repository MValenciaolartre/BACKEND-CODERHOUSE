import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public")); 

//Express-Handlebars
app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 

//rutas
app.use("/products", productsRouter);                  
app.use("/carts", cartsRouter);
app.use("/", viewsRouter)

app.get("/", (req, res) =>{
    res.render("home");
})


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

import ProductManager from "./controllers/product-manager.js";
const productManager = new ProductManager("./src/data/productos.json");

const io = new Server(httpServer); 


io.on("connection", async (socket) => {
    console.log("Cliente conectado"); 

    
    socket.emit("productos", await productManager.getProducts());

    
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

         
        io.sockets.emit("productos", await productManager.getProducts());
    })

    
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto); 
       
        io.sockets.emit("productos", await productManager.getProducts());
    })
});
