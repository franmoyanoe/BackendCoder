import { Router } from "express";
//import productModel from "../models/products.models.js";
import ProductManager from "../dao/MongoDB/productManagerMongo.js"

const productManager=new ProductManager()
const productRouter = Router()

//la ruta para probar http://localhost:8080/api/products?limit=4&page=1&sort=desc&category=Moto grande&status=true
productRouter.get("/",async(req,res)=>{

    const { limit = 10, page = 1, sort, category, status } = req.query
    const sortOption = sort === 'asc' ? 'price' : sort === 'desc' ? '-price' : null;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
  
    try{
    const products= await productManager.getProducts(query, { limit, page, sort: sortOption })
          if (typeof products != "string") {
          res.status(200).send({ resultado: 'OK', message: products });
          }else{
            res.status(404).send({ error: `Error!`, message:products })  
          }
       }catch(error){
            console.error("Error en productRouter get:", error);
            res.status(500).send({ error: "Error interno del servidor" });
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
        const newProduct = await productManager.addProduct(obj);

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

    const updatedproduct = await productManager.updateProduct(pid,obj);

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
    const deleteproduct = await productManager.deleteProduct(id);

    if (deleteproduct === 'error') {
        res.status(500).send({ error: "Hubo un error al intentar eliminar un nuevo producto." });
    } else if (deleteproduct.length === 0 || deleteproduct == null) {
        res.status(400).send({ error: `No hay producto para eliminar` })
    }else {
    res.status(200).send({ resultado: 'Producto eliminado correctamente', message: deleteproduct })
    }
})

export default productRouter