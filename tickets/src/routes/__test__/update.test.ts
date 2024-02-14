import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "test2",
      price: 100,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: -20,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  const title = "test2";
  const price = 100;

  const updatedTicket = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(updatedTicket.body.title).toEqual(title);
  expect(updatedTicket.body.price).toEqual(price);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  const title = "test2";
  const price = 100;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test2",
      price: 100,
    })
    .expect(400);
});
