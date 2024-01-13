import { Router } from 'express';
import {getTickets, postTicket} from '../controllers/tickets.controller.js'
     

const routerTicket = Router();
//http://localhost:8080/api/tickets/
routerTicket.get('/', getTickets);
//http://localhost:8080/api/tickets/?amount=38&email=Nico@gmail.com
routerTicket.post('/', postTicket);


export default routerTicket;
