import { PaymentTypes } from '@shared/constants'
import { ServerResponse } from './common.type'
import { Student } from './students.type'

export type Payment = {
  _id: string
  studentId: string
  type: PaymentTypes
  amount: number
  createdAt: Date
}
export type AddPaymentProps = Omit<Payment, '_id' | 'createdAt'>
export type AddPaymentsProps = {
  payments: Pick<Payment, 'amount' | 'type'>[]
  studentId: string
}
export type AddPaymentsResponse = ServerResponse<{
  list: Payment[]
}>
export type AddPaymentResponse = ServerResponse<boolean>
export type GetStudentPaymentsResponse = ServerResponse<{
  list: Payment[]
  totalMiscPaid: number
  totalFeesPaid: number
}>
export type GetPaymentListResponse = ServerResponse<{
  list: (Payment & {
    student: Student
  })[]
}>
export type GetStudentPaymentsParams = {
  studentId: string
}
