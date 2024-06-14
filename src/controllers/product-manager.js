import { promises as fs } from "fs";

class ProductManager {
    static ultId = 0; // Variable estática para llevar el control del último ID usado

    constructor(path) {
        this.products = []; // Array para almacenar productos
        this.path = path; // Ruta al archivo JSON que actúa como base de datos
    }

    // Método para agregar un nuevo producto
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            // Leer la lista actual de productos de la base de datos
            const arrayProductos = await this.leerBaseDeDatos();

            // Verificar si se proporcionan todos los campos obligatorios
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            // Verificar si el código del producto es único
            if (arrayProductos.some(item => item.code === code)) {
                console.log("El código debe ser único");
                return;
            }

            // Crear un nuevo objeto de producto
            const newProduct = {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            };

            // Actualizar el último ID usado si hay productos existentes
            if (arrayProductos.length > 0) {
                ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            // Asignar un nuevo ID único al nuevo producto
            newProduct.id = ++ProductManager.ultId;

            // Agregar el nuevo producto al array
            arrayProductos.push(newProduct);

            // Guardar la lista actualizada de productos en la base de datos
            await this.guardarArchivo(arrayProductos);
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    // Método para obtener todos los productos
    async getProducts() {
        try {
            const arrayProductos = await this.leerBaseDeDatos();
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    // Método para obtener un producto por su ID
    async getProductById(id) {
        try {
            const arrayProductos = await this.leerBaseDeDatos();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    // Método auxiliar para leer el archivo de la base de datos
    async leerBaseDeDatos() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer un archivo", error);
            throw error;
        }
    }

    // Método auxiliar para escribir en el archivo de la base de datos
    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
            throw error;
        }
    }

    // Método para actualizar un producto por su ID
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerBaseDeDatos();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
                await this.guardarArchivo(arrayProductos);
                console.log("Producto actualizado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    // Método para eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerBaseDeDatos();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto eliminado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;
