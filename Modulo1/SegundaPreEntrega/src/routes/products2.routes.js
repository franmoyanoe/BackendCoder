import { Router } from "express";
//import productModel from "../models/products.models.js";
import ProductManager from "../dao/MongoDB/productManagerMongo.js"

const manager=new ProductManager()
const productRouter = Router()


productRouter.get("/",async(req,res)=>{
    const { limit } = req.query
    const products= await manager.getProducts(limit)

      if (products === 'error') {
        res.status(500).send({ error: "Hubo un error al consultar productos." });
      } else if (products.length === 0) {
        res.status(400).send({ error: `Error al consultar productos: ${error}` })
        //res.json("No hay productos en la tienda");
      } else {
        //res.json({message:"success",products})
        res.status(200).send({ resultado: 'OK', message: products });
      }
  })

productRouter.get('/:id', async (req, res) => {
    const { id } = req.params
        const product = await productModel.findById(id)

      if (product === 'error') {
        res.status(500).send({ error: "Hubo un error al buscar el producto." });
      } else if (product.length === 0) {
        res.status(400).send({ error: `Error no hay producto en la lista` })
        //res.json("No hay productos en la tienda");
      } else {
        //res.json({message:"success",products})
        res.status(200).send({ resultado: 'OK', message: product });
      }
})

productRouter.post('/', async (req, res) => {
        const obj=req.body
        const newProduct = await manager.addProduct(obj);

        if (newProduct === 'error') {
            res.status(500).send({ error: "Hubo un error al intentar agregar un nuevo producto." });
        } else if (newProduct.length === 0) {
            res.status(400).send({ error: `Producto ingresado vacio` })
        }else {
        res.status(200).send({ resultado: 'Producto agregado correctamente', message: newProduct })
        }

})

productRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { obj } = req.body

    const updatedproduct = await manager.updateProduct(pid,obj);

    if (updatedproduct === 'error') {
        res.status(500).send({ error: "Hubo un error al intentar actualizar el producto." });
    } else if (updatedproduct.length === 0) {
        res.status(400).send({ error: `Producto ingresado vacio` })
    }else {
    res.status(200).send({ resultado: 'Producto actualizado correctamente', message: updatedproduct })
    }
})

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    const deleteproduct = await manager.deleteProduct(id);

    if (deleteproduct === 'error') {
        res.status(500).send({ error: "Hubo un error al intentar eliminar un nuevo producto." });
    } else if (deleteproduct.length === 0 || deleteproduct == null) {
        res.status(400).send({ error: `No hay producto para eliminar` })
    }else {
    res.status(200).send({ resultado: 'Producto eliminado correctamente', message: deleteproduct })
    }
})

export default productRouter