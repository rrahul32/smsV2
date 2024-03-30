import { Schema, Types } from 'mongoose'

export const usersSchema = new Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: () => {
        return new Types.ObjectId().toString()
      }
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    academicYear: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'users',
    timestamps: true
  }
)
