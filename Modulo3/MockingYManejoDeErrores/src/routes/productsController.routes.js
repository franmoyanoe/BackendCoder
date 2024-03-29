import { Router } from "express";
import { getProducts, getProduct, postProduct, putProduct, deleteProduct } from "../dao/controllers/product.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";
import { createRandomProducts } from "../dao/controllers/mocking.js";

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:id', getProduct)
productRouter.post('/', passportError('jwt'), authorization('user'), postProduct)
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), putProduct)
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProduct)
productRouter.post('/mockingProducts', createRandomProducts);

export default productRouter