import { Router } from "express";
import {getCarts, getCart, postCart, postCartProduct, deleteCart, deleteCartProduct, deleteCartAllProducts, putCart, putCartProduct, cartPurchase} from '../dao/controllers/cart.controller.js'

const cartRouter =Router()

cartRouter.get('/', getCarts)
cartRouter.get('/:cid', getCart)
cartRouter.post('/', postCart)
cartRouter.post('/:cid/products/:pid', postCartProduct)
cartRouter.delete('/:cid', deleteCart)
cartRouter.delete('/:cid/products/:pid', deleteCartProduct)
cartRouter.delete('/:cid/deleteProducts', deleteCartAllProducts)
cartRouter.put('/:cid', putCart)
cartRouter.put('/:cid/products/:pid', putCartProduct)
cartRouter.post('/:cid/purchase', cartPurchase);

export default cartRouter