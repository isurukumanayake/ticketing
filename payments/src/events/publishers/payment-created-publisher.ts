import { Publisher, PaymentCreatedEvent, Subjects } from "@ik1tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
