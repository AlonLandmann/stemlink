import mongoose from 'mongoose'

const connection = {}

export default async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  const dbUri = process.env.MONGO_URI
  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }
  const db = await mongoose.connect(dbUri, dbOptions)

  connection.isConnected = db.connections[0].readyState
}
