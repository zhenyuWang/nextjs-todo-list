import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)
