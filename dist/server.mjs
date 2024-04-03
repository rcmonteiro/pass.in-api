import {
  errorHandler
} from "./chunk-V2JRBESW.mjs";
import {
  checkIn
} from "./chunk-5QY7ER47.mjs";
import {
  createEvent
} from "./chunk-N2B6NICL.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-CR2BJ2LL.mjs";
import {
  getEventAttendees
} from "./chunk-K7LMDMGH.mjs";
import {
  getEvents
} from "./chunk-2M7M2XJX.mjs";
import {
  registerForEvent
} from "./chunk-6L2PZQTP.mjs";
import "./chunk-JV6GRE7Y.mjs";
import "./chunk-JRO4E4TH.mjs";

// src/server.ts
import { fastifyCors } from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
  // In production, we use the front-end production domain
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvents);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running at http://localhost:3333");
});
