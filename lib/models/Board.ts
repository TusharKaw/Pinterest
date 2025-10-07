import mongoose, { Document, Schema } from 'mongoose'

export interface IBoard extends Document {
  _id: string
  name: string
  description?: string
  isPrivate: boolean
  coverImage?: string
  userId: string
  pins: string[]
  saves: string[]
  createdAt: Date
  updatedAt: Date
}

const BoardSchema = new Schema<IBoard>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String,
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pins: [{
    type: Schema.Types.ObjectId,
    ref: 'Pin'
  }],
  saves: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

// Index for faster queries
BoardSchema.index({ userId: 1 })
BoardSchema.index({ isPrivate: 1 })

export default mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema)
