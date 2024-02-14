import { Publisher, OrderCreatedEvent, Subjects } from "@ik1tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
