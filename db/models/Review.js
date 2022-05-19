import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  rating: Number,
  title: String,
  content: String,
  writtenAt: Date,
  writtenFor: String,
  writtenBy: String,
  upvotedBy: [String]
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
