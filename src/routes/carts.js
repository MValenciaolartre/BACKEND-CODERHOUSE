import express from "express";
import CartManager from "../controllers/cart-manager.js";

const router = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito(); // Crear un nuevo carrito
        res.json(nuevoCarrito); // Enviar el nuevo carrito como respuesta
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" }); // Enviar un mensaje de error si ocurre un problema
    }
});

// Ruta para obtener los productos de un carrito por su ID
router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid); // Obtener el ID del carrito desde los parámetros de la ruta

    try {
        const carrito = await cartManager.getCarritoById(cartId); // Obtener el carrito por su ID
        res.json(carrito.products); // Enviar los productos del carrito como respuesta
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" }); // Enviar un mensaje de error si ocurre un problema
    }
});

// Ruta para agregar un producto a un carrito específico
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid); // Obtener el ID del carrito desde los parámetros de la ruta
    const productId = req.params.pid; // Obtener el ID del producto desde los parámetros de la ruta
    const quantity = req.body.quantity || 1; // Obtener la cantidad desde el cuerpo de la solicitud, o usar 1 por defecto

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity); // Agregar el producto al carrito
        res.json(actualizarCarrito.products); // Enviar los productos actualizados del carrito como respuesta
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" }); // Enviar un mensaje de error si ocurre un problema
    }
});

export default router;

