import { Router } from "express";
import cartRouter from './cartController.routes.js'
import productRouter from "./productsController.routes.js";
import sessionRouter from "./sessions.routes.js";
import userRouter from "./userController.routes.js";
import routerTicket from "./tickets.routes.js";
import { requestLogger } from "../middleware/requestLogger.js";
import { logger } from "../utils/logger.js";

const router = Router()

router.use('/api/product', requestLogger, productRouter)
router.use('/api/user', requestLogger, userRouter)
router.use('/api/carts', requestLogger, cartRouter)
router.use('/api/sessions', requestLogger, sessionRouter)
router.use('/api/tickets', requestLogger, routerTicket)
router.use('/loggerTest', (req, res) => {
    logger.debug('Prueba debug');
	logger.info('Test de info');
	logger.warning(
		`[WARNING][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] ha ocurrodo un Warning!`
	);
	logger.error(
		`[ERROR][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] se ha producido un error`
	);
	logger.fatal(
		`[ERROR FATAL][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] ocurrio error fatal!`
        );
        res.status(200).send('Testeo de logs correcta');
})

export default router