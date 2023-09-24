import { Router } from 'express';
// Importa tu manejador de carrito
//import { CartManager } from './CartManager.js'; 
import CartManager from '../dao/fileSystem/controllers/CartManager.js';


const cartManager = new CartManager('src/models/carrito.txt');
const routerCart = Router();

// Agrega las rutas para el carrito aquí
routerCart.get('/', async (req, res) => {
    // Obtener los productos en el carrito y responder con ellos
    const { limit } = req.query

    const cart = await cartManager.getCarts()
    const newCart = cart.slice(0, limit)
    res.status(200).send(newCart)

});

routerCart.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await cartManager.getCartById(parseInt(cid))

    if (cart)
        res.status(200).send(cart)
    else
        res.status(404).send("Carrito no existente")
})

routerCart.post('/', async (req, res) => {
    // Agregar un producto al carrito y responder con la confirmación
    const cartData = req.body;

    const confirmacion = await cartManager.addCart(cartData);

    if (confirmacion) {
        res.status(201).send('Nuevo carrito agregado');
    } else {
        res.status(401).send('Error al agregar o carrito existente');
    }

});
/* Ejemplo de Body
{
    "products": [
        {
            "pid": 4,
            "quantity": 3
        },
        {
            "pid": 6,
            "quantity": 3
        }
    ]
}
*/

routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid); // Convertir a número entero
    const productId = parseInt(req.params.pid); // Convertir a número entero
    const quantity = req.body.quantity || 1;

    const confirmation = await cartManager.addProductToCart(cartId, productId, quantity);

    if (confirmation) {
        res.status(201).send('Producto agregado correctamente');
    } else {
        res.status(401).send('Error al agregar el producto');
    }
});

/*Ejemplo de body
    {

                "quantity": 4

    }
*/

export default routerCart;
