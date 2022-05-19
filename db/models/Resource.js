import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  href: String,
  type: String,
  title: String,
  author: String,
  price: Number,
  topics: [String],
  publishedAt: Date,
  publishedBy: String,
  safetyStatus: String
})

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema)
