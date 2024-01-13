import cartModel from "../models/carts.models.js";
import {productsModel} from "../models/products.models.js"
import { userModel } from "../models/users.models.js";
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';


export const getCarts = async (req, res) => {
    try {
        const showAllCarts = await cartModel.find();
        if(showAllCarts){
          res.status(200).send({ resultado: 'Ok..All carts', message: showAllCarts })
        }else{
          res.status(404).send({ error: `Not found carts`,message: showAllCarts })  
        }
      } catch (error) {
        //logger.error(`[ERROR][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] Ha ocurrido un error: ${error.message}`);
        res.status(500).send({ error: "Error interno del servidor" });
      }
}

export const getCart = async (req, res) => {
  const {cid} = req.params
  try {
 
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
  }          
  const showCart = await cartModel.findById(cid).populate('products.id_prod');

  if(showCart){
    res.status(200).send({ resultado: 'Ok', message: showCart })
    }else{
      res.status(404).send({ error: `Error`, message: showCart })  
    }
      }catch(error){

      res.status(500).send({ error: "Error interno del servidor" });
    }
}

export const postCart = async (req, res) => {
  try {
        const addNewCart = await cartModel.create({})
    if(addNewCart){
      res.status(200).send({ resultado: 'Se agrego un carrito', message: addNewCart })
    }else{
      res.status(404).send({ error: `don't create cart!` })  
    }
  } catch (error) {

    res.status(500).send({ error: "Error interno del servidor" });
  }
}
export const postCartProduct = async (req, res) => {
      const { cid, pid } = req.params; 
      const quantity = req.body.quantity;
      try {

        const cartRol = await cartModel.findById(cid);
        const userRol = await userModel.findOne({ cart: cartRol._id });
       
        if (userRol.rol === 'admin') {
          return res.status(403).json({ message: 'Los administradores no pueden ingresar productos' });
           }

        if (!mongoose.Types.ObjectId.isValid(cid)) {
          res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
            }            
        if (!mongoose.Types.ObjectId.isValid(pid)) {
          res.status(404).send({ error: `Error: el formato del producto no es válido`}) 
            }
      const addNewProductCart = await cartModel.findById(cid);
      if(addNewProductCart){
        addNewProductCart.products.push({ id_prod: pid, quantity: quantity })                
        await addNewProductCart.save();
        res.status(200).send({ resultado: 'Se agrego un producto al carrito', message: addNewProductCart })
      }else{
        res.status(404).send({ error: `Error!`, message:addNewProductCart })  
      }
       }catch(error){

        res.status(500).send({ error: "Error interno del servidor" });
       }
}
export const deleteCart = async (req, res) => {
      const {cid} = req.params
      try{
        
        if (!mongoose.Types.ObjectId.isValid(cid)) {
         res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
        } 
        const cartDelete = await cartModel.findByIdAndDelete(cid)
        if(cartDelete){
          res.status(200).send({ resultado: 'Se elimino el carrito', message: cartDelete })
        }else{
           res.status(404).send({ error: `Error`,menssage: cartDelete })  
        }
      }catch(error){
        res.status(500).send({ error: "Error interno del servidor" });
      }
}
export const deleteCartProduct = async (req, res) => {
    const {cid,pid}=req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
        }            
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            res.status(404).send({ error: `Error: el formato del producto no es válido`}) 
        }
      const deleteProductCart = await cartModel.findById(cid);

      if (deleteProductCart) {
        const index = deleteProductCart.products.findIndex(prod => prod.id_prod._id == pid);

        if (index!== -1) {
            const deleteProduct = deleteProductCart.products[index];
            deleteProductCart.products.splice(index, 1);
            await deleteProductCart.save();
            res.status(200).send({ resultado: 'Se eliminó el producto del carrito', message: deleteProduct });
        } else {
            res.status(404).send({ resultado:"Error: El producto no existe en el carrito"});
        }
    } else {
      res.status(404).send({ resultado:"Error: No se encontró el carrito"});
    }
    } catch (error) {

      res.status(500).send({ error: "Error interno del servidor" });
    }
}

export const deleteCartAllProducts = async (req, res) => {
  const {cid} = req.params
  try{
    
    if (!mongoose.Types.ObjectId.isValid(cid)) {
     res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
    } 
    const deleteProducts = await cartModel.findById(cid);    
    if(deleteProducts){    
        const deleteAll = await cartModel.findByIdAndUpdate(cid,{products:[]})
        res.status(200).send({ resultado: 'Se elimino todos los productos del carrito', message: deleteAll })
    }else{
        res.status(404).send({ error: `Error: El carrito no existe`})
         }
  }catch(error){
    res.status(500).send({ msg: "Error en deleteCartAllProducts", error: "Error interno del servidor" });
  }
}

export const putCart = async (req, res)=>{
    const {cid}= req.params
    const updateCart = req.body
 
    try{
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.status(404).send({ error: `Error: el formato del producto no es válido`}) 
        }
    const updateCartProducts = await cartModel.findById(cid)
    if(updateCartProducts){
        updateCart.forEach(prod => {
			const cartProduct = updateCartProducts.products.find(cartProd => cartProd.id_prod == prod.id_prod);
			if (cartProduct) {
				cartProduct.quantity += prod.quantity;
			} else {
				updateCartProducts.products.push(prod);
			} 
		    });
		    await updateCartProducts.save();
      res.status(200).send({ resultado: 'Se actualizo el carrito', message: updateCartProducts })
    }else{
      res.status(404).send({ error: `Error`,message: updateCartProducts })  
    }
     }catch(error){

      res.status(500).send({ error: "Error interno del servidor" });
     }
}

