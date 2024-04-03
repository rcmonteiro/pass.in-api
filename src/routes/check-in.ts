import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export const checkIn = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/check-in', {
      schema: {
        summary: 'Check-in an attendee',
        tags: ['check-ins'],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          201: z.null()
        }
      }
    }, async (request, reply) => {
      const { attendeeId } = request.params

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
      ])

      if (attendeeExists === null) {
        throw new BadRequest("Attendee not found")
      }

      if (attendeeHasCheckedIn !== null) {
        throw new BadRequest("Attendee has already checked in for this event")
      }

      await prisma.checkIn.create({
        data: {
          attendeeId
        }
      })

      return reply.status(201).send()
    })
}