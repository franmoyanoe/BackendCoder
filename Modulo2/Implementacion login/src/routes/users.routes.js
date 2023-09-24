import { Router } from "express";
import { userModel } from "../dao/models/users.models.js";

const userRouter = Router()

userRouter.post('/', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    try {
        const user = await userModel.findOne({email:email})
        if(!user){
            const response = await userModel.create({ first_name, last_name, email, password, age })
            res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
        }else{
            res.status(400).send({
				respuesta: `Error al crear usuario`,
				message: 'Usuario existente',
			});
        }
        
    } catch (error) {
        console.error("Error en userRouter post:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }

})

userRouter.get('/', async (req, res) => {
	try {
		const allUsers = await userModel.find();
        if(allUsers){
            res.status(200).send({resultado: "Todos los usuarios",message: allUsers});
        }else{
		res.status(400).send({ message: `No hay usuarios cargados` });            
        }	
	} catch (error) {
        console.error("Error en userRouter get:", error);
        res.status(500).send({ error: "Error interno del servidor" });
	}
});

export default userRouter