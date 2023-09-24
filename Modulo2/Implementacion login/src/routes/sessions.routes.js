import { Router } from "express";
import { userModel } from "../dao/models/users.models.js";

const sessionRouter = Router()

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    //console.log("que es: ",req.session.login)
    try {
        if (req.session.login){
            res.status(200).send({ resultado: 'Login ya existente' })
            return;
        }
        if (email === 'adminCoder@coder.com'){
            if(password === '1234'){
                req.session.login = true;
			    req.session.user = {
				first_name: 'Coder',
				last_name: 'House',
				age: 26,
				email: email,
				rol: 'admin',
			    };
            res.status(200).send({ resultado: 'Login exitoso', message: email })
			//res.redirect('../../static/realTimeProducts');
			return;
            }else{
                res.status(400).send({resultado: 'constraseña incorrecta'});
            }
        }else{
                   const user = await userModel.findOne({ email: email })
        if (user) {
            if (user.password == password) {
				req.session.login = true;
				req.session.user = {
					first_name: user.first_name,
					last_name: user.last_name,
					age: user.age,
					email: user.email,
					rol: user.rol,
				};
                res.status(200).send({ resultado: 'Login usuario comun', message: email })
				//res.redirect('../../static/realTimeProducts');
                return;
            } else {
				res.status(400).send({resultado: 'constraseña incorrecta'
				});
			}
        }else{
            res.status(400).send({resultado: 'email incorrecto'})
            }  
        } 
        }catch (error) {
            console.error("Error en sessionRouter post:", error);
            res.status(500).send({ error: "Error interno del servidor" });
            }
})
sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.status(200).send({ resultado: 'Login eliminado' })
})

export default sessionRouter