import fastify from "fastify"

const app = fastify()

app.get('/', () => {
  return 'Hello NLW Unite o/'
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running at http://localhost:3333')
})