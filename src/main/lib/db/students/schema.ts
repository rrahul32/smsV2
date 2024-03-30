import { Classes, Sections } from '@shared/constants'
import { Schema, Types } from 'mongoose'

export const studentsSchema = new Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: () => {
        return new Types.ObjectId().toString()
      }
    },
    name: {
      type: String,
      required: true
    },
    fatherName: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true,
      enum: Object.values(Classes)
    },
    academicYear: {
      type: Number,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    admissionFee: {
      type: Number,
      required: true
    },
    tuitionFee: {
      type: Number,
      required: true
    },
    conveyanceFee: {
      type: Number,
      required: true
    },
    booksTotal: {
      type: Number,
      required: true
    },
    uniformTotal: {
      type: Number,
      required: true
    },
    section: {
      type: String,
      enum: Object.values(Sections),
      required: true
    },
    joinedFrom: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'students',
    timestamps: true
  }
)
