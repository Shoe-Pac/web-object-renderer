import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  serverPort: Number(process.env.BACKEND_SERVER_PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET as string,
  frontendUrl: 'http://localhost:4001'
}
