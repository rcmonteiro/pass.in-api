import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
var getEventAttendees = async (app) => {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      summary: "Get an event attendees",
      tags: ["attendees"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        pageIndex: z.string().nullish().default("0").transform(Number),
        perPage: z.string().nullish().default("10").transform(Number),
        query: z.string().nullish()
      }),
      response: {
        200: z.object({
          pageIndex: z.number(),
          perPage: z.number(),
          total: z.number(),
          attendees: z.array(
            z.object({
              id: z.number(),
              public_id: z.string(),
              name: z.string(),
              email: z.string(),
              createdAt: z.date(),
              checkinAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, perPage, query } = request.query;
    const event = await prisma.event.findUnique({
      select: {
        id: true
      },
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Event not found");
    }
    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        public_id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: query ? {
        eventId,
        name: {
          contains: query
        }
      } : {
        eventId
      },
      take: perPage,
      skip: pageIndex * perPage,
      orderBy: {
        createdAt: "desc"
      }
    });
    const attendeesCount = await prisma.attendee.count({
      where: {
        eventId
      }
    });
    return reply.status(200).send({
      pageIndex,
      perPage,
      total: attendeesCount,
      attendees: attendees.map((attendee) => {
        return {
          id: attendee.id,
          public_id: attendee.public_id,
          name: attendee.name,
          email: attendee.email,
          createdAt: attendee.createdAt,
          checkinAt: attendee.checkIn?.createdAt ?? null
        };
      })
    });
  });
};

export {
  getEventAttendees
};
