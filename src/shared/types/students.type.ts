import { Classes, Sections } from '@shared/constants'
import { ServerResponse } from './common.type'

export type Student = {
  _id: string
  name: string
  fatherName: string
  class: Classes
  section: Sections
  phone: number
  admissionFee: number
  tuitionFee: number
  conveyanceFee: number
  booksTotal: number
  uniformTotal: number
  joinedFrom: number
  createdAt: Date
}

export type AddStudentProps = Omit<Student, '_id' | 'createdAt'>

export type AddStudentResponse = ServerResponse<boolean>

export type GetStudentsParams = {
  searchText?: string
  limit?: number
  page?: number
  filter?: {
    classes?: Classes[]
    sections?: Sections[]
  }
}

export type GetStudentsResponse = ServerResponse<{
  list: Student[]
  totalCount: number
}>

export type SearchStudentsResponse = ServerResponse<{
  list: Student[]
}>

export type DueListItem = Student & {
  totalMiscDue: number
  totalFeesDue: number
  totalDue: number
}

export type GetDueListResponse = ServerResponse<{
  list: DueListItem[]
}>

export type SearchStudentsParams = {
  searchText: string
}
