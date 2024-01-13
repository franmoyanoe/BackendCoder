import {Router} from "express"
import CartManager from "../dao/controllers/cartManagerMongo.js"

const cartManager = new CartManager()

const cartRouter =Router()

//Ingresar productos al carrito
//http://localhost:8080/api/carts/65097c3f37f26ab23f26bbe9/products/64ff5a2372f96517bfb33089
/*
    {
    "quantity": 500
    }
*/
cartRouter.post("/:cid/products/:pid", async (req, res) => {

  const { cid, pid } = req.params; 
  const quantity = req.body.quantity;
      try {
      const addNewProductCart = await cartManager.addProductCart(cid,pid,quantity)
      if(typeof addNewProductCart != "string" ){
        res.status(200).send({ resultado: 'Se agrego un producto al carrito', message: addNewProductCart })
      }else{
        res.status(404).send({ error: `Error!`, message:addNewProductCart })  
      }
       }catch(error){
        console.error("Error en cartRouter post:", error);
        res.status(500).send({ error: "Error interno del servidor" });
       }
  })
//Ingresar un carrito
//http://localhost:8080/api/carts
cartRouter.post("/",async(req,res)=>{
  try {
    const addNewCart = await cartManager.addCart()
    if(addNewCart){
      res.status(200).send({ resultado: 'Se agrego un carrito', message: addNewCart })
    }else{
      res.status(404).send({ error: `don't create cart!` })  
    }
  } catch (error) {
    console.error("Error en cartRouter post:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
})
  
//eliminar del carrito el producto seleccionado
//http://localhost:8080/api/carts/65097c3f37f26ab23f26bbe9/products/64ff5a2372f96517bfb33089
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const {cid,pid}=req.params
    try {
      const deleteProduct = await cartManager.deleteProductCart(cid,pid)
      if (typeof deleteProduct != "string") {
        res.status(200).send({ resultado: 'Se eliminó el producto del carrito', message: deleteProduct });
        } else {
        res.status(404).send({ resultado:"Error",menssage: deleteProduct });
        } 
    } catch (error) {
      console.error("Error en cartRouter delete:", error);
      res.status(500).send({ error: "Error interno del servidor" });
    }
})

//Eliminar todos los productos del carrito
//http://localhost:8080/api/carts/65097c3f37f26ab23f26bbe9
cartRouter.delete("/:cid",async(req,res) =>{

  const {cid} = req.params
  try{
  const deleteCartProducts = await cartManager.deleteCartAllProducts(cid)
  if(typeof deleteCartProducts != "string"){
      res.status(200).send({ resultado: 'Se elimino todos los productos del carrito', message: deleteCartProducts })
  }else{
     res.status(404).send({ error: `Error`,menssage: deleteCartProducts })  
  }
}catch(error){
  console.error("Error en cartRouter delete:", error);
  res.status(500).send({ error: "Error interno del servidor" });
}
})

//Actualizar el carrito con un arreglo
/*
[
    {
    "id_prod":"6500bf9e34e96498a13e600a",
    "quantity": 1000  
    },
    {
    "id_prod":"64ff592a72f96517bfb33087",
    "quantity": 100  
    }
]
*/
cartRouter.put("/:cid", async (req, res) =>{
     
    const {cid}= req.params
    const updateCart = req.body
 
    try{
    const updateCartProducts = await cartManager.updateCartAll(cid,updateCart)
    if(typeof updateCartProducts != "string"){
      res.status(200).send({ resultado: 'Se actualizo el carrito', message: updateCartProducts })
    }else{
      res.status(404).send({ error: `Error`,message: updateCartProducts })  
    }
     }catch(error){
      console.error("Error en cartRouter put:", error);
      res.status(500).send({ error: "Error interno del servidor" });
     }
})


//Actualizar la cantidad del carrito
//http://localhost:8080/api/carts/65097c3f37f26ab23f26bbe9/products/64ff5a2372f96517bfb33089
/*
{
    "quantity": 1000
}
*/
cartRouter.put("/:cid/products/:pid",async (req, res) => {
  const { cid, pid } = req.params;
	const { quantity } = req.body;

  try{
    const updateProduct = await cartManager.updateCartOneProduct(cid,pid, quantity)
    if( typeof updateProduct != "string"){
      res.status(200).send({ resultado: 'Se actualizo el carrito', message: updateProduct })
    }else{
      res.status(404).send({ error: `Error`, message: updateProduct })  
    }
     }catch(error){
      console.error("Error en cartRouter put:", error);
      res.status(500).send({ error: "Error interno del servidor" });
     }
})

//Mostrar todos los productos del carrito
//http://localhost:8080/api/carts/65097c3f37f26ab23f26bbe9
cartRouter.get("/:cid",async(req,res)=>{
  const {cid} = req.params
  try {
    const showCart = await cartManager.showProductCar(cid)
  if(typeof showCart != "string"){
    res.status(200).send({ resultado: 'Ok', message: showCart })
  }else{
    res.status(404).send({ error: `Error`, message: showCart })  
  }
   }catch(error){
    console.error("Error en cartRouter get:", error);
    res.status(500).send({ error: "Error interno del servidor" });
   }
})

//Mostrar Carritos
//http://localhost:8080/api/carts/
cartRouter.get("/",async(req,res)=>{
  try {
    const showAllCarts = await cartManager.showAllCarts()
    if(typeof showAllCarts != "string"){
      res.status(200).send({ resultado: 'Ok', message: showAllCarts })
    }else{
      res.status(404).send({ error: `Not found carts`,message: showAllCarts })  
    }
  } catch (error) {
    console.error("Error en cartRouter get:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
})

export default cartRouter
