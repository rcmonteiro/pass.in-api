import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { getEvents } from "./routes/get-events";
import { registerForEvent } from "./routes/register-for-event";

const app = fastify()

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvents)
app.register(getAttendeeBadge)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running at http://localhost:3333')
})