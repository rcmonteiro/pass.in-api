import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { BadRequest } from "./_errors/bad-request"

export const getAttendeeBadge = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
      schema: {
        summary: 'Get an attendee badge',
        tags: ['attendees'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              public_id: z.string(),
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              checkInURL: z.string()
            })
          })
        },
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
        throw new BadRequest("Attendee not found")
      }

      const { name, email, public_id, event } = attendee

      const baseURL = `${request.protocol}://${request.hostname}`
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

      return reply.send({ 
        badge: {
          name,
          email,
          public_id,
          eventTitle: event.title,
          checkInURL: checkInURL.toString()
        }
      })
    })
}