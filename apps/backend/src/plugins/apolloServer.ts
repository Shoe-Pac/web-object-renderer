import { ApolloServer } from '@apollo/server'
import ApolloServerFastifyPlugin from '@as-integrations/fastify'
import { FastifyInstance } from 'fastify'
import { buildSchema } from 'type-graphql'

import { UserResolver } from '../graphql/resolvers/UserResolver'

export const startApolloServer = async (app: FastifyInstance) => {
  try {
    const schema = await buildSchema({
      resolvers: [UserResolver]
    })

    const apollo = new ApolloServer({
      schema,
      csrfPrevention: false,
      allowBatchedHttpRequests: true
    })

    await apollo.start()
    await app.register(ApolloServerFastifyPlugin(apollo))
  } catch (error) {
    console.error('Error starting Apollo Server:', error)
    process.exit(1)
  }
}
