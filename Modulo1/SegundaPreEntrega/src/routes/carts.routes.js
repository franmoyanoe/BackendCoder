import {Router} from "express"
import CartManager from "../dao/MongoDB/cartManagerMongo.js"
import ProductManager from "../dao/MongoDB/productManagerMongo.js"

const cartManager = new CartManager()
const productManager = new ProductManager()
 
const cartRouter =Router()

cartRouter.get("/carts",async(req,res)=>{
   const carrito=await cartManager.getCarts()
   res.json({carrito})
})

cartRouter.get("/carts/:cid",async(req,res)=>{
    const carritofound=await cartManager.getCartbyId(req.params)
    res.json({status:"success",carritofound})
})



cartRouter.post('/carts', async (req, res) => {
  try {
      const { obj } = req.body;

      if (!Array.isArray(obj)) {
          return res.status(400).send('Invalid request: products must be an array');
      }

      const validProducts = [];

      for (const product of obj) {
          const checkId = await productManager.getProductById(product._id);
          if (checkId === null) {
              return res.status(404).send(`Product with id ${product._id} not found`);
          }
          validProducts.push(checkId);
      }

      const cart = await cartManager.addCart(validProducts);
      res.status(200).send(cart);

  } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
});
cartRouter.post("/carts/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const checkIdProduct = await productManager.getProductById(pid);
      if (!checkIdProduct) {
        return res.status(404).send({ message: `Product with ID: ${pid} not found` });
      }
  
      const checkIdCart = await cartManager.getCartById(cid);
      if (!checkIdCart) {
        return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
      }
  
      const result = await cartManager.addProductInCart(cid, { _id: pid, quantity:quantity });
      console.log(result);
      return res.status(200).send({
        message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
        cart: result,
      });
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).send({ message: "An error occurred while processing the request" });
    }
  });

  export default cartRouter
/*
import { Router } from "express";
import cartModel from "../dao/models/carts.models.js";

const cartRouter = Router()
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            cart.products.push({ id_prod: pid, quantity: quantity })
            const respuesta = await cartModel.findByIdAndUpdate(cid, cart) //Actualizo el carrito de mi BDD con el nuevo producto
            res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
        }
    } catch (e) {
        res.status(400).send({ error: e })
    }
})

export default cartRouter
*/