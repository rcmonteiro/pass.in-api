import { FastifyInstance } from "fastify"
import { ZodError } from "zod"
import { BadRequest } from "./routes/_errors/bad-request"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ 
      message: `Error validating request`, 
      errors: error.flatten().fieldErrors
    })  
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message})  
  }
  
  return reply.status(500).send({ message: 'Internal Server Error'})
}