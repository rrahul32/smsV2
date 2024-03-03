import { PaymentTypes } from '@shared/constants'
import { BSON } from 'realm'
import { ServerResponse } from './common.type'

export type Payment = {
  _id: BSON.ObjectId
  studentId: BSON.ObjectId
  type: PaymentTypes
  amount: number
  createdAt: Date
}
export type AddPaymentProps = Omit<Payment, '_id' | 'createdAt'>
export type AddPaymentResponse = ServerResponse<boolean>
