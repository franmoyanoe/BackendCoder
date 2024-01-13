import {productsModel} from '../models/products.models.js'
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/info.js';

export const getProducts = async (req, res) => {

    const { limit = 10, page = 1, sort, category, status } = req.query
    const sortOption = sort === 'asc' ? 'price' : sort === 'desc' ? '-price' : null;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status

    try {
              // Validar el argumento 'limit'
              if (isNaN(limit) || parseInt(limit) <= 0) {
                return "Error: 'limit' debe ser un número positivo.";
              }

              // Validar el argumento 'page'
              if (isNaN(page) || parseInt(page) <= 0) {
                return "Error: 'page' debe ser un número positivo.";
              }

              // Validar el argumento 'sortOption'
              if (sortOption !== 'price' && sortOption !== '-price' && sortOption !== null) {
                return "Error: 'sort' debe ser 'asc', 'desc' o null.";
              }

              const products = await productsModel.paginate(query, { limit, page, sort: sortOption });

              if (products) {
                return res.status(200).send(products)
             }
    
            res.status(404).send({ error: "Productos no encontrados" })
        
        
    } catch (error) {
        res.status(500).send({ error: `Error en consultar productos ${error}` })
    }

}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productsModel.findById(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en consultar producto ${error}` })
    }
}

export const postProduct = async (req, res) => {

    

    const { title, description, code, price, stock, category } = req.body

    try {

        if(!title || !code || !price || !stock){
            const error = CustomError.createError({
                name: "Product creation error",
                cause: generateProductErrorInfo(title, code, price, stock),
                message: "Error trying to create product",
                code: EErrors.INVALID_TYPES_ERROR
            });
            res.status(400).send({ error });
            return;
        }

        const product = await productsModel.create({ title, code, price, stock })

        if (product) {
            return res.status(201).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({ error: `Llave duplicada` })
        } else {
            return res.status(500).send({ error: `Error en consultar producto ${error}` })
        }

    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body
    try {
        const product = await productsModel.findByIdAndUpdate(id, { title, description, code, price, stock, category })

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en actualizar producto ${error}` })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productsModel.findByIdAndDelete(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}