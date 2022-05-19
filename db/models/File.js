import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
  savedLinks: [String]
})

export default mongoose.models.File || mongoose.model('File', fileSchema)
