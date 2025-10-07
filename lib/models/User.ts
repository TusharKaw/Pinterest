import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  username: string
  password: string
  avatar?: string
  bio?: string
  website?: string
  followers: string[]
  following: string[]
  isGuest: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 160,
    default: ''
  },
  website: {
    type: String,
    default: null
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isGuest: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for faster queries
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