export const putCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
	const { quantity } = req.body;

  try{
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
    }            
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        res.status(404).send({ error: `Error: el formato del producto no es válido`}) 
    }
    const updateProduct = await cartModel.findById(cid);
    if(updateProduct){
        const product = updateProduct.products.find(prod => prod.id_prod._id == pid);
        if (product!=undefined) {
            product.quantity += quantity;
            await updateProduct.save();
            res.status(200).send({ resultado: 'Se actualizo el carrito', message: updateProduct })
        }
    }else{
      res.status(404).send({ error: `Error`, message: updateProduct })  
    }
     }catch(error){

      res.status(500).send({ error: "Error interno del servidor" });
     }
}

export const cartPurchase = async (req, res) => {
  const { cid } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(404).send({ error: `Error: el formato cid del carrito no es válido` });
    }

    const cart = await cartModel.findById(cid);
    const products = await productsModel.find();

    if (!cart) {
      return res.status(404).send({ resultado: 'Not Found cart' });
    }


    const email = await getEmailFromCart(cart);
    const rol = await getUserFromCart(cart)
    const { purchaseItems, failedProducts } = await processCartPurchase(cart.products, products);

    // Actualiza el carrito con los productos que no se pudieron comprar
    await cartModel.findByIdAndUpdate(cid, { products: failedProducts });

    // Genera un ticket con los datos de la compra
    const amount = purchaseItems.reduce((total, item) => total + item.price * item.quantity, 0);
    if (rol === 'premium') {
      amount *= 0.7;
    }
    // Llama al servicio de Tickets para generar el ticket con amount y email

    res.redirect(`http://localhost:8080/api/tickets/?amount=${amount}&email=${email}`);
  } catch (error) {
    res.status(500).send({ error: `Error del servidor en cartPurchase: ${error}` });
  }
};

async function getEmailFromCart(cart) {
  const user = await userModel.findOne({ cart: cart._id });
  return user.email;
}
async function getUserFromCart(cart) {
  const user = await userModel.findOne({ cart: cart._id });
  return user.rol;
}

async function processCartPurchase(cartProducts, allProducts) {
  const purchaseItems = [];
  const failedProducts = [];

  for (const cartProduct of cartProducts) {
    const product = allProducts.find(prod => prod._id == cartProduct.id_prod.toString());

    if (product && product.stock >= cartProduct.quantity) {
      // Resta el stock del producto y agrega el producto a la compra
      product.stock -= cartProduct.quantity;
      await product.save();
      purchaseItems.push({ title: product.title, price: product.price, quantity: cartProduct.quantity });
    } else {
      // Agrega el producto a la lista de productos que no se pudieron comprar
      failedProducts.push(cartProduct);
    }
  }

  return { purchaseItems, failedProducts };
}


/*
export const cartPurchase = async (req, res) => {
  const { cid } = req.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
      } 
      const cart = await cartModel.findById(cid);
      const products = await productsModel.find();
  
      if (cart) {
          const user = await userModel.findOne({ cart: cart._id });
          const email = user.email;
          let amount = 0;
          const purchaseItems = [];
          const productsNotPurchased = [];

          for (const item of cart.products) {
              const product = products.find(prod => prod._id == item.id_prod.toString());
              if (product.stock >= item.quantity) {
                  amount += product.price * item.quantity;
                  product.stock -= item.quantity;
                  await product.save();
                  purchaseItems.push(product.title);
              } else {
                  productsNotPurchased.push(item.id_prod); // Agregar ID de producto no comprado
              }
          }

          await cartModel.findByIdAndUpdate(cid, { products: productsNotPurchased });
          
          // Generar el ticket solo si hay productos comprados
          if (purchaseItems.length > 0) {
              const ticketResponse = await fetchTicketService(amount, email); // Debes implementar esta función
              res.status(200).send({ resultado: 'Compra completada', purchasedItems: purchaseItems, ticket: ticketResponse });
          } else {
              res.status(400).send({ message: 'No se compraron productos debido a la falta de stock' });
          }
      } else {
          res.status(404).send({ resultado: 'Not Found Cart', message: cart });
      } 
  } catch (error) {
      res.status(500).send({ error: `Error al procesar la compra: ${error}` });
  }
};
*/
/*
export const cartPurchase = async (req, res) => {
	const { cid } = req.params;
	try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.status(404).send({ error: `Error: el formato cid del carrito no es válido`}) 
      } 
		const cart = await cartModel.findById(cid);
		const products = await productsModel.find();

		if (cart) {
			const user = await userModel.find({ cart: cart._id });
			const email = user[0].email;
			let amount = 0;
			const purchaseItems = [];
			cart.products.forEach(async item => {
				const product = products.find(prod => prod._id == item.id_prod.toString());
				if (product.stock >= item.quantity) {
					amount += product.price * item.quantity;
					product.stock -= item.quantity;
					await product.save();
					purchaseItems.push(product.title);
				}
				//ticket?info=${amount}
			});

			await cartModel.findByIdAndUpdate(cid, { products: [] });
			res.redirect(
				`http://localhost:8080/api/tickets/?amount=${amount}&email=${email}`
			);
		} else {
			res.status(404).send({ resultado: 'Not Found cart'});
		}
	} catch (error) {
		res.status(500).send({ error: `Error del servidor en cartPurchase: ${error}` });
	}
};
*/
