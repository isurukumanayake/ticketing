import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@ik1tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
