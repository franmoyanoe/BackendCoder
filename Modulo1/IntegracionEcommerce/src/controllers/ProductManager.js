import { promises as fs } from 'fs'
export default class ProductManager{
    constructor(path){
    
    this.path=path
    this.products=[]
    }

    async getProducts () {
        try{
            const productos = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            //console.log(productos)
            return productos
        } catch(error){
            //console.error('Error: ',error)
        }
    }

   async getProductById(pid){
        //En el productManager, la ruta esta en this.path
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = products.find(producto => producto.pid === pid)
        return prod
    }

    async addProduct(product){
        //Consulto el txt y lo parseo
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        product.pid = this.generateId(products)
        product.status= true;
        //Lo agrego al array al ya saber que no existe
        products.push(product)
        //Parsearlo y guardar el array modificado
        await fs.writeFile(this.path, JSON.stringify(products))
        return true;
    }
    async updateProduct(pid,product){
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = products.findIndex(prod => prod.pid === pid)
    
        if (indice != -1) {
            //Mediante el indice modifico todos los atributos de mi objeto
            products[indice].title = product.title
            products[indice].description = product.description
            products[indice].price = product.price
            products[indice].thumbnail = product.thumbnail
            products[indice].code = product.code
            products[indice].stock = product.stock
            products[indice].category = product.category
            
            await fs.writeFile(this.path, JSON.stringify(products))

            return true; // Retorna true para indicar éxito en la actualización
        } else {
            return false; // Retorna false si el producto no se encontró
        }
    }

    async deleteProduct(pid){
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prods = products.filter(prod => prod.pid != pid)
        await fs.writeFile(this.path, JSON.stringify(prods))

        return prods.length < products.length; // Devuelve true si se eliminó un producto, false si no se encontró          
    }

    generateId(products) {

        if (products.length === 0) {
            return 1;
        }
        const maxId = products.reduce((max, prod) => (prod.pid > max ? prod.pid : max), 0);
        return maxId + 1;
        }

}


