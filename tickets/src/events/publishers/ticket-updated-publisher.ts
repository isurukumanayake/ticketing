import { Publisher, Subjects, TicketUpdatedEvent } from "@ik1tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
