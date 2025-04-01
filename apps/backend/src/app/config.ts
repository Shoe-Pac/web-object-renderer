import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  serverPort: Number(process.env.BACKEND_SERVER_PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET as string,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4001',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/wor'
}
