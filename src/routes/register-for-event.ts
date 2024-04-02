import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"


export const registerForEvent = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', { 
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
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
      const { eventId } = request.params
      const { name, email } = request.body

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
      ])

      if (attendeeAlreadyRegistered !== null) {
        throw new Error("Attendee is already registered to the event")
        // return reply.status(401).send({ eventId: event.id })
      }

      if (event?.maximumAttendees && eventSeatsTaken >= event?.maximumAttendees) {
        throw new Error("The maximum number of attendees for this event has been reached")
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      })

      return reply.status(201).send({ attendeeId: attendee.id })

    })
}