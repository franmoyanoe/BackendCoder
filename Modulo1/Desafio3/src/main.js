
import express from 'express';
//import { promises as fs } from 'fs';
import ProductManager from './ProductManager.js';
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productManager = new ProductManager('./productos.json');


app.get('/', (req, res) => {
  res.send("Hola desde la página de inicio, este es el desafio 3 ");
});

/*
app.get('/getProducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/
app.get('/products', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      const limit = parseInt(req.query.limit);
      console.log(`query : ${limit}`);
  
      if (!isNaN(limit) && limit > 0) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
      } else {
        res.json(products);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //Ej    /products?limit=1
  app.get('/products/:pid', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      const productId = parseInt(req.params.pid);
      console.log(`pid: ${productId}`);
  
      if (!isNaN(productId)) {
        const product = products.find(p => p.id === productId);
        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ error: 'Producto no encontrado' });
        }
      } else {
        res.status(400).json({ error: 'Invalido ID' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //Ej de uso     /products/2
  
app.get('*', (req, res) => {
  res.send("Error 404");
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});


