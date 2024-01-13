import { promises as fs } from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }
    async getCarts() {
        try {
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            return carts;
        } catch (error) {
            console.error('Error: ', error);
            return [];
        }
    }

    async getCartById(cid){

        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const cart = carts.find(cart => cart.cid === cid)
        return cart
    }

    async addCart(cartData) {
        try {
            const carts = await this.getCarts();

            // Generar un ID único para el carrito
            const cid = this.generateId(carts);

            // Crear un nuevo carrito
            const newCart = {
                cid,
                products: cartData.products || []
            };

            carts.push(newCart);    
            await fs.writeFile(this.path, JSON.stringify(carts));
            return true;
           
        } catch (error) {
            console.error('Error: ', error);
            return false;
        }
    }

    generateId(carts) {

        if (carts.length === 0) {
            return 1;
        }
        const maxId = carts.reduce((max, cart) => (cart.cid > max ? cart.cid : max), 0);
        return maxId + 1;
        }
        
    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.cid === cartId);

            if (cartIndex === -1) {
                return false; // El carrito no existe
            }

            const existingProductIndex = carts[cartIndex].products.findIndex(product => product.pid === productId);

            if (existingProductIndex === -1) {
                // Agregar un nuevo producto al carrito
                carts[cartIndex].products.push({ pid: productId, quantity });
            } else {
                // Incrementar la cantidad del producto existente
                carts[cartIndex].products[existingProductIndex].quantity += quantity;
            }

            await fs.writeFile(this.path, JSON.stringify(carts));
            return true;
        } catch (error) {
            console.error('Error: ', error);
            return false;
        }
    }
}
