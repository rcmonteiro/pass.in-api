import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import z from "zod";
var checkIn = async (app) => {
  app.withTypeProvider().get("/attendees/:attendeeId/check-in", {
    schema: {
      summary: "Check-in an attendee",
      tags: ["check-ins"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const [attendeeExists, attendeeHasCheckedIn] = await Promise.all([
      prisma.attendee.findUnique({
        select: {
          id: true
        },
        where: {
          id: attendeeId
        }
      }),
      prisma.checkIn.findUnique({
        select: {
          attendeeId: true
        },
        where: {
          attendeeId
        }
      })
    ]);
    if (attendeeExists === null) {
      throw new BadRequest("Attendee not found");
    }
    if (attendeeHasCheckedIn !== null) {
      throw new BadRequest("Attendee has already checked in for this event");
    }
    await prisma.checkIn.create({
      data: {
        attendeeId
      }
    });
    return reply.status(201).send();
  });
};

export {
  checkIn
};
