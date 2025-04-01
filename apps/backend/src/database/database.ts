import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

import { config } from '../app/config'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {})
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
export const db = mongoose.connection
