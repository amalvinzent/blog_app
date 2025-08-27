import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      role: { type: String }
    }
  },
  { timestamps: true }
)

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
