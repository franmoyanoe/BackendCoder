import { Router } from "express";
import {getUsers, postUser, passwordRecovery, resetPassword} from '../controllers/user.controller.js'


const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.post('/', postUser)  
userRouter.post('/password-recovery',passwordRecovery)
userRouter.post('/reset-password/:token', resetPassword)


export default userRouter