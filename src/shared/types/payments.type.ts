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
export type AddPaymentProps = {
  payment: Omit<Payment, '_id' | 'createdAt'>
}
export type AddPaymentsProps = {
  payments: AddPaymentProps['payment'][]
}
export type AddPaymentsResponse = ServerResponse<{
  list: Payment[]
}>
export type AddPaymentResponse = ServerResponse<boolean>

export type GetStudentPaymentsParams = {
  studentId: string
  page?: number
  limit?: number
}

export type GetPaymentsDbParams = {
  filter?: {
    studentIds?: string[]
    type?: PaymentTypes
  }
  limit?: number
  skip?: number
  sort?: {
    field: string
    sortOrder: 1 | -1
  }
  studentDetails?: boolean
}

export type GetPaymentsDbResponse = {
  totalCount: number
  count: number
  list: (Payment & {
    student?: Pick<Student, '_id' | 'class' | 'name' | 'section'>
  })[]
  totalMiscPaid: number
  totalFeesPaid: number
}

export type GetStudentPaymentsResponse = ServerResponse<GetPaymentsDbResponse>

export type GetPaymentListResponse = ServerResponse<GetPaymentsDbResponse>

export type GetPaymentListParams = Pick<GetPaymentsDbParams, 'limit' | 'sort' | 'filter'> & {
  page?: number
}
