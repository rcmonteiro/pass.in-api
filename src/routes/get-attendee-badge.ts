import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export const getAttendeeBadge = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {},
      }
    }, async (request, reply) => {
      const { attendeeId } = request.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          public_id: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: attendeeId
        }
      })

      if (attendee === null) {
        throw new Error("Attendee not found")
      }

      return reply.send({ attendee })
    })
}