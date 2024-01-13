import { faker } from "@faker-js/faker"
import { productsModel } from "../models/products.models.js"

const modelProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        status: true,
        code: faker.string.alphanumeric(5),
        thumbnails: [faker.image.url()]
    }
}
export const createRandomProducts = async (req, res) => {
    try {
        const products = [];

        for (let i = 0; i < 2; i++) {
            let newProduct = modelProducts();

            // Verificar si el código ya existe
            const existingProduct = await productsModel.findOne({ code: newProduct.code });

            if (!existingProduct) {
                products.push(newProduct);
            }
        }

        // Insertar solo los productos que no tienen códigos duplicados
        await productsModel.create(products);

        res.status(200).send({ resultado: 'Se crearon productos Random exitosamente' });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor", error });
    }
};
