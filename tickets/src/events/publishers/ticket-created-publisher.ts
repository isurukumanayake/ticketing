import { Publisher, Subjects, TicketCreatedEvent } from "@ik1tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
