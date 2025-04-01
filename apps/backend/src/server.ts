import app from './app/app'
import { config } from './app/config'
import connectDB from './database/database'
import { startApolloServer } from './plugins/apolloServer'

const startServer = async () => {
  try {
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully!')

    console.log('Starting Apollo GraphQL server...')
    await startApolloServer(app)
    console.log(`Apollo GraphQL server running at http://localhost:${config.serverPort}/graphql`)

    console.log('Starting Fastify server...')
    await app.listen({ port: config.serverPort })
    console.log(`Fastify server running at http://localhost:${config.serverPort}`)
  } catch (error) {
    console.error('Error while starting server:', error)
    process.exit(1)
  }
}

startServer()
