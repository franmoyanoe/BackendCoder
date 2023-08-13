import {promises as fs} from 'fs'

export default class ProductManager{
    constructor(path){
        this.products = []
        this.path = path
    }

    getProducts = async () => {
        try{
            const productos = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            //console.log(productos)
            return productos
        } catch(error){
            //console.error('Error: ',error)
        }
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
        const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
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

//const productManager = new ProductManager('./productos.json')

const producto1 = new Product("Galaxy","S21ultra",250000,"Sin imagen","abcd",100)
const producto2 = new Product("Motorola","MotoG9",150000,"Sin imagen","bcd",50)
const producto3 = new Product("Xiaomi","PocoF3",220000,"Sin imagen","vbn",300)
const producto4 = new Product("Iphone","14Pro",500000,"Sin imagen","lkj",50)




//console.log('Productos: ',productManager.getProducts())

//productManager.addProduct(new Product("Producto Prueba","Este es un producto prueba",200,"sin imagen","abc123",25))

/*console.log('Productos: ',productManager.getProducts())

productManager.addProduct(new Product("Producto Prueba","Este es un producto prueba",200,"sin imagen","abc1234",25))

console.log(productManager.getProductById(0))
console.log(productManager.getProductById(1))*/