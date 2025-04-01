import Fastify, { FastifyInstance } from 'fastify'

describe('GET /', () => {
  let server: FastifyInstance

  beforeEach(() => {
    server = Fastify()
    server.get('/', async (request, reply) => {
      reply.send({ message: 'Hello API' })
    })
  })

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.json()).toEqual({ message: 'Hello API' })
  })
})
