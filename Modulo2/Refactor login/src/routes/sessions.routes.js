import { Router } from "express";
import { userModel } from "../dao/models/users.models.js";
import { validatePassword } from "../utils/bcrypt.js";
import passport from "passport";

const sessionRouter = Router()

/*
sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    //console.log("que es: ",req.session.login)
    try {
        if (req.session.login){
            res.status(200).send({ resultado: 'Login ya existente' })
            return;
        }
        if (email === 'adminCoder@coder.com'){
            if(password === '123'){
                req.session.login = true;
			    req.session.user = {
				first_name: 'Franco',
				last_name: 'Franco',
				age: 26,
				email: email,
				rol: 'admin',
			    };
            //res.status(200).send({ resultado: 'Login exitoso', message: email })
			res.redirect('../../static/products');
			return;
            }else{
                res.status(400).send({resultado: 'contraseña incorrecta'});
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
                //res.status(200).send({ resultado: 'Login usuario comun', message: email })
				res.redirect('../../static/products');
                return;
            } else {
				res.status(400).send({resultado: 'contraseña incorrecta'
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
*/

//Uso de validacion de password
/*
    {
    "email":"lex@lex.com",
    "password":"123"
    }
*/

    sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.login) {
            res.status(200).send({ resultado: 'Login ya existente' })
        } else {
            const user = await userModel.findOne({ email: email })

            if (user) {
                if (validatePassword(password, user.password)) {
                    req.session.login = true
                    res.status(200).send({ resultado: 'Login valido', message: user })
                } else {
                    res.status(401).send({ resultado: 'Unauthorized' })
                }
            } else {
                res.status(404).send({ resultado: 'Not Found' })
            }
        }
    } catch (error) {
        res.status(400).send({ error: `Error en login: ${error}` })
    }
})



//Autenticacion con github
/*
sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Invalidate user" })
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({ payload: req.user })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
})



sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ mensaje: 'Usuario creado' })
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Session creada' })
})
*/
sessionRouter.get('/logout', (req, res) => {

    //if (req.session.login) 
    if (req.session){
        req.session.destroy()
    }
    console.log(req.session)
    //res.redirect('http://localhost:8080/static/login'); 
    res.status(200).send({ resultado: 'Login eliminado' })
})
export default sessionRouter