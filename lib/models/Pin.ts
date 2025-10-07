import mongoose, { Document, Schema } from 'mongoose'

export interface IPin extends Document {
  _id: string
  title: string
  description?: string
  imageUrl: string
  imageWidth?: number
  imageHeight?: number
  link?: string
  tags?: string[]
  userId: string
  boards: string[]
  likes: string[]
  comments: string[]
  saves: string[]
  createdAt: Date
  updatedAt: Date
}

const PinSchema = new Schema<IPin>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageWidth: {
    type: Number,
    default: 400
  },
  imageHeight: {
    type: Number,
    default: 600
  },
  link: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  boards: [{
    type: Schema.Types.ObjectId,
    ref: 'Board'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  saves: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

// Index for faster queries
PinSchema.index({ userId: 1 })
PinSchema.index({ tags: 1 })
PinSchema.index({ createdAt: -1 })

export default mongoose.models.Pin || mongoose.model<IPin>('Pin', PinSchema)
