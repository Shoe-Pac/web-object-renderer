import app from './app/app'
import { config } from './app/config'
import connectDB from './database/database'
import { startApolloServer } from './plugins/apolloServer'

const startServer = async () => {
  try {
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully!')

    //Use dynamic port for production ( Renderer will set the port )
    const port = process.env.PORT || config.serverPort

    console.log(`Starting Fastify server...`)
    await app.listen({ port: Number(port) })
    console.log(`Fastify server running at ${port}`)

    await startApolloServer(app)
    console.log(`Apollo GraphQL server running at ${port}/graphql`)
  } catch (error) {
    console.error('Error while starting server:', error)
    process.exit(1)
  }
}

startServer()
