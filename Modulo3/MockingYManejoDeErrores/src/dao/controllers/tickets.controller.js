import {ticketModel} from '../models/ticket.models.js';
import { v4 as uuidv4 } from 'uuid';

export const getTickets = async (req, res) => {
	try {
		const tickets = await ticketModel.find();
		if(tickets){
		res.status(200).send({ response: tickets });
		}else{
			res.status(404).send({ error: `Not found tickets`, message: tickets })  
		}
	} catch (error) {
		res.status(500).send({ error: `Error al consultar tickets ${error}` });
	}
};

export const postTicket = async (req, res) => {
	const { amount, email } = req.query;
	try {
        const ticket = {
            code: uuidv4(),
            amount: amount,
            purchaser: email,
        };

        // Verifica si existe un ticket con el mismo código
        const existingTicket = await ticketModel.findOne({ code: ticket.code });
        if (existingTicket) {
            res.status(400).send({ error: 'Ya existe un ticket con el mismo código', message: existingTicket });
        } else {
            // Si no existe, crea el nuevo ticket
            const newTicket = await ticketModel.create(ticket);
            res.status(201).send({ response: 'Ticket generado con éxito', message: newTicket });
        }
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el ticket ${error}` });
	}
};

