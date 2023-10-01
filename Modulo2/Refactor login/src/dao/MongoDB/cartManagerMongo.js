import cartModel from "../models/carts.models.js"
import mongoose from 'mongoose';

export default class CartManager {
//Ingresar productos al carrito
    addProductCart = async(cid,pid,quantity)=>{
        try{
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                    return "Error: el formato del carrito no es válido";
             }            
             if (!mongoose.Types.ObjectId.isValid(pid)) {
                return "Error: el formato del producto no es válido";
             }
            const cart = await cartModel.findById(cid);
            if (cart) {
                cart.products.push({ id_prod: pid, quantity: quantity })
                //const respuesta = await cartModel.findByIdAndUpdate(cid, cart)                    
                await cart.save();
                return cart
            }else{
                return "Not found Cart"
            }
             }catch(error){
            console.error("Error en addProductCart", error);
            }
    }
//Agregar un carrito
    addCart = async()=>{
        try{
        const newCart = cartModel.create({})
        return newCart
        }catch(error){
            console.error("Error en updateCartOneProduct", error);
        }
    }

//Eliminar todos los productos del carrito
deleteCartAllProducts = async(cid)=>{
    
    try{ 
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return "Error: el formato del carrito no es válido";
        }  
        const cart = await cartModel.findById(cid);    
    if(cart){    
        const cartDelete = await cartModel.findByIdAndUpdate(cid,{products:[]})
        return cartDelete
    }else{
        return "Error: El carrito no existe";
    }
    }catch(error){
        console.error("Error en deleteCartAllProducts",error);
        //throw error;
    }
}
//eliminar del carrito el producto seleccionado
deleteProductCart = async(cid,pid)=>{
    try { 
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return "Error: el formato del carrito no es válido";
        }            
        if (!mongoose.Types.ObjectId.isValid(pid)) {
        return "Error: el formato del producto no es válido";
        }
        const cart = await cartModel.findById(cid);
        if (cart) {
            const index = cart.products.findIndex(prod => prod.id_prod._id == pid);
            //console.log("el valor del index es: ",index)
            //console.log("el carrito es: ",cart.products[index])
            if (index!== -1) {
                const deletedProduct = cart.products[index];
                cart.products.splice(index, 1);
                await cart.save();
                return deletedProduct;
            } else {
                return "Error: El producto no existe en el carrito";
            }
        } else {
            return "Error: No se encontró el carrito";
        }
    } catch (error) {
        console.error("Error en deleteProductCart", error);
       // throw new Error("No existe ese producto"); // Propaga la excepción para que pueda ser manejada en la función principal
    } 
}

//Actualizar el carrito con un arreglo
updateCartAll = async(cid, updateCart)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return "Error: el formato del carrito no es válido";
        }
        const cart = await cartModel.findById(cid);
        if(cart){
            updateCart.forEach(prod => {
			const cartProduct = cart.products.find(cartProd => cartProd.id_prod == prod.id_prod);
			if (cartProduct) {
				cartProduct.quantity += prod.quantity;
			} else {
				cart.products.push(prod);
			} 
		    });
		    await cart.save();
            return cart
        }else{
            return "Error: el carrito no existe"
        }

    } catch (error) {
        console.error("Error en updateCartAll", error);
    }
} 


//Actualizar la cantidad del carrito
updateCartOneProduct = async(cid,pid, quantity)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return "Error: el formato del carrito no es válido";
        }            
        if (!mongoose.Types.ObjectId.isValid(pid)) {
        return "Error: el formato del producto no es válido";
        }
        const cart = await cartModel.findById(cid);
        if (cart) {
			const product = cart.products.find(prod => prod.id_prod._id == pid);
			if (product!=undefined) {
				product.quantity += quantity;
                await cart.save();
                return product
			} else {
				return "Error: El producto no existe en el carrito";
			}	
    }else{
        return "Error: No se encontró el carrito";
    }
} catch (error) {
        console.error("Error en updateCartOneProduct", error);
    }
}

//Mostrar los productos del carrito
showProductCar = async(cid)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return "Error: el formato cid del carrito no es válido";
        }          
        const cart = await cartModel.findById(cid).populate('products.id_prod');
        if(cart){
        return cart
        }else{
            return "Error: El carrito no existe";
        }
    }catch(error){
        console.error("Error en updateCartOneProduct", error);
    }
    }
    //Mostrar Carritos
    showAllCarts = async()=>{
        try {
            const allCarts = await cartModel.find();
            if(allCarts){
                //console.log(JSON.stringify(allCarts))
                return allCarts
            }else{
                return "No hay carritos"
            }
        } catch (error) {
            console.error("Error en showAllCarts", error);
        }
    }
};

