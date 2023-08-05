import {promises as fs} from 'fs'

class Product{
    constructor(title,description,price,thumbnail,code,stock){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.id = Product.incrementId()
    }
    static incrementId(){
        if(this.idIncrement){
            this.idIncrement++
        }else{
            this.idIncrement=1
        }
        return this.idIncrement
    }
}
class ProductManager{
    constructor(path){
        this.products = []
        this.path = path
    }

    getProducts = async () => {
      const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
      return products;
   }


      addProduct= async (product)=>{
        const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
        
        if(!products.some((productBD)=> productBD.code == product.code)){
            if(!Object.values(product).some((prop)=>prop == undefined)){
                products.push(product);
                await fs.writeFile(this.path,JSON.stringify(products))
                console.log('El producto fue agregado exitosamente')
            }
            else{
                console.log('Producto con propiedad faltante')
            }
        }
        else{
            console.log('Producto con codigo repetido')
        }
    }


    getProductById = async(id) =>{
        const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
        let result = products.find((productBD)=>productBD.id == id)
        if (result) {
            return result
        }
        else{
            return ' Producto no encontrado'
        }
    }
    updateProduct = async(id, product) => {
        const products = JSON.parse(await fs.readFile(path, 'utf-8'))
        const index = products.findIndex(prod => prod.id === id)
        if (index != -1) {
            products[index].title = product.title
            products[index].description = product.description
            products[index].price = product.price
            products[index].thumbnail = product.thumbnail
            products[index].code = product.code
            products[index].stock = product.stock
            await fs.writeFile(this.path, JSON.stringify(products))
        } 
        else {
            console.log("Producto no encontrado")
        }
    
    }
    deleteProduct = async(id) =>{
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const product = products.find(prod => prod.id === id)
    
        if (product) {
            await fs.writeFile(this.path, JSON.stringify(products.filter(prod => prod.id != id)));
        } 
        else {
            console.log("Producto no encontrado")
        }
    
    }
}

let productManager = new ProductManager('./productos.json')

console.log('Productos: ',productManager.getProducts())

productManager.addProduct(new Product("Producto Prueba","Este es un producto prueba",200,"sin imagen","abc123",25))

console.log('Productos: ',productManager.getProducts())

productManager.addProduct(new Product("Producto Prueba","Este es un producto prueba",200,"sin imagen","abc1234",25))

console.log(productManager.getProductById(0))
console.log(productManager.getProductById(1))