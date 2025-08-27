import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'blog_app'
    })
    isConnected = true
    console.log('connected')
  } catch (err) {
    console.error('connection error:', err)
  }
}
