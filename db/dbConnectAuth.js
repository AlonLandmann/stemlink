import { MongoClient } from 'mongodb'

const dbUri = process.env.MONGO_URI
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(dbUri, dbOptions)
    global._mongoClientPromise = client.connect()
  }

  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(dbUri, dbOptions)

  clientPromise = client.connect()
}

export default clientPromise
