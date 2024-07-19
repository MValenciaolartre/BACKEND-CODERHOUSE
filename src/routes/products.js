import express from "express";
const router = express.Router();

import ProductManager from "../dao/fs/product-manager.js";
const productManager = new ProductManager("./src/data/productos.json");

// Ruta para obtener todos los productos, con opción de limitar el número de resultados
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit; // Obtener el parámetro de límite desde la consulta
        const productos = await productManager.getProducts(); // Obtener todos los productos
        if (limit) {
            res.json(productos.slice(0, limit)); // Si hay un límite, devolver solo los primeros 'limit' productos
        } else {
            res.json(productos); // Si no hay límite, devolver todos los productos
        }
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor" // Enviar un mensaje de error si ocurre un problema
        });
    }
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid; // Obtener el ID del producto desde los parámetros de la ruta

    try {
        const producto = await productManager.getProductById(parseInt(id)); // Obtener el producto por su ID
        if (!producto) {
            return res.json({
                error: "Producto no encontrado" // Enviar un mensaje si el producto no se encuentra
            });
        }

        res.json(producto); // Enviar el producto encontrado como respuesta
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor" // Enviar un mensaje de error si ocurre un problema
        });
    }
});

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body; // Obtener los datos del nuevo producto desde el cuerpo de la solicitud

    try {
        await productManager.addProduct(nuevoProducto); // Agregar el nuevo producto
        res.status(201).json({
            message: "Producto agregado exitosamente" // Enviar un mensaje de éxito
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor" // Enviar un mensaje de error si ocurre un problema
        });
    }
});

// Ruta para actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid; // Obtener el ID del producto desde los parámetros de la ruta
    const productoActualizado = req.body; // Obtener los datos actualizados del producto desde el cuerpo de la solicitud

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado); // Actualizar el producto
        res.json({
            message: "Producto actualizado exitosamente" // Enviar un mensaje de éxito
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor" // Enviar un mensaje de error si ocurre un problema
        });
    }
});

// Ruta para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid; // Obtener el ID del producto desde los parámetros de la ruta

    try {
        await productManager.deleteProduct(parseInt(id)); // Eliminar el producto
        res.json({
            message: "Producto eliminado exitosamente" // Enviar un mensaje de éxito
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor" // Enviar un mensaje de error si ocurre un problema
        });
    }
});

export default router;
