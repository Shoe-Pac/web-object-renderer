import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/wor'

    await mongoose.connect(dbUri, {})
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
export const db = mongoose.connection
