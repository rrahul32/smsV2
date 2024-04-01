import { GetPaymentListSortFields, PaymentTypes, SortOrder } from '@shared/constants'
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
    types?: PaymentTypes[]
  }
  limit?: number
  skip?: number
  sort?: {
    field: GetPaymentListSortFields
    sortOrder: SortOrder
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

export type GetPaymentListParams = Pick<GetPaymentsDbParams, 'limit' | 'sort'> & {
  filter?: {
    types?: PaymentTypes[]
  }
  page?: number
  userId: string
}
