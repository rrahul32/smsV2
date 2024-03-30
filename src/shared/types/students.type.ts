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
  academicYear: number
}

export type AddStudentProps = {
  userId: string
  details: Omit<Student, '_id' | 'createdAt' | 'academicYear'>
}

export type UpdateStudentParams = {
  id: string
  details: Omit<Student, '_id' | 'createdAt' | 'academicYear'>
}

export type AddStudentResponse = ServerResponse<boolean>

export type UpdateStudentResponse = ServerResponse<boolean>

export type GetStudentsParams = {
  userId: string
  searchText?: string
  limit?: number
  page?: number
  filter?: {
    classes?: Classes[]
    sections?: Sections[]
  }
}

export type GetStudentsDbParams = {
  limit?: number
  skip?: number
  filter: {
    academicYear: number
    searchText?: string
    classes?: Classes[]
    sections?: Sections[]
  }
}

export type GetStudentsDbResponse = {
  count: number
  totalCount: number
  list: Student[]
}

export type GetStudentsResponse = ServerResponse<GetStudentsDbResponse>

export type SearchStudentsResponse = ServerResponse<{
  list: Student[]
}>

export type DueListItem = Pick<Student, '_id' | 'class' | 'name' | 'section'> & {
  totalMiscDue: number
  totalFeesDue: number
  totalDue: number
}

export type GetDueListDbResponse = {
  totalCount: number
  count: number
  list: DueListItem[]
}
export type GetDueListResponse = ServerResponse<GetDueListDbResponse>

export type GetStudentResponse = ServerResponse<Student>

export type SearchStudentsParams = {
  searchText: string
  userId: string
}

export type GetStudentParams = {
  id: string
}

export type GetDueListDbParams = {
  limit?: number
  skip?: number
  filter: {
    academicYear: number
    classes?: Classes[]
    sections?: Sections[]
  }
  sort?: {
    sortField: 'class' | 'due'
    sortOrder: 1 | -1
  }
}

export type GetDueListParams = Omit<GetDueListDbParams, 'skip' | 'filter'> & {
  userId: string
  page?: number
  filter?: Omit<GetDueListDbParams['filter'], 'academicYear'>
}
