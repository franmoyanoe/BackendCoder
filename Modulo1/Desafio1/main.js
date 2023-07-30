class Product{ // inicio contructor con la plantilla de las propiedades del producto
    constructor(title,description,price,thumbnail,code,stock){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.id = Product.incrementarId() // Mi Id es el resultado de lo que devuelva la funcion incrementarId
    }

    static incrementarId(){
        //si existe esta propiedad, la aumento en 1 o la creo
        if(this.idIncrement){
            this.idIncrement++
        }else{
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}
class ProductManager{
    constructor(){
        this.products = [] // incializo el contructor vacio
    }
    addProduct(product){
        if(!this.products.some((productBD)=> productBD.code == product.code)){ // si producto.code NO está repetido
            if(!Object.values(product).some((prop)=>prop == undefined)){ // si no le falta ninguna propiedad al producto lo agrego
                this.products.push(product)
            }
            else{ // mensaje si le falta una propiedad al producto
                console.log('Producto con propiedad faltante')
            }
        }else{ // mensaje si producto.code está repetido
            console.log('Producto con codigo repetido')
        }
        

    }
    getProducts(){
       return this.products // devuelve los productos creados
    }
    getProductById(id){
        let search = this.products.find((productBD)=>productBD.id == id) // Busqueda por Id, si existe muestro el producto
        if (search) {
            return search
        }else{
            return 'Not Found' // no existe el producto
        }
    }
}

let productManager = new ProductManager() //agrego producto

console.log('Productos: ',productManager.getProducts())

// Pruebas

productManager.addProduct(new Product("Producto Prueba A","Es un producto prueba",700,"imagen1","AEIOU",32))
productManager.addProduct(new Product("Producto Prueba B","Es un producto prueba",500,"imagen2","ABCDF",50))
productManager.addProduct(new Product("Producto Prueba C","Es un producto prueba",800,"imagen3","ZXCVG",10))
console.log('Productos: ',productManager.getProducts())

console.log('Buscar producto con id 1:', productManager.getProductById(1))
console.log('Buscar producto con id 3:', productManager.getProductById(3))