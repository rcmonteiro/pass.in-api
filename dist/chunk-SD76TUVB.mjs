import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-event.ts
import { customAlphabet } from "nanoid";
import { z } from "zod";
var registerForEvent = async (app) => {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    schema: {
      summary: "Register an attendee",
      tags: ["attendees"],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number().int().positive()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { name, email } = request.body;
    const [attendeeAlreadyRegistered, event, eventSeatsTaken] = await Promise.all([
      prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      }),
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        where: {
          eventId
        }
      })
    ]);
    if (event === null) {
      throw new BadRequest("Event not found");
    }
    if (attendeeAlreadyRegistered !== null) {
      throw new BadRequest("Attendee is already registered to the event");
    }
    if (event?.maximumAttendees && eventSeatsTaken >= event?.maximumAttendees) {
      throw new BadRequest("The maximum number of attendees for this event has been reached");
    }
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVXZ", 6);
    const public_id = nanoid();
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        public_id,
        eventId
      }
    });
    return reply.status(201).send({ attendeeId: attendee.id });
  });
};

export {
  registerForEvent
};
