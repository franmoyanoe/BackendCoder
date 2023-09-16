import  { productsModel }  from "../models/products.models.js"

  export default class ProductManagerMongo{

    getProducts = async (limit) => {
        try {
            const products = await productsModel.find().limit(limit);
            return products
        } catch (error) {
            console.error("Se ha producido un error en productManagerMongo getProducts:", error);
            return 'error'
        }
    }


  getProductById = async (id) => {
    try {
        const prod = await productsModel.findById(id)
        return prod 
    } catch (error) {
        console.error("Error en productManagerMongo getProductById:", error);
        return 'error'
    }
}

addProduct = async (product) => {
  try {
      await productsModel.create(product);
      return await productsModel.findOne({ title: product.title })
  }
  catch (error) {
    console.error("Error en productManagerMongo addProduct:", error);
    return 'error'
  }
}
      
updateProduct = async (id, product) => {
  try {
      return await productsModel.findByIdAndUpdate(id, { $set: product });
  } catch (error) {
    console.error("Error en productManagerMongo addProduct:", error);
    return 'error'
  }

}

    

      
      deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error en productManagerMongo deleteProduct:", error);
            return 'error'
        }

    }

}
