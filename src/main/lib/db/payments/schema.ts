import { PaymentTypes } from '@shared/constants'
import { Schema, Types } from 'mongoose'

export const paymentsSchema = new Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: () => {
        return new Types.ObjectId().toString()
      }
    },
    studentId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(PaymentTypes)
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'payments',
    timestamps: true
  }
)
