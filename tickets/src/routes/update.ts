import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ik1tickets/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price });

    const ticketUpdate = await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticketUpdate.id,
      title: ticketUpdate.title,
      price: ticketUpdate.price,
      userId: ticketUpdate.userId,
      version: ticketUpdate.version,
    });

    res.send(ticketUpdate);
  }
);

export { router as updateTicketRouter };
