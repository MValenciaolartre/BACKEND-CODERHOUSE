import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.carts = []; // Array para almacenar los carritos
        this.path = path; // Ruta al archivo JSON que actúa como base de datos
        this.ultId = 0; // Variable para llevar el control del último ID usado

        // Cargar los carritos desde el archivo al inicializar la instancia
        this.cargarCarritos();
    }

    // Método para cargar los carritos desde el archivo
    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            console.log(this.path + " es la ruta cart")
            this.carts = JSON.parse(data);

            // Actualizar el último ID usado si hay carritos existentes
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error);

            // Si no se puede leer el archivo, guardar un archivo vacío
            await this.guardarCarritos();
        }
    }     

    // Método para guardar los carritos en el archivo
    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    // Método para crear un nuevo carrito
    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        // Agregar el nuevo carrito al array
        this.carts.push(nuevoCarrito);

        // Guardar los carritos actualizados en el archivo
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    // Método para obtener un carrito por su ID
    async getCarritoById(cartId) {
        try {
            const carrito = this.carts.find(c => c.id === cartId);

            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    // Método para agregar un producto al carrito
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const carrito = await this.getCarritoById(cartId);
        const existeProducto = carrito.products.find(p => p.product === productId);

        // Si el producto ya existe en el carrito, actualizar la cantidad
        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            // Si el producto no existe en el carrito, agregarlo
            carrito.products.push({ product: productId, quantity });
        }

        // Guardar los carritos actualizados en el archivo
        await this.guardarCarritos();
        return carrito;
    }
}

export default CartManager;
