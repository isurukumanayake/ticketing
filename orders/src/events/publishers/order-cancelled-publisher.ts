import { Publisher, OrderCancelledEvent, Subjects } from "@ik1tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
